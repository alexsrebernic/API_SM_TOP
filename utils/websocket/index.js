const {io} = require('../../app')
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
        console.log(chat)
        console.log(chat.user1,sockets[chat.user1])
        socket.to(sockets[chat.user1]).emit("chat:update:response",chat)
        socket.to(sockets[chat.user2]).emit("chat:update:response",chat)

    })
    socket.on('chat:create',chat => {
        socket.to(sockets[chat.user1]).emit("chat:create:response",chat)
        socket.to(sockets[chat.user2]).emit("chat:create:response",chat)
    })
})
module.exports = io