const {io} = require("../app")
const User = require('../models/user');
const Notification = require('../models/notification')
const Chat = require('../models/chat')
const Message = require('../models/message')

const mongoose = require('mongoose')



exports.send_message = (req,res,next) => {
    const {author,user,message,user1,user2} = req.body;
    User.findById(user1)
    .populate("chats")
    .exec((err,user) => {
        console.log(err)
        if(user.chats.some(chat => (chat.user1.toString() === user1 || chat.user2.toString() === user1) && (chat.user1.toString() === user2 || chat.user2.toString() === user2))){
            console.log("send message")
          const chat = user.chats.find(chat => {return((chat.user1.toString() === user1 || chat.user2.toString() === user1) && (chat.user1.toString() === user2 || chat.user2.toString() === user2))})
          const newMessage = new Message({
            author:user1,
            message,
            date: new Date
        }).save((err,message) => {
            Chat.findByIdAndUpdate(chat._id,{$push:{"messages":message}},{new:true})
            .populate('messages')
            .sort({'messages.date':1})
            .exec((err,chat) => {
                console.log(err)
                io.emit('chat:update',chat)
            })
        })
        } else {
            console.log("create chat")
            const chat = new Chat({
                user1,
                user2,
            }).save((err,chat) => {
                io.emit('chat:create',chat)
                if(err){console.log(err)}
                User.findByIdAndUpdate(user1,{$push:{"chats":{$each:[chat],$position:0}}},{new:true},(err,user1Updated) => {
                    if(err){console.log(err)}
                    const newMessage = new Message({
                        author:user1,
                        message,
                        date: new Date
                    }).save((err,message) => {
                        Chat.findByIdAndUpdate(chat._id,{$push:{"messages":message}},{new:true})
                        .populate('messages')
                        .exec((err,chat) => {
                            console.log(err)
                            io.emit('chat:update',chat)
                        })
                    })
                })
                User.findByIdAndUpdate(user2,{$push:{"chats":{$each:[chat],$position:0}}},{new:true},(err,user2Updated) => {
                    if(err){console.log(err)}
                })
            })
        }
    })

}