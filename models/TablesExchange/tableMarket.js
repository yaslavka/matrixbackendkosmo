const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Market = sequelize.define("market", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      // allowNull: false,
      autoIncrement: true 
    },
    pair: { type: DataTypes.STRING, allowNull: false },
    last: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    lowestAsk: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    highestBid: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    percentChange: { type: DataTypes.FLOAT, defaultValue: 0.00000000 },
    baseVolume: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000},
    quoteVolume: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    isFrozen: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    postOnly: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    high24hr: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    low24hr: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
  });


  module.exports = {
    Market
  }