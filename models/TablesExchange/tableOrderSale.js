const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Market } = require("./tableMarket");

const OrderSale = sequelize.define("order-sale", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    amount: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    sumWithOutCom: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    summ: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
  });

  User.hasMany(OrderSale, { as: "order_sale" });
  OrderSale.belongsTo(User, { as: "user" });

  Market.hasMany(OrderSale, { as: "order_sale" });
  OrderSale.belongsTo(Market, { as: "market" });


  module.exports = {
    OrderSale
  }