const io = require('socket.io')(3001,{cors:'localhost:3001'})


io.on("connection",socket => {
    console.log("New user connected with id:",socket.id)
})
exports.module = io