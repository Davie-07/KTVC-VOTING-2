const { Server } = require('socket.io');

let io;

function initSocketIo(server, clientOrigin) {
  io = new Server(server, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // You can add connection logic here if needed, e.g., logging
    // console.log(`A user connected: ${socket.id}`);
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

function emitLiveUpdate(event, payload) {
  try {
    getIo().emit(event, payload);
  } catch (error) {
    // It's better to log the error than to fail silently
    console.error('Failed to emit socket event:', error);
  }
}

module.exports = { initSocketIo, io: getIo, emitLiveUpdate };









































// Replace code or this is the original file
// let ioInstance = null;

// function initSocketIo(server, corsOrigin) {
//   const { Server } = require('socket.io');
//   ioInstance = new Server(server, {
//     cors: { origin: corsOrigin, methods: ['GET', 'POST'] }
//   });
//   return ioInstance;
// }

// function io() {
//   if (!ioInstance) throw new Error('Socket.io not initialized');
//   return ioInstance;
// }

// function emitLiveUpdate(event, payload) {
//   try {
//     io().emit(event, payload);
//   } catch (_) {}
// }

// module.exports = { initSocketIo, io, emitLiveUpdate };

