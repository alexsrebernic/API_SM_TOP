const async = require('async');
const Post = require('../models/post')
const jwt = require("jsonwebtoken");
const { body,validationResult } = require('express-validator');
const io = require('../utils/websocket/index')
const moment = require("moment");
const User = require('../models/user');
const Notification = require('../models/notification');

exports.posts_get = function(req,res,next){
    Post
    .find()
    .sort({'date':-1})
    .limit(10)
    .populate("author",{"full_name":1,"profile_img":1,"_id":1})
    .exec((err,posts) => {
        if(err){next(err)}
        return res.status(200).json(posts)
    })
}
exports.posts_paginate_get = function(req,res,next){
    const page = req.params.page
    Post.paginate(page, function(err, posts) {
        if (err) {
            return res.status(500).json({
                message : "Error en aplicacion",
                error : err
            });
        }
        return res.status(200).json(posts);
    });
    
}


exports.post_delete = function(req,res,next){
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData) => {
        if (err){return res.status(403)}
        Post.findByIdAndDelete(req.params.id,(err,post) => {
            if(err){return next(err)}
            User.findByIdAndUpdate(post.author,{$pull:{posts:post._id}},{new:true},(err,user) => {
              if(err){return next(err)}
            })
            return res.status(200).json({message:"Post deleted"})
        })
    })
   
}
exports.post_get = function(req,res,next){
    Post.findById(req.params.id)
    .populate('author',{full_name:1,profile_img:1,_id:1})
    .populate('comments')
    .exec((err,post) => {
        if(!(post)) return res.status(404).json({message:"Post doesn't exists"})
        if(err){return next(err)}

        Post.populate(post.comments, {
            path:'author',
            select: 'full_name profile_img _id'
        },(err,comments) => {
            if(err){return next(err)}
            res.status(200).json({comments,post})
        })
    })
}
exports.posts_post = function(req,res,next){
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData) => {
        if(err){return res.status(403)}
        const {content,images,author,date} = req.body;
        body('content', 'Content m.').trim().isLength({ min: 1 }).escape(),
        body('date.*').escape();
            const errors = validationResult(req);
            if(!(errors.isEmpty())){
                return res.json(errors)
            }
            const post = new Post({
                content,
                images,
                author,
                date,
                
            }).save((err,postSaved) => {
                if(err){return next(err)};
                Post.populate(postSaved, {
                    path:'author',
                    select: 'full_name profile_img _id'
                },(err,postPopulated) => {
                    if(err){return next(err)}
                    io.emit('post:create',postPopulated)
                })
                User.findByIdAndUpdate(authData.user._id,{$push:{"posts":{$each:[postSaved],$position:0}}},(err,user) => {
                    if(err){return next(err)}
                res.status(201).json({message:"post created",id:postSaved._id,user})
                })
            })
    
    })
}
exports.post_like_post = (req,res,next) => {
    const {id,creator_of_post} = req.params
    const {author} = req.body
    Notification.find({author,post:id,like:true},{},(err,user) => {
        if(err){return next(err)}
        if(!(user.length)){
            console.log(author !== creator_of_post)
            if(author !== creator_of_post){
                const notification = new Notification({
                    author,
                    like:true,
                    clicked:false,
                    post:id
                }).save((err,notificationSaved) => {
                    if(err){return next(err)}
                    User.findByIdAndUpdate(creator_of_post,{$push:{"notifications":{$each:[notificationSaved._id],$position:0}}},{new:true},(err,user) => {
                        if(err){return next(err)}
                    })
                })
            }
        }
        Post.findByIdAndUpdate(id,{'$push':{"likes":author}},{new: true})
        .populate("author",{"full_name":1,"profile_img":1,"_id":1})
        .exec((err,post) => {
            if(err){return next(err)}
            io.emit("post:update",post)
            res.status(201).json('post liked')
        })
    })
  
   
}
exports.post_dislike_post = (req,res,next) => {
    const {id} = req.params
    const {author} = req.body
        Post.findByIdAndUpdate(id,{'$push':{"dislikes":author}},{new: true})
        .populate("author",{"full_name":1,"profile_img":1,"_id":1})
        .exec((err,post) => {
            if(err){return next(err)}
            io.emit("post:update",post)
            res.status(201).json('post disliked')
        })
}

exports.post_undolike_post = (req,res,next) => {
    const {id} = req.params
    const {author,idNotification} = req.body
    /*
        User.findByIdAndUpdate(author,{$pull:{notifications:idNotification}},{new:true},(err,user) => {
            if(err){return next(err)}
            io.emit("user:updated",user)
        })
      */
   
        Post.findByIdAndUpdate(id,{$pull:{likes:author}},{new: true})
        .populate('author',{"full_name":1,"profile_img":1,"_id":1})
        .exec((err,post) => {
            console.log(post,"undo like")
            if(err){return next(err)}
            io.emit("post:update",post)
        })
}

exports.post_undodislike_post = (req,res,next) => {
    console.log("activate undo")
    const {id} = req.params
    const {author,idNotification} = req.body
   
        Post.findByIdAndUpdate(id,{$pull:{dislikes:author}},{new: true})
        .populate('author',{"full_name":1,"profile_img":1,"_id":1})
        .exec((err,post) => {
            console.log(post,"undo dislike")
            if(err){return next(err)}
            io.emit("post:update",post)
        })
}