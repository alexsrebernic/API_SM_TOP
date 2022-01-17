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
        if(err){return next(err)}
        return res.status(200).json({message:"Post send",post})
    })
}
exports.posts_post = function(req,res,next){
    const {cover_img,title,sub_title,content,images,author,published,comments,social_media_urls,likes,dislikes} = req.body;

    (req, res, next) => {
        if(!(images instanceof Array)){
            if(typeof images ==='undefined')
            images = [];
            else
            images = new Array(images);
        }
        if(!(social_media_urls instanceof Array)){
            if(typeof social_media_urls ==='undefined')
            social_media_urls = [];
            else
            social_media_urls = new Array(social_media_urls);
        }
        if(!(comments instanceof Array)){
            if(typeof comments ==='undefined')
            comments = [];
            else
            comments = new Array(comments);
        }
        next();
    }
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('sub_title', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('content', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('date.*').escape();
        const errors = validationResult(req);
        const post = new Post({
            cover_img:cover_img,
            title:title,
            sub_title:sub_title,
            content:content,
            images:images,
            author:author,
            date:moment().format('MMMM Do YYYY, h:mm:ss a'),
            published:published,
            comments:null,
            social_media_urls:social_media_urls,
            likes:null,
            dislikes:null
        })
        if(!(errors.isEmpty())){
            return res.json(errors)
        }
        post.save((err) => {
            if(err){return next(err)};
            res.status(200).json({message:'Post created'})
        })
    
}