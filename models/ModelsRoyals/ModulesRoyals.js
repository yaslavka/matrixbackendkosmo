const sequelize = require("../../db");
const {DataTypes} = require("sequelize");
const {User} = require("../models");
const CloneStatRoyals = sequelize.define("clone_stat_royals", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const MatrixRoyals = sequelize.define(
    "matrix_royals",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const Matrix_TableRoyals = sequelize.define(
    "matrix_table_royals",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);

const TypeMatrixRoyals = sequelize.define("type_matrix_royals", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

MatrixRoyals.hasOne(MatrixRoyals, {
    foreignKey: 'parent_id'
});

User.hasMany(MatrixRoyals, {as: "matrix_royals"});
MatrixRoyals.belongsTo(User, {as: 'user'});

User.hasMany(Matrix_TableRoyals, {as: 'matrix_table_royals'});
Matrix_TableRoyals.belongsTo(User, {as: "user"});

MatrixRoyals.hasMany(Matrix_TableRoyals, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});

TypeMatrixRoyals.hasOne(CloneStatRoyals, {
    foreignKey: 'level'
});

TypeMatrixRoyals.hasMany(Matrix_TableRoyals);

module.exports = {CloneStatRoyals,  MatrixRoyals,Matrix_TableRoyals,TypeMatrixRoyals}
