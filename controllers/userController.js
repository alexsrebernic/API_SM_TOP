const User = require('../models/user')
var async = require('async');
var dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const { body,validationResult } = require('express-validator');
var Isemail = require('isemail');
const Post = require('../models/post');
const io = require('../utils/websocket/index')

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
    User.findById(req.params.id)
    .populate("notifications")
    .populate("friends",{full_name:1,profile_img:1,_id:1})
    .populate("posts")
    .populate("chats")
    .exec(function(err,user) {
        if(err){return next(err)}
        User.populate(user,
            {
                path:"notifications.author posts.author chats.messages",
            select: 'full_name profile_img _id message author date'


            },
            (err, userNotifications) => {
                User.populate(user,
                    {
                        path:"chats.messages._id"
                    })
                if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
                if(err){return next(err)}
                return res.status(200).json(user)
            }
            )
      
    })
}
exports.user_current_get = function(req,res,next){
    jwt.verify(req.token,process.env.SECRET_KEY_JWT,(err,authData)=> {
        if(err){return res.status(403)}
        return res.status(200).json({userId:authData.user._id})
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
                location,
            }).save(err => {
                if(err){return next(err)}
                return res.status(201).json({message:"User created succesfully",user})
            })
        })
      
    
    })
  
}

exports.users_log_in_post = function(req,res,next){
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
              jwt.sign({user: user},process.env.SECRET_KEY_JWT,{expiresIn: '5h' },(err,token) => {
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

exports.user_posts_get = function(req,res,next){
    let id = req.params.id;
    User.findById(id,{'posts':1})
    .populate('posts')
    .exec((err,posts) => {
        if(err){return next(err)}
        Post.populate(posts.posts, {
            path:'author',
            select: 'full_name profile_img _id'
        },(err,postPopulated) => {
            if(err){return next(err)}
            res.status(200).json({"posts":postPopulated})
        })
       
    })     
}
exports.user_update_about_me = function(req,res,next){
    const {user,text} = req.body
    User.findByIdAndUpdate(user,{"about_me":text},{new:true})
    .populate("notifications")
    .populate("friends",{full_name:1,profile_img:1,_id:1})
    .populate("posts")
    .exec(function(err,user) {
        if(err){return next(err)}
        User.populate(user,
            {
                path:"notifications.author posts.author",
                select: 'full_name profile_img _id'


            },
            (err, userUpdated) => {
                if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
                if(err){return next(err)}
                io.emit('user:update',userUpdated)
                return res.status(200).json(user)
            }
            )
        })
}
exports.user_update_gender = function(req,res,next){
    const {user,gender} = req.body
    User.findByIdAndUpdate(user,{"gender":gender},{new:true})
    .populate("notifications")
    .populate("friends",{full_name:1,profile_img:1,_id:1})
    .populate("posts")
    .exec(function(err,user) {
        if(err){return next(err)}
        User.populate(user,
            {
                path:"notifications.author posts.author",
                select: 'full_name profile_img _id'
            },
            (err, userUpdated) => {
                if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
                if(err){return next(err)}
                io.emit('user:update',userUpdated)
                return res.status(200).json(user)
            }
            )
        })
}
exports.user_update_location = function(req,res,next){
    const {user,location} = req.body
    User.findByIdAndUpdate(user,{"location":location},{new:true})
    .populate("notifications")
    .populate("friends",{full_name:1,profile_img:1,_id:1})
    .populate("posts")
    .exec(function(err,user) {
        if(err){return next(err)}
        User.populate(user,
            {
                path:"notifications.author posts.author",
                select: 'full_name profile_img _id'
            },
            (err, userUpdated) => {
                if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
                if(err){return next(err)}
                io.emit('user:update',userUpdated)
                return res.status(200).json(user)
            }
            )
        })
}
exports.user_update_date_of_birth = function(req,res,next){
    const {user,date} = req.body
    User.findByIdAndUpdate(user,{"date_of_birth":date},{new:true})
    .populate("notifications")
    .populate("friends",{full_name:1,profile_img:1,_id:1})
    .populate("posts")
    .exec(function(err,user) {
        if(err){return next(err)}
        User.populate(user,
            {
                path:"notifications.author posts.author",
                select: 'full_name profile_img _id'
            },
            (err, userUpdated) => {
                if(!(user)){return res.status(404).json({message:"User doesn't exists"})}
                if(err){return next(err)}
                io.emit('user:update',userUpdated)
                return res.status(200).json(user)
            }
            )
        })
}