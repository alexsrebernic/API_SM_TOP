const async = require('async');
const { body,validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const Comment = require('../models/comment')
const moment = require("moment")
const Post = require('../models/post')
const {io} = require("../app")
const User = require('../models/user');
const Notification = require('../models/notification')
const mongoose = require('mongoose')
exports.comments_get = (req,res,next) => {
    Comment.find((err,comments) => {
        if(!(comments.length)){return res.status(404).json({message:"There are no comments"})}
        if(err){return next(err)}
        return res.status(200).json({message:"Messages send",comments})
    })
}
exports.comment_get = (req,res,next) => {
    Comment.findById(req.params.id,(err,comment) => {
        if(!(comment)){return res.status(404).json({message:"Comment doesn't exists"})}
        if(err){return next(err)}
        return res.status(200).json({message:'comment send',comment})
    })
}
exports.comment_delete = (req,res,next) => {
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData) => {
        if(err){return res.status(403)}
        Comment.findByIdAndDelete(req.params.id,(err,comment) => {
            Post.findByIdAndUpdate(comment.post,{$pull:{comments:comment._id}},{new:true},(err,postUpdated) => {
                Post.populate(postUpdated, {
                    path:'author',
                    select: 'full_name profile_img _id'
                },(err,postPopulated) => {
                    if(err){return next(err)}
                    io.emit('post:update',postPopulated)

                })
            })
            if(err){return next(err)}
            return res.status(200).json({message:'comment deleted'})
        })
    })
  
}
exports.comments_post = (req,res,next) => {
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData) => {
        if(err){return res.status(403)}
        const {content,author,image,post,date,creator_of_post} = req.body
        body('content', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape();
        const errors = validationResult(req);
        if(!(errors.isEmpty())){
            return res.json(errors)
        }
        const _id = mongoose.Types.ObjectId();
        const comment = new Comment({
            _id,
            content,
            author,
            image,
            post,
            date,
        }).save((err,commentSaved) => {
            if(err){return next(err)}
            Post.findByIdAndUpdate(post,
                {$push:{"comments":{$each:[_id],$position:0}}},{new: true},(err,postUpdated) => {
                if(err){return next(err)}
                Post.populate(postUpdated, {
                    path:'author',
                    select: 'full_name profile_img _id'
                },(err,postPopulated) => {
                    if(err){return next(err)}
                    io.emit('post:update',postPopulated)

                })
            })
            Comment.populate(commentSaved, {
                path:'author',
                select: 'full_name profile_img _id'
            },(err,commentPopulated) => {
                if(err){return next(err)}
                io.emit('comment:create',commentPopulated)
                
            })
            if(author !== creator_of_post){
                const notification = new Notification({
                    author,
                    comment: true,
                    post:post,
                    clicked:false
                }).save((err,notificationSaved) => {
                 User.findByIdAndUpdate(creator_of_post,{$push:{"notifications":{$each:[notificationSaved._id],$position:0}}},{new:true},(err,user) => {
                    if(err){return next(err)}
                })
                })
            }
          
            return res.status(201).json({messages:"Comment Created"})
        })
    })
   
}