const chatNamespace = function (io) {
  const chatNsp = io.of('/chat');
  chatNsp.on('connection', function (socket) {
    const { chatRoom } = socket.handshake.query;

    socket.join(chatRoom, () => {
      // REMOVE IN PROD
      console.log(`${socket.id} joined room ${chatRoom}`);
      // REMOVE IN PROD
      socket.on('chatMessage', function () {
        chatNsp.in(chatRoom).emit('chatMessage');
      });
    });

    // REMOVE IN PROD
    socket.on('disconnect', function (reason) {
      console.log(socket.id, reason);
    });
    // REMOVE IN PROD
  });
};

module.exports = chatNamespace;