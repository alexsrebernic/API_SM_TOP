const async = require('async');
const Post = require('../models/post')
const { body,validationResult } = require('express-validator');
const moment = require("moment")

exports.posts_get = function(req,res,next){
    Post.find((err,results) => {
        if(err){next(err)}
        res.json(results)
    })
}
exports.post_delete = function(req,res,next){
    Post.findByIdAndDelete(req.params.id,(err) => {
        if(err){return next(err)}
        return res.status(200).json({message:"Post deleted"})
    })
}
exports.post_get = function(req,res,next){
    Post.findById(req.params.id,(err,post) => {
        if(!(post)) return res.status(404).json({message:"Post doesn't exists"})
        if(err){return next(err)}
        return res.status(200).json({message:"Post send",post})
    })
}
exports.posts_post = function(req,res,next){
    const {content,images,author} = req.body;
    body('content', 'Content m.').trim().isLength({ min: 1 }).escape(),
    body('date.*').escape();
        const errors = validationResult(req);
        if(!(errors.isEmpty())){
            return res.json(errors)
        }
        const post = new Post({
            content:content,
            images:images,
            author:author,
            date:moment().format('MMMM Do YYYY, h:mm:ss a'),
          
        }).save((err) => {
            if(err){return next(err)};
            res.status(201).json({message:"post created"})
        })
    console.log(post)
}