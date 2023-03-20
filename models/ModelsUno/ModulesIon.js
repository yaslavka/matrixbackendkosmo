const sequelize = require("../../db");
const {DataTypes} = require("sequelize");
const {User} = require("../models");
const CloneStatUno = sequelize.define("clone_stat_uno", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const MatrixUno = sequelize.define(
    "matrix_uno",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const Matrix_TableUno = sequelize.define(
    "matrix_table_uno",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);

const TypeMatrixUno = sequelize.define("type_matrix_uno", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

MatrixUno.hasOne(MatrixUno, {
    foreignKey: 'parent_id'
});

User.hasMany(MatrixUno, {as: "matrix_uno"});
MatrixUno.belongsTo(User, {as: 'user'});

User.hasMany(Matrix_TableUno, {as: 'matrix_table_uno'});
Matrix_TableUno.belongsTo(User, {as: "user"});

MatrixUno.hasMany(Matrix_TableUno, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});

TypeMatrixUno.hasOne(CloneStatUno, {
    foreignKey: 'level'
});

TypeMatrixUno.hasMany(Matrix_TableUno);

module.exports = {CloneStatUno, MatrixUno,Matrix_TableUno,TypeMatrixUno}
