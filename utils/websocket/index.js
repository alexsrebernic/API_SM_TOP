const io = require('socket.io')(3001,{cors:'localhost:3000'})


io.on("connection",socket => {
    console.log("New user connected with id:",socket.id)
})
io.once('post:create',(post) => {
    socket.emit('post:create',post)
})
module.exports = io