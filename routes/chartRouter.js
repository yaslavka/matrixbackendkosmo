const Router = require('express')
const ChartControllers = require('../controllers/ChartControllers')
const router = new Router()



router.get('/public', ChartControllers.list)


 

module.exports = router