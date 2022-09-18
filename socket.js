let io;
const sockets = {};

module.exports = {
  getSocket: userId => {
    return sockets[userId];
  },
  addSocket: (userId, socket) => {
    sockets[userId] = socket;
  },
  init: (httpServer, options) => {
    io = require('socket.io')(httpServer, options);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
};
