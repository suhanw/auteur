const chatNamespace = function (io) {
  const chatNsp = io.of('/chat');
  chatNsp.on('connection', function (socket) {
    const { chatRoom, currentUsername, activeChatPartner } = socket.handshake.query;
    socket.username = currentUsername;

    socket.join(chatRoom, () => {
      // 1. Check if the chat partner is currently online
      // 1a. let the partner know that I'm online by emitting event to the client-side
      socket.to(chatRoom).emit(`${socket.username} online`);
      // 1b. check if the partner is online
      chatNsp.to(chatRoom).clients((err, socketIds) => { // identify clients (arr of socket Ids) connected to the chatRoom
        if (err) throw err;
        let onlineChatPartner = socketIds.find((socketId) => { // check if chat partner is in the chatRoom
          let otherSocket = chatNsp.connected[socketId]; // chatNsp.connected is a hash of socket objects
          return otherSocket.username === activeChatPartner;
        });
        if (onlineChatPartner) chatNsp.to(chatRoom).emit(`${activeChatPartner} online`); // if chat partner is online, emit event to client side
      });

      // 2. emit new chat messsages to the chat partner in the chatRoom
      socket.on('chatMessage', function () {
        chatNsp.to(chatRoom).emit('chatMessage');
      });
    });

    socket.on('disconnect', function (reason) {
      console.log(socket.id, reason); // REMOVE IN PROD
      socket.to(chatRoom).emit(`${socket.username} offline`);
    });
  });
};

module.exports = chatNamespace;