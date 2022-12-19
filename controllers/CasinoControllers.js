const jwt_decode = require("jwt-decode");

const {
    InvestBox,
    User
} = require("../models/models");


class CasinoControllers {

    async admin(req, res, next) {

        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const investItem = await InvestBox.findAll({ 
            where:{userId: user.id}
        })

        if (investItem.length === 0){
            return res.json(false)
        }

        return res.json(investItem)

    }
    async list(req, res, next) {

        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const investItem = await InvestBox.findAll({ 
            where:{userId: user.id}
        })

        if (investItem.length === 0){
            return res.json(false)
        }
        return res.json({items: investItem})

    }

}


module.exports = new CasinoControllers();