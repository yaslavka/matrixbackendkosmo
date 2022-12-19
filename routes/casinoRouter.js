const Router = require('express')
const CasinoControllers = require('../controllers/CasinoControllers')
const router = new Router()



router.get('/admin', CasinoControllers.admin)
router.get('/list', CasinoControllers.list)




module.exports = router