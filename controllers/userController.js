const User = require('../models/user')
var async = require('async');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
var dotenv = require('dotenv')
const passport = require("passport")
const jwt = require("jsonwebtoken");
dotenv.config()

exports.users_get = function (req,res,next){
    async.parallel({
        users:function(callback){
            User.find()
            .exec(callback)
        }
    },function(err,results) {
        if(err) {return next(err)}
        res.json(results)
    })
}
exports.users_log_in_post = function(req,res,next){
    let { username,password } = req.body
    User.findOne({username:username},(err,user) => {
        if(err) {next(err)}
        if(!(user)){return res.status(404).json({
            message: "No user founded",
        })}
        if(!(user.username)){return res.status(401).json({
            message: "Wrong username",
        })}
        if(user.password !== password) {return res.status(401).json({
            message: "Wrong password",
        })}
        
    })
}
