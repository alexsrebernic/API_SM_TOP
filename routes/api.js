var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const post_controller = require("../controllers/postControllers")
const comment_controller = require('../controllers/commentController')
const async = require('async')
//  USERS , POSTS AND MESSAGES 
router.get('/')

// USER ROUTERS
router.get('/users',user_controller.users_get)
router.get('/users/:id')
router.post('/users/sign_up',user_controller.users_sign_up_post)
router.post('/users/log_in',user_controller.users_log_in_post)
router.delete('/users/:id')

// POST ROUTERS
router.get('/posts',post_controller.posts_get)
router.get('/posts/:id',post_controller.post_get)
router.post('/posts',post_controller.posts_post)
router.delete('/posts/:id',post_controller.post_delete)

// MESSAGES ROUTERS
router.get('/comments',comment_controller.comments_get)
router.get('/comments/:id',comment_controller.comment_get)
router.post('/comments',comment_controller.comments_post)
router.delete('/comments/:id',comment_controller.comment_delete)

module.exports = router;