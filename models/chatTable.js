const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const { User } = require("./models");



const ChatTable = sequelize.define("chat", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    time: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
  });
 

  
  User.hasMany(ChatTable, { as: "chat" });
  ChatTable.belongsTo(User, { as: "user" }); 
    
  module.exports = { 
    ChatTable
  } 