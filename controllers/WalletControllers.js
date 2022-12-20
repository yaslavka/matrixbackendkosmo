const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const freekassa = require("freekassa-node");
const bcrypt = require("bcrypt");
const {BalanceCrypto} = require("../models/TablesExchange/tableBalanceCrypto");
const {Wallet} = require("../models/TablesExchange/tableWallet");


const { User, Transaction, Winthdraw } = require("../models/models");

class WalletControllers {
    async freeKassa(req, res) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const { amount } = req.body;

        const result = freekassa(
            {
                m: "26520",
                oa: amount,
                i:'',
                currency: "RUB",
                em:user.email,
                pay:'PAY',
                phone:user.phone,
                o: user.username
            },
            "R0w6)=uNGqf1]JQ"
        );
        return res.json(result);
    }
    async redirectAndPay(req, res) {
        let { MERCHANT_ORDER_ID, AMOUNT } = req.query;
        AMOUNT = +AMOUNT;
        let update = {};
        if (MERCHANT_ORDER_ID && AMOUNT) {
            const user = await User.findOne({
                where: { username: MERCHANT_ORDER_ID },
            });
            const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
            const walletRUBBalance = await BalanceCrypto.findOne({
                where: {
                    userId: user.id,
                    walletId: walletRUBId.id
                }
            })
            if (AMOUNT){
                update = {balance: (+walletRUBBalance.balance)+ (+AMOUNT)}
            }
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
        }
        const url = "https://kosmos-lif.host/finances";
        return res.redirect(url);
    }
    async redirect(req, res) {
        let { MERCHANT_ORDER_ID, AMOUNT } = req.query;
        AMOUNT = +AMOUNT;
        let update = {};

        if (MERCHANT_ORDER_ID && AMOUNT) {
            const user = await User.findOne({
                where: { username: MERCHANT_ORDER_ID },
            });
            const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
            const walletRUBBalance = await BalanceCrypto.findOne({
                where: {
                    userId: user.id,
                    walletId: walletRUBId.id
                }
            });
            if (AMOUNT){
                update = {balance: (+walletRUBBalance.balance)+ AMOUNT}
            }
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
        }else if (MERCHANT_ORDER_ID && AMOUNT){
            return res.json(`success ${MERCHANT_ORDER_ID && AMOUNT}`)
        }else {
            return res.json(`error ${MERCHANT_ORDER_ID && AMOUNT}`)
        }
    }
    async redirectErr(req, res) {
        const url = "https://kosmos-lif.host";
        return res.redirect(url);
    }
    async withdraw(req, res, next){
        const { amount, password, system, wallet } = req.body;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        if (!user.finance_password){
            return next(ApiError.internal("Создайте пароль"));
        }
        let updateMinus
        let comparePassword = bcrypt.compareSync(password, user.finance_password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }
        if (parseInt(user.balance) < parseInt(amount)){
            return next(ApiError.internal("Не хватает средств"));
        }
        updateMinus = { balance: parseInt(user.balance) - parseInt(amount) };
        await User.update(updateMinus, {where:{id:user.id}})
        const item = await Winthdraw.create({
            amount, system, wallet, userId:user.id
        })
        return res.json(item);
    }
    async transfer(req, res, next){
        let updateMinus
        const { amount, password, username } = req.body;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        if (!user.finance_password){
            return next(ApiError.internal("Создайте пароль"));
        }
        let comparePassword = bcrypt.compareSync(password, user.finance_password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }
        if (user.balance < amount){
            return next(ApiError.internal("Не хватает средств"));
        }
        updateMinus = { balance: parseInt(user.balance) - parseInt(amount) };
        await User.update(updateMinus, {where:{id:user.id}})
        const userForTransfer = await User.findOne({
            where: { username },
        });
        if (!userForTransfer){
            return next(ApiError.internal("Нет такого пользователья"));
        }
        let update = {locale: parseInt(userForTransfer.locale) + parseInt(amount)}
        await User.update(update, {where:{id:userForTransfer.id}})
        return res.json(update);
    }
    async transaction(req, res){
        const {transaction} = req.query
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const trans =await Transaction.findAll({ where: { userId: user.id } })

        return res.json({items:trans})
    }
    async success(req, res) {
        let { Success, Amount, OrderId} = req.query;
        let arr = OrderId.split(':')
        let username = (arr[1]).trim()
        if (Success){
            let update = {};
            if (username && Amount) {
                Amount = (+Amount) / 100
                const user = await User.findOne({
                    where: { username: username },
                });
                const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
                const walletRUBBalance = await BalanceCrypto.findOne({
                    where: {
                        userId: user.id,
                        walletId: walletRUBId.id
                    }
                });
                if (Amount){
                    update = {balance: (+walletRUBBalance.balance)+ Amount}
                }
                await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            }
        }

        const url = "https://kosmos-lif.host/finances";
        return res.redirect(url);
    }
}
module.exports = new WalletControllers();