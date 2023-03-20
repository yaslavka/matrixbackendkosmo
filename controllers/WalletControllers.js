const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const freekassa = require("freekassa-node");
const bcrypt = require("bcrypt");
const {BalanceCrypto} = require("../models/TablesExchange/tableBalanceCrypto");
const {Wallet} = require("../models/TablesExchange/tableWallet");
const { User, Transaction, Winthdraw } = require("../models/models");
const {stringify} = require("querystring");
var sha256 = require("js-sha256").sha256;

class WalletControllers {
  async payeer(req, res) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const amountReq = req.body.amount;
    const amount = `${amountReq}.00`;
    const shopId = 1819486413;
    const secretKey = "Wua9xPAoyhouW4Iv";
    const orderId = user.username;
    const currency = "RUB";
    const description =
      "0J7Qv9C70LDRgtCwINGC0L7QstCw0YDQvtCyINCc0LDQs9Cw0LfQuNC9IEtPU01PUw==";
    const hash = [shopId, orderId, amount, currency, description];
    hash.push(secretKey);
    const sign = sha256(hash.join(":")).toUpperCase();

    const queryParams = {
      m_shop: shopId,
      m_orderid: orderId,
      m_amount: amount,
      m_curr: currency,
      m_desc: description,
      m_sign: sign,
      m_process: "send",
    };

    return res.json({
      url: `https://payeer.com/merchant/?${stringify(queryParams)}`,
    });
  }
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
    const url ="https://kosmos-lif.host/finances";
    return res.redirect(url);
  }

  async redirectAndPa(req, res) {
    const { m_orderid, m_amount } = req.query;

    let update = {};
    if (m_orderid && m_amount) {
      const user = await User.findOne({
        where: { username: m_orderid },
      });
      const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
      const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
          userId: user.id,
          walletId: walletRUBId.id
        }
      })
      if (m_amount){
        update = {balance: (+walletRUBBalance.balance)+ (+m_amount)}
      }
      await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
    }
    const url ="https://kosmos-lif.host/finances";
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
  async redirectp(req, res) {
    const { m_orderid, m_amount } = req.query;
    let update = {};

    if (m_orderid && m_amount) {
      const user = await User.findOne({
        where: { username: m_orderid },
      });
      const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
      const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
          userId: user.id,
          walletId: walletRUBId.id
        }
      });
      if (m_amount){
        update = {balance: (+walletRUBBalance.balance)+ m_amount}
      }
      await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
    }else if (m_orderid && m_amount){
      return res.json(`success ${m_orderid && m_amount}`)
    }else {
      return res.json(`error ${m_orderid && m_amount}`)
    }
  }
  async redirectErr(req, res) {
    const url ="https://kosmos-lif.host/finances";
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
    const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
    const walletRUBBalance = await BalanceCrypto.findOne({
      where: {
        userId: user.id,
        walletId: walletRUBId.id
      }
    })
    if (!user.finance_password){
      return next(ApiError.internal("Создайте пароль"));
    }
    let comparePassword = bcrypt.compareSync(password, user.finance_password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    if (+walletRUBBalance.balance < amount){
      return next(ApiError.internal("Не хватает средств"));
    }
    let updateMinus = { balance: (+walletRUBBalance.balance) - amount };
    await BalanceCrypto.update(updateMinus, {where:{id:walletRUBBalance.id}})
    await User.update(updateMinus, {where:{id:user.id}})
    const item = await Winthdraw.create({
      amount, system, wallet, userId:user.id
    })
    return res.json(item);
  }
  async transfer(req, res, next){
    const { amount, password, username } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
    const walletRUBBalance = await BalanceCrypto.findOne({
      where: {
        userId: user.id,
        walletId: walletRUBId.id
      }
    })
    if (!user.finance_password){
      return next(ApiError.internal("Создайте пароль"));
    }
    let comparePassword = bcrypt.compareSync(password, user.finance_password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    if (+walletRUBBalance.balance < amount){
      return next(ApiError.internal("Не хватает средств"));
    }
    let updateMinus = { balance: (+walletRUBBalance.balance) - amount };
    await BalanceCrypto.update(updateMinus, {where:{id:walletRUBBalance.id}})
    const userForTransfer = await User.findOne({
      where: { username },
    });
    if (!userForTransfer){
      return next(ApiError.internal("Нет такого пользователья"));
    }
    const walletRUBBalanc = await BalanceCrypto.findOne({
      where: {
        userId: userForTransfer.id,
        walletId: walletRUBId.id
      }
    })
    let update = {balance: (+walletRUBBalanc.balance) + amount}
    await BalanceCrypto.update(update, {where:{id:walletRUBBalanc.id}})
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

    const url ="kosmos://Finances"||  "https://kosmos-lif.host/finances";
    return res.redirect(url);
  }
}
module.exports = new WalletControllers();
