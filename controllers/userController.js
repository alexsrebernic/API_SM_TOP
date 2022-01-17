const User = require('../models/user')
var async = require('async');
var dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
dotenv.config()

exports.users_get = function (req,res,next){
    async.parallel({
        users:function(callback){
            User.find()
            .exec(callback)
        }
    },function(err,user) {
        if(err) {return next(err)}
        console.log(user)
        return res.send(user)
    })
}
exports.users_log_in_post = function(req,res,next){
    let { username,password } = req.body
    User.findOne({username},(err,user) => {
        if(err) {next(err)}
        if(!(user)){return res.status(404).json({
            message: "No user founded",
        })}
        if(user.username !== username){return res.status(401).json({
            message: "Wrong username",
        })}
        bcrypt.compare(password, user.password, (err, result) => {
            if(err){console.log(err)}
            if (result) {
              jwt.sign({user},'secretkey',(err,token) => {
                  res.json({
                      message:'Auth succesfull',
                      token:token
                  })
              })
            } else {
            return res.status(401).json({message: "Wrong password",})
            }
          })
        
    })
  
}

