let io;
const { Server } = require("socket.io");

module.exports = {
  init: (httpsServer) => {
    io = new Server(httpsServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  }
};