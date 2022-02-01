const Post = require('../models/post')
const jwt = require("jsonwebtoken");
const {io} = require("../app")
const Notification = require('../models/notification');
const User = require("../models/user")
exports.notification_update = (req,res,next) => {
    const id = req.params.id;
    const {user} = req.body
    Notification.findByIdAndUpdate(id,{"clicked":true},{new:true},(err,notification) => {
        console.log(err)
        if(err){return next(err)}
    })
    User.findById(user)
    .populate('notifications')
    .populate('friends')
    .exec((err,user) => {
        if(err){
        }
        User.populate(user,
            {path:"notifications.author"}
            ,(err,userUpdated) => {
                if(err){return next(err)}
                io.emit("user:update",userUpdated)
            })
    })
    
   
}
exports.notification_friend_request_create = (req,res,next) => {
    const {author,user,} = req.body
    const notification = new Notification({
        author,
        friend_request:true,
        clicked:false
    }).save((err,notification) => {
        if(err){return next(err)}
        User.findByIdAndUpdate(user,{$push:{"notifications":{$each:[notification._id],$position:0}}},{new:true},(err,user) => {
            if(err){return next(err)}
        })
        User.findByIdAndUpdate(author,{$push:{"friend_requests":{$each:[user],$position:0}}},{new:true})
        .populate('notifications')
        .populate('friends')
        .exec((err,user) => {
            if(err){
            console.log(err)
            }
            User.populate(user,
                {path:"notifications.author"}
                ,(err,userUpdated) => {
                    if(err){return next(err)}
                    io.emit("user:update",userUpdated)
                })
        })
    }) 

}
exports.notification_friend_request_accept = (req,res,next) => {
    const {author,user,idNotification} = req.body
    User.findByIdAndUpdate(author,{$pull:{"friends":user}},{new:true},(err,userUpdated) => {
        console.log(err)
        User.findByIdAndUpdate(userUpdated,{$push:{"friends":{$each:[user],$position:0}}},{},(err) => {
            if(err){return next(err)}
        })
    })
    
    Notification.findByIdAndUpdate(idNotification,{"clicked":true},{new:true},(err,notification) => {
        if(err){return next(err)}
    })
    User.findByIdAndUpdate(user,{$pull:{"friends":author}},{new:true},(err,userUpdated) => {
        User.findByIdAndUpdate(userUpdated,{$push:{"friends":{$each:[author],$position:0}}},{new:true})
            .populate('friends')
            .populate('notifications')
            .exec((err,user) => {
                User.populate(user,
                    {path:"notifications.author"}
                    ,(err,userUpdated) => {
                        if(err){return next(err)}
                        io.emit("user:update",userUpdated)
                    })
            
            })
        })
   
    User.findByIdAndUpdate(author,{$pull:{"friend_requests":user}},{},(err) => {
        if(err){return next(err)}
        })
}