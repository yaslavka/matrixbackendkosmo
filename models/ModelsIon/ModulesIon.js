const sequelize = require("../../db");
const {DataTypes} = require("sequelize");
const {User} = require("../models");
const CloneStatIon = sequelize.define("clone_stat_ion", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const MatrixIon = sequelize.define(
    "matrix_ion",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const Matrix_TableIon = sequelize.define(
    "matrix_table_ion",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);

const TypeMatrixIon = sequelize.define("type_matrix_ion", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

MatrixIon.hasOne(MatrixIon, {
    foreignKey: 'parent_id'
});

User.hasMany(MatrixIon, {as: "matrix_ion"});
MatrixIon.belongsTo(User, {as: 'user'});

User.hasMany(Matrix_TableIon, {as: 'matrix_table_ion'});
Matrix_TableIon.belongsTo(User, {as: "user"});

MatrixIon.hasMany(Matrix_TableIon, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});

TypeMatrixIon.hasOne(CloneStatIon, {
    foreignKey: 'level'
});

TypeMatrixIon.hasMany(Matrix_TableIon);

module.exports = {CloneStatIon, MatrixIon,Matrix_TableIon,TypeMatrixIon,}
