var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const async = require('async')
//  USERS , POSTS AND MESSAGES 
router.get('/')

// USER ROUTERS
router.get('/users',user_controller.users_get)
router.post('/users',user_controller.users_log_in_post)

// POST ROUTERS
router.get('/posts',)
router.get('/posts/:id',)
router.post('/posts',)
router.delete('/posts/:id',)

// MESSAGES ROUTERS
router.get('/messages',)
router.get('/messages/:id',)
router.post('/messages',)
router.delete('/messages/:id',)

module.exports = router;