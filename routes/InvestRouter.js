const Router = require('express')
const InvestControllers = require('../controllers/InvestControllers')
const ExchangeWalletControllers = require('../controllers/ExchangeWalletControllers')
const router = new Router()



router.post('/invest_box', InvestControllers.create)
router.post('/createBTC', ExchangeWalletControllers.createBTC)
router.post('/createWithdraw_btc', ExchangeWalletControllers.createWithdrawBTC)




module.exports = router