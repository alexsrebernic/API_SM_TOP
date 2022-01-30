var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const post_controller = require("../controllers/postControllers")
const comment_controller = require('../controllers/commentController')
const notification_controller = require('../controllers/notificationController')
// FUNCTION VERIFY TOKEN
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1]
      req.token = bearerToken
      next()
    }else {
      res.status(403).json({message:"Missing token"})
    }
  }
//  USERS , POSTS AND MESSAGES 
router.get('/')

// USER ROUTERS
router.get('/users',verifyToken,user_controller.users_get)
router.get('/users/:id',verifyToken,user_controller.user_get)
router.get('/user/current',verifyToken,user_controller.user_current_get)
router.get('/user/get_posts/:id',verifyToken,user_controller.user_posts_get)
router.post('/users/sign_up',user_controller.users_sign_up_post)
router.post('/users/log_in',user_controller.users_log_in_post)
router.post('/users/delete/:id',verifyToken,user_controller.user_delete)
router.post('/user/update_aboutme',verifyToken,user_controller.user_update_about_me)
router.post('/user/update_gender',verifyToken,user_controller.user_update_gender)
router.post('/user/update_location',verifyToken,user_controller.user_update_location)
router.post('/user/update_date_of_birth',verifyToken,user_controller.user_update_date_of_birth)

// POST ROUTERS
router.get('/posts',verifyToken,post_controller.posts_get)
router.get('/posts/:page',verifyToken,post_controller.posts_paginate_get)
router.get('/post/:id',verifyToken,post_controller.post_get)

router.post('/post/like/:id/:creator_of_post',verifyToken,post_controller.post_like_post)
router.post('/post/dislike/:id',verifyToken,post_controller.post_dislike_post)
router.post('/post/undolike/:id',verifyToken,post_controller.post_undolike_post)
router.post('/post/undodislike/:id',verifyToken,post_controller.post_undodislike_post)

router.post('/posts',verifyToken,post_controller.posts_post)
router.post('/posts/delete/:id',verifyToken,post_controller.post_delete)

// MESSAGES ROUTERS
router.get('/comments',verifyToken,comment_controller.comments_get)
router.get('/comments/:id',verifyToken,comment_controller.comment_get)
router.post('/comments',verifyToken,comment_controller.comments_post)
router.post('/comments/delete/:id',verifyToken,comment_controller.comment_delete)

//NOTIFICATION'S ROUTERS
router.post('/notification/:id',verifyToken,notification_controller.notification_update)
router.post('/notifications/send_friend_request',verifyToken,notification_controller.notification_friend_request_create)
router.post('/notifications/accept_friend_request',verifyToken,notification_controller.notification_friend_request_accept)


module.exports = router;