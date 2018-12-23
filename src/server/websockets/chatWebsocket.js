const chatWebsocket = function (io) {
  const chatNamespace = io.of('/chat');
  chatNamespace.on('connection', function (socket) {
    console.log('connected ', socket.id);
    console.log(socket.handshake.query.room);
    socket.join('room', () => {
      console.log('joined room');
    })
    socket.on('chatMessage', function (data) {
      console.log(data.body);
      chatNamespace.in('room').emit('chatMessage', data);
      // io.in('room').emit('chatMessage', data);
    })
    socket.on('disconnect', function (reason) {
      console.log(reason);
    });
  });
};


module.exports = chatWebsocket;