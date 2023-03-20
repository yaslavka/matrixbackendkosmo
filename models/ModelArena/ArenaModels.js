const sequelize = require("../../db");
const {DataTypes} = require("sequelize");
const {User} = require("../models");

const Arena = sequelize.define("leader_arena", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false},
    income: {type: DataTypes.DECIMAL(61, 8), defaultValue: 0.00000000, allowNull: false},
    pobeda: {type: DataTypes.BOOLEAN, defaultValue: 0.00000000},
    userId: {type: DataTypes.BIGINT, allowNull: false},
})
User.hasMany(Arena, {as: "leader_arena"});
Arena.belongsTo(User, {as: 'user'});

const Stavki = sequelize.define("stavki",{
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false},
    income: {type: DataTypes.DECIMAL(61, 8), defaultValue: 0.00000000, allowNull: false},
    userId: {type: DataTypes.BIGINT, allowNull: false},
})
User.hasMany(Stavki, {as: "stavki"});
Stavki.belongsTo(User, {as: 'user'});

module.exports = {Arena, Stavki}