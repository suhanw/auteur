const chatWebsocket = function (io) {
  const chatNamespace = io.of('/chat');
  chatNamespace.on('connection', function (socket) {
    const { chatRoom } = socket.handshake.query;

    socket.join(chatRoom, () => {
      // REMOVE IN PROD
      console.log(`${socket.id} joined room ${chatRoom}`);
      socket.on('chatMessage', function (data) {
        // console.log(data.body);
        chatNamespace.in(chatRoom).emit('chatMessage');
        // io.in('room').emit('chatMessage', data);
      })
    });

    // REMOVE IN PROD
    socket.on('disconnect', function (reason) {
      console.log(socket.id, reason);
    });
  });
};


module.exports = chatWebsocket;