const Router = require('express')
const MarketControllers = require('../controllers/MarketControllers')
const router = new Router()



router.get('/public', MarketControllers.list)


 

module.exports = router