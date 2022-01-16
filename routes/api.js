var express = require('express');
var router = express.Router();


//  USERS , POSTS AND MESSAGES 
router.get('/',)

// USER ROUTERS
router.get('/users',)
router.get('/users/:id',)
router.post('/users')

// POST ROUTERS
router.get('/posts',)
router.get('/posts/:id',)
router.post('/posts')
router.delete('/posts/:id')

// MESSAGES ROUTERS
router.get('/messages')
router.get('/messages/:id')
router.post('/messages')
router.delete('/messages/:id')
