const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");



const HistoryBargain = sequelize.define("history-bargain", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    globalTradeID: { type: DataTypes.BIGINT, defaultValue:null },
    tradeID: { type: DataTypes.BIGINT,defaultValue:null  },
    date: { type: DataTypes.DATE, defaultValue:null },
    type: { type: DataTypes.STRING, defaultValue:null },
    rate: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    amount: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    price: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    total: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    totalWithCom: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
  });

  User.hasMany(HistoryBargain, { as: "history-bargain" });
  HistoryBargain.belongsTo(User, { as: "user" });

  // OrderSell.hasMany(HistoryBargain, { as: "history-bargain" });
  // HistoryBargain.belongsTo(OrderSell, { as: "order-sell" });

  // OrderSale.hasMany(HistoryBargain, { as: "history-bargain" });
  // HistoryBargain.belongsTo(OrderSale, { as: "order-sale" });




  module.exports = {
    HistoryBargain
  }