const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");
const moment = require('moment')
const { User, Matrix_Table, InvestBox } = require("../models/models");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");
const { updateBalanceBTCByUserId } = require("../service/walletCrypto");
const decode='random_key'

const generateJwt = (id, email, username, first_name, last_name, referral) => {
    return jwt.sign({id:id, email: email, first_name: first_name, last_name: last_name, referral: referral, username: username},decode);
};
class UserController {
    async inviter(req, res, next) {
        const { username } = req.query;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return next(ApiError.internal("Такой пользователь не найден"));
        }
        let result = {
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
        };
        return res.json(result);
    }
    async registration(req, res, next) {
        const {
            email,
            first_name,
            last_name,
            password,
            phone,
            referral,
            username,
        } = req.body;

        if (
            !email ||
            !password ||
            !last_name ||
            !first_name ||
            !phone ||
            !referral ||
            !username
        ) {
            return next(ApiError.badRequest("Не все поля заполнены"));
        }
        const candidateEmail = await User.findOne({ where: { email } })
        const candidateUsername = await User.findOne({ where: { username } })
        const candidatephone = await User.findOne({ where: { phone } })
        if (candidateEmail) {
            return next(ApiError.badRequest("Такой email уже существует"));
        }
        if (candidateUsername) {
            return next(ApiError.badRequest("Такой Логин уже существует"));
        }
        if (candidatephone){
            return next(ApiError.badRequest("Такой телефон уже существует"));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const referralUser = await User.findOne({ where: { username: referral } });
        if (!referralUser) {
            return next(ApiError.badRequest("не верный логин пригласителя"));
        }
        const user = await User.create({
            email,
            username,
            first_name,
            last_name,
            password: hashPassword,
            phone,
            referal_id: referralUser.id,
            activation_date: new Date()
        });

        const walletRUB = await Wallet.findOne({where:{name: 'RUR'}})
        const createRUBBalance = await BalanceCrypto.create({
            userId: user.id,
            walletId: walletRUB.id
        })
        const access_token = generateJwt(
            user.id,
            user.email,
            user.username,
            user.first_name,
            user.last_name,
            user.referral
        );
        return res.json({ access_token });
    }
    async login(req, res, next) {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return next(ApiError.internal("Такой пользователь не найден"));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }

        const access_token = generateJwt(
            user.id,
            user.email,
            user.username,
            user.first_name,
            user.last_name,
            user.referral
        );
        const w = {w:access_token};
        return res.json({ access_token, w });
    }
    async fio(req, res, next) {
        const { firstName, lastName } = req.body;
        if (!firstName && !lastName) {
            return next(ApiError.internal("Поля не заполнены"));
        }
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let update = {}
        if (!firstName && lastName) {
            update = { last_name: lastName };
        } else if (firstName && !lastName) {
            update = { first_name: firstName };
        } else {
            update = { last_name: lastName, first_name: firstName };
        }
        const updatedUser = await User.update(update, { where: { id: user.id } });
        return res.json(updatedUser)
    }
    async links(req, res, next) {
        const { instagram, telegram, vk } = req.body;
        if (!instagram && !telegram && !vk) {
            return next(ApiError.internal("Поля не заполнены"));
        }
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        let update = {}
        if (!instagram && !telegram && vk) {
            update = { vkontakte: vk }
        } else if (!instagram && telegram && !vk) {
            update = { telegram }
        } else if (instagram && !telegram && !vk) {
            update = { instagram }
        } else if (instagram && telegram && !vk) {
            update = { instagram, telegram }
        } else if (instagram && !telegram && vk) {
            update = { instagram, vkontakte: vk }
        } else if (!instagram && telegram && vk) {
            update = { telegram, vkontakte: vk }
        } else {
            update = { telegram, instagram, vkontakte: vk }
        }
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        const updatedUser = await User.update(update, { where: { id: user.id } });
        return res.json(updatedUser)
    }
    async description(req, res, next) {
        const { description } = req.body;
        if (!description) {
            return next(ApiError.internal("Поля не заполнены"));
        }
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let update = { description }
        const updatedUser = await User.update(update, { where: { id: user.id } });
        return res.json(updatedUser)
    }
    async user(req, res, next) {
       const { authorization } = req.headers;
       if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        try {
            const { username } = jwt.decode(token);
            let user = await User.findOne({ where: { username } });
            if (!user) {
                return next(ApiError.internal("Такой пользователь не найден"));
            }
            let now = new Date();
            const investItem = await InvestBox.findAll({ where: { userId: user.id } })
            investItem.map(async (item) => {
                let depozitTime = item.updatedAt;
                let limitInvest = new Date(depozitTime?.getFullYear(), (depozitTime?.getMonth() + 1), depozitTime?.getDate())
                if (now > limitInvest) {
                    let countMonth = Math.floor(now?.getMonth() - depozitTime?.getMonth())
                    let update = { summ: (countMonth * (0.05 * item.summ) + item.summ), updatedAt:new Date(depozitTime?.getFullYear(), (depozitTime?.getMonth() + countMonth), depozitTime?.getDate() ) };
                    await InvestBox.update(update, { where: { id: item.id } })
                }
            })

            user = await User.findOne({ where: { username } });
            const matrixUser = await Matrix_Table.findAll({
                where: { userId: user.id },
            });
            const walletRUBId = await Wallet.findOne({ where: { name: 'RUR' } })
            const walletRUBBalance = await BalanceCrypto.findOne({
                where: {
                    userId: user.id,
                    walletId: walletRUBId.id
                }
            })
            let allBalances = (+walletRUBBalance.balance)
            let referal = await User.findOne({ where: { id: user.referal_id } });
            await updateBalanceBTCByUserId(user.id)
            let balanceCrypto = await BalanceCrypto.findAll({where:{userId:user.id}, include:{model: Wallet, as:'wallet'}})
            user.dataValues.referal = referal;
            user.dataValues.balanceCrypto = {};
            user.dataValues.address = {};
            user.dataValues.createdAt = moment.utc(user.dataValues.createdAt).format('DD/MM/YYYY')
            for (let i = 0; i < balanceCrypto.length; i++) {
                const market  = await Market.findOne({where:{pair:`RUR_${balanceCrypto[i].wallet.name}`}})
                if (market){
                    const orderSell = await OrderSell.findOne({where:{marketId:market.id}})
                    allBalances += (+balanceCrypto[i].balance) * ((+orderSell?.price) || 1)
                    user.dataValues.allBalances = allBalances
                }
                user.dataValues.balanceCrypto[`${balanceCrypto[i].wallet.name}`] = ((+balanceCrypto[i].balance) - (+balanceCrypto[i].unconfirmed_balance))
                user.dataValues.address[`${balanceCrypto[i].wallet.name}`] = balanceCrypto[i]?.address
                user.dataValues.allBalances = allBalances
            }
            return res.json(user);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(error));
        }
    }
 
    async avatar(req, res, next) {
        const { avatar } = req.files;
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let fileName = uuid.v4() + ".jpg";
        avatar.mv(path.resolve(__dirname, "..", "files", "images", fileName));
        let update = { avatar: fileName };
        await User.update(update, { where: { id: user.id } });
        return res.json("Аватар успешно загружен");
    }
    async avatars(req, res) {
        console.log('!!! FILES req.body:', JSON.stringify(req.body))
        console.log('!!! FILES req.files:', JSON.stringify(req.files))
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let fileName = req.files[0].filename;
        let update = { avatar: fileName };
        await User.update(update, { where: { id: user.id } });
       return res.json("Аватар успешно загружен");
    }
    async password(req, res, next) {
        try {
            const { new_password, old_password } = req.body;
            const { authorization } = req.headers;
            if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
            const token = authorization.slice(7);
            const decodeToken = jwt_decode(token);
            const user = await User.findOne({
                where: { username: decodeToken.username },
            });
            let comparePassword = bcrypt.compareSync(old_password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal("Неверный пароль"));
            }
            const hashPassword = await bcrypt.hash(new_password, 5);
            let updateFinPassword = {password: hashPassword}
            await User.update(updateFinPassword, {where:{id:user.id}})
            return res.json(true)
        } catch (error) {
            return res.json(error)
        }
    }
}
module.exports = new UserController();
