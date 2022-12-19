const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Wallet = sequelize.define("Wallet", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: {type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000}
  });


  module.exports = {
    Wallet
  }