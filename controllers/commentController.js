const async = require('async');
const { body,validationResult } = require('express-validator');
const Comment = require('../models/comment')
const moment = require("moment")

exports.comments_get = (req,res,next) => {
    Comment.find((err,comment) => {
        if(err){return next(err)}
        return res.status(200).json({message:"Messages send",comment})
    })
}
exports.comment_get = (req,res,next) => {
    Comment.findById(req.params.id,(err,comment) => {
        if(err){return next(err)}
        return res.status(200).json({message:'comment send',comment})
    })
}
exports.comment_delete = (req,res,next) => {
    Comment.findByIdAndDelete(req.params.id,(err) => {
        if(err){return next(err)}
        return res.status(200).json({message:'comment deleted'})
    })
}
exports.comments_post = (req,res,next) => {
    const {content,author} = req.body

    body('content', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape();
    const errors = validationResult(req);
    if(!(errors.isEmpty())){
        return res.json(errors)
    }
    const comment = new Comment({
        content:content,
        profileImg:`https://ui-avatars.com/api/?background=random&name=${author.replace(/\s/g, '+')}&rounded=true`,
        author:author,
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
        likes:null,
        dislikes:null
    }).save(err => {
        if(err){return next(err)}
        return res.status(200).json({message:"comment created"})
    })
}