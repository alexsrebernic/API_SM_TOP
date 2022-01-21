const User = require('../models/user')
var async = require('async');
var dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const { body,validationResult } = require('express-validator');
var Isemail = require('isemail');
dotenv.config()

exports.users_get = function (req,res,next){
    async.parallel({
        users:function(callback){
            User.find()
            .exec(callback)
        }
    },function(err,users) {
        if(!(users)){return res.status(404).json({message:"There are no users"})}
        if(err) {return next(err)}
        return res.status(200).json(users)
    })
}

exports.user_get = function (req,res,next){
    User.findById(req.params.id,function(err,user) {
        if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
        if(err){return next(err)}
        return res.status(200).json(user)
    })
}
exports.user_current_get = function(req,res,next){
    console.log(req.token)
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData)=> {
        if(err){return res.status(403)}
        return res.status(200).json({authData})
    })
}
exports.user_delete = function(req,res,next){
    User.findByIdAndDelete(req.params.id,(err,user) => {
        if(err){return next(err)}
        return res.status(200)
    })
}
exports.users_sign_up_post = function(req,res,next){
    const {email,password,secondpassword,first_name,last_name,date_of_birth,gender,location} = req.body
    if(!(Isemail.validate(email))){return res.status(401).json({message:"Email is invalid"})}
    body('email', 'Email is invalid.').isEmail().bail().isLength({ min: 1,max:50 }).escape(),
    body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('secondpassword', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('firstname', 'First name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('lastname', 'Last name must not be empty').trim().isLength({ min: 1 }).escape()
    body('dateofbirth', 'Date of birth must not be empty').isISO8601().toDate().isLength({ min: 1 }).escape()
    const errors = validationResult(req);
    if(!(errors.isEmpty())) {return res.json(errors)}
    if(password !== secondpassword) {return res.status(401).json({message:"Passwords doesn't match"})}
    User.find({email:email},(err,user) => {
        if(err){return next(err)}
        console.log(user)
        if(user.length){return res.status(409).json({message:"This email is already in use",user})}
        bcrypt.hash(password,10,(err,hashedPassword) => {
            if(err){return next(err)}
            const user = new User({
                email,
                password:hashedPassword,
                first_name,
                last_name,
                full_name: first_name + " " + last_name,
                date_of_birth,
                gender,
                location
            }).save(err => {
                if(err){return next(err)}
                return res.status(201).json({message:"User created succesfully",user})
            })
        })
      
    
    })
  
}

exports.users_log_in_post = function(req,res,next){
    console.log(req.body)
    let { email,password } = req.body
    User.findOne({email},(err,user) => {
        if(err) {next(err)}
        if(!(user)){
            return res.status(404).json({
            message: "User not found",
        })}
        bcrypt.compare(password, user.password, (err, result) => {
            if(err){console.log(err)}
            if (result) {
              jwt.sign({user},process.env.SECRET_KEY_JWT,{expiresIn: '5h' },(err,token) => {
                  res.json({
                      message:'Auth succesfull',
                      token:token
                  })
              })
            } else {
            return res.status(401).json({
                message: "Wrong password"
            })
            }
          })
        
    })
  
}

