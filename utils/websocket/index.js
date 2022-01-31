const io = require('socket.io')(3001,{cors:'localhost:3000'})

const sockets = []
io.on("connection",socket => {
    console.log("New user connected with id:",socket.id)
    socket.on("online",(data) => {
        socket.name = data._id
        sockets[data._id] = socket.id
        console.log(sockets)
    });
    socket.on('user:update',(user) => {
        console.log(user)
        socket.to(sockets[user._id]).emit("user:update:response",user)
    })
    socket.on("disconnect", reason => {
        sockets.splice(sockets.findIndex(id => id === socket._id), 1);
      });
    socket.on("chat:update",chat => {
        socket.to(sockets[chat.user1]).emit("chat:update:response",chat)
        socket.to(sockets[chat.user2]).emit("chat:update:response",chat)

    })
    socket.on('chat:create',chat => {
        console.log(chat)
        socket.to(sockets[chat.user1]).emit("chat:create:response",chat)
        socket.to(sockets[chat.user2]).emit("chat:create:response",chat)
    })
})

module.exports = io