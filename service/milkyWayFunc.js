const { Op } = require('sequelize')
const sequelize = require('../db')
const { Statistic, Matrix_Table } = require("../models/models")


const summColumnStatistic = async () => {
    let resp = await Matrix_Table.findAll({
        attributes: [[
            sequelize.fn("sum", sequelize.col(`count`)), "all_count",
        ]]
    })
    return resp
}
const updateOrCreate = async function (model, where, newItem) {
    // First try to find the record
    await model.findOne({ where: where }).then(async function (foundItem) {
        (!foundItem) ? (await model.create(newItem)) : (await model.update(newItem, { where: where }))
    })
}

const updateStatistic = async (all_comet, all_planet) => {
    let update = { all_comet, all_planet }
    const allItems = await Statistic.update(update, { where: { id: { [Op.not]: 0 } } })
}

module.exports = {
    updateStatistic, updateOrCreate, summColumnStatistic
}