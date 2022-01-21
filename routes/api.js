var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const post_controller = require("../controllers/postControllers")
const comment_controller = require('../controllers/commentController')

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
router.post('/users/sign_up',user_controller.users_sign_up_post)
router.post('/users/log_in',user_controller.users_log_in_post)
router.delete('/users/:id',verifyToken,user_controller.user_delete)

// POST ROUTERS
router.get('/posts',verifyToken,post_controller.posts_get)
router.get('/posts/:id',verifyToken,post_controller.post_get)
router.post('/posts',verifyToken,post_controller.posts_post)
router.delete('/posts/:id',verifyToken,post_controller.post_delete)

// MESSAGES ROUTERS
router.get('/comments',verifyToken,comment_controller.comments_get)
router.get('/comments/:id',verifyToken,comment_controller.comment_get)
router.post('/comments',verifyToken,comment_controller.comments_post)
router.delete('/comments/:id',verifyToken,comment_controller.comment_delete)

module.exports = router;