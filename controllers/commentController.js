const async = require('async');
const { body,validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const Comment = require('../models/comment')
const moment = require("moment")
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
        Comment.findByIdAndDelete(req.params.id,(err) => {
            if(err){return next(err)}
            return res.status(200).json({message:'comment deleted',authData})
        })
    })
  
}
exports.comments_post = (req,res,next) => {
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData) => {
        if(err){return res.status(403)}
        const {content,author,image,post} = req.body

        body('content', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
        body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape();
        const errors = validationResult(req);
        if(!(errors.isEmpty())){
            return res.json(errors)
        }
        const comment = new Comment({
            content,
            author,
            image,
            post,
            date:moment().format('MMMM Do YYYY, h:mm:ss a'),
        }).save(err => {
            if(err){return next(err)}
            return res.status(201).json({messages:"Comment Created",authData})
        })
    })
   
}