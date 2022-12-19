const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Chart = sequelize.define("chart", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.BIGINT, allowNull: false },
    high: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    low: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    open: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    close: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    volume: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    quoteVolume: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    weightedAverage: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
  });

  module.exports = {
    Chart
  }