const io = require('socket.io')(3001,{cors:'localhost:3000'})


io.on("connection",socket => {
    console.log("New user connected with id:",socket.id)
})
module.exports = io