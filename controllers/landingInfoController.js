const moment = require ("moment");
const {Arena} = require("../models/ModelArena/ArenaModels");
const {User, Matrix_TableSecond} = require("../models/models");
const { Op } = require("sequelize");

class LandingInfoController{
    async getLandingInfo (req, res){
        const users = await User.count();
        const leder = await Arena.findAll()
        const neww = await User.count({where: {createdAt: {[Op.gte]: moment().subtract(1, 'days').toDate()}}})
        const active =await Matrix_TableSecond.count({where: {typeMatrixSecondId: {[Op.gte]: 1}}})
        const activ = await Matrix_TableSecond.count({where: {createdAt: {[Op.gte]: moment().subtract(1, 'days').toDate()}}})

        return res.json({all: users, new:neww, active:active, activ:activ, id:leder})
    }
}
module.exports = new LandingInfoController()