const ChartControllers = require("../controllers/ChartControllers");
const { ChatTable } = require("../models/chatTable");
const { User } = require("../models/models");


module.exports = async (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  }); 
  socket.on("join_room", async (data) => {
    const allMessage = await ChatTable.findAll({ include: { model: User, as: "user" } })
    socket.join(data);
    socket.emit("getOldMessage", allMessage);
  });
  // await ChartControllers.list()
  socket.on("send_message", async (data) => {
    socket.to(data.room).emit("receive_message", data);
    const item = await ChatTable.create({
      time: data.time,
      message: data.message,
      author: data.author,
      userId: data.userId 
    })
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);

  });
}