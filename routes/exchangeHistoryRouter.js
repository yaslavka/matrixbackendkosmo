const Router = require('express')
const ExchangeHistoryControllers = require('../controllers/ExchangeHistoryControllers')
const router = new Router()



router.get('/public', ExchangeHistoryControllers.list)


 

module.exports = router