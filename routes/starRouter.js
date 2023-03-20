const Router = require('express')
const StarControllers = require('../controllers/StarControllers')
const LandingInfoController = require('../controllers/landingInfoController')
const router = new Router()



router.post('/buy', StarControllers.buy)
router.post('/update', StarControllers.update)
router.get('/statistic', StarControllers.statistic)
router.get('/list', StarControllers.list)
router.post('/landing-info', LandingInfoController.getLandingInfo)



module.exports = router