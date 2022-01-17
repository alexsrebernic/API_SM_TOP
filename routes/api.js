var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const post_controller = require("../controllers/postControllers")
const async = require('async')
//  USERS , POSTS AND MESSAGES 
router.get('/')

// USER ROUTERS
router.get('/users',user_controller.users_get)
router.post('/users',user_controller.users_log_in_post)

// POST ROUTERS
router.get('/posts',post_controller.posts_get)
router.get('/posts/:id',post_controller.post_get)
router.post('/posts',post_controller.posts_post)
router.delete('/posts/:id',post_controller.post_delete)

// MESSAGES ROUTERS
router.get('/messages',)
router.get('/messages/:id',)
router.post('/messages',)
router.delete('/messages/:id',)

module.exports = router;