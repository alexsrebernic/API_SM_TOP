var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const async = require('async')
//  USERS , POSTS AND MESSAGES 
router.get('/',function(req,res,next){
    async.parallel({
        user:user_controller.users_get
    },(err,result) => {
        console.log(result)
        if(err){return next(err)}
        res.json(result)
    })
})

// USER ROUTERS
router.get('/users',)
router.get('/users/:id',)
router.post('/users',)

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