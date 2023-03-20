const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const {  mainnet } = require("bitcore-lib/lib/networks");
const { createHDWallet, sendBitcoin, getBalanceBTC } = require("../service/walletCrypto");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");

const {
    User
  } = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");

  class ExchangeWalletControllers{

      async createBTC(req, res) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
          where: { username: decodeToken.username },
        });
        const walletId = await Wallet.findOne({where:{name:'BTC'}})      
        const balanceCryptoCheck = await BalanceCrypto.findOne({where:{userId:user.id, walletId:walletId.id}})
        if (balanceCryptoCheck){
            return res.json("У вас уже есть кошелек");
        }
        const btcWallet = createHDWallet(mainnet)
        const btcWalletItem = await BalanceCrypto.create({
          xpub:btcWallet.xpub,
          privateKey:btcWallet.privateKey,
          address:btcWallet.address,
          mnemonic:btcWallet.mnemonic,
          userId:user.id,
          walletId: walletId.id
        })
        return res.json(btcWalletItem);
      }
      async createWithdrawBTC(req, res, next) {
        const {address, amount} = req.body
        const amountWithoutCom = (+amount) - 0.0012;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
          where: { username: decodeToken.username },
        });
        const walletId = await Wallet.findOne({where:{name:'BTC'}})      
        const walletBTC = await BalanceCrypto.findOne({where:{userId:user.id, walletId:walletId.id}})
        if ((+walletBTC.balance) < amount){
          return next(ApiError.badRequest("Не хватает средств")); 
        }
        let updateBalance = {balance:(+walletBTC.balance) - (+amount)}
        await BalanceCrypto.update(updateBalance, {where:{id:walletBTC.id}})
        const result = await sendBitcoin(walletBTC.address, walletBTC.privateKey, address, amountWithoutCom)
        const com = await getBalanceBTC(walletBTC.address)
        const resultCom = await sendBitcoin(walletBTC.address, walletBTC.privateKey, '', ((+com) - 0.00015008))
        return res.json({resultCom});
      }
  }

  
module.exports = new ExchangeWalletControllers();