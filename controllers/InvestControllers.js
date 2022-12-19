const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

const {
    InvestBox,
    User
} = require("../models/models");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const { Wallet } = require("../models/TablesExchange/tableWallet");


class InvestControllers {

    async create(req, res, next) {

        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const {amount} = req.body
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const walletRUBId = await Wallet.findOne({ where: { name: 'RUR' } })
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        if (((+walletRUBBalance.balance) < amount) && ((+user.locale) < amount)) {
            return next(ApiError.badRequest("Недостаточно средств"));
        } else if ((+walletRUBBalance.balance) >= summ){
            let update = { balance: ((+ walletRUBBalance.balance) - amount) }
            let temp = await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } })
        } else {
            let update = { locale: ((+user.locale) - amount) }
            let temp = await User.update(update, { where: { id: user.id } })
        }
        const status = 'активный'
        const investItem = await InvestBox.create({
            status,
            summ: amount,
            userId: user.id
        })

        return res.json(true)
    }

}


module.exports = new InvestControllers();