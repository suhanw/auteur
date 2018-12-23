const chatWebsocket = function (io) {
  const chatNamespace = io.of('/chat');
  chatNamespace.on('connection', function (socket) {
    const { chatRoom } = socket.handshake.query;

    socket.join(chatRoom, () => {
      console.log(`${socket.id} joined room ${chatRoom}`);
      socket.on('chatMessage', function (data) {
        // console.log(data.body);
        chatNamespace.in(chatRoom).emit('chatMessage');
        // io.in('room').emit('chatMessage', data);
      })
    });

    socket.on('disconnect', function (reason) {
      console.log(socket.id, reason);
    });
  });
};


module.exports = chatWebsocket;