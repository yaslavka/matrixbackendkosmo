let io;
const { Server } = require("socket.io");

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "https://kosmos-lif.host",
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