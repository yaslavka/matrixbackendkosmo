const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Market } = require("./tableMarket");

const OrderSell = sequelize.define("order-sell", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    amount: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    sumWithOutCom: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    summ: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
  });

  User.hasMany(OrderSell, { as: "order_sell" });
  OrderSell.belongsTo(User, { as: "user" }); 

  Market.hasMany(OrderSell, { as: "order_sell" });
  OrderSell.belongsTo(Market, { as: "market" });


  module.exports = {
    OrderSell
  }