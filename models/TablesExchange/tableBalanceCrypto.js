const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Wallet } = require("./tableWallet");


const BalanceCrypto = sequelize.define("balance-crypto", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    unconfirmed_balance: { type: DataTypes.DECIMAL(61,8), defaultValue: 0.00000000 },
    xpub: { type: DataTypes.STRING, defaultValue: null, unique: true },
    privateKey: { type: DataTypes.STRING, defaultValue: null, unique: true },
    address: { type: DataTypes.STRING, defaultValue: null, unique: true },
    mnemonic: { type: DataTypes.STRING, defaultValue: null, unique: true },
  });
 
  User.hasMany(BalanceCrypto, { as: "balance-crypto" });
  BalanceCrypto.belongsTo(User, { as: "user" });
  BalanceCrypto.belongsTo(Wallet, { as: "wallet" });

  module.exports = {
    BalanceCrypto
  }