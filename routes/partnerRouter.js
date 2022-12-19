const Router = require('express')
const PartnerControllers = require('../controllers/PartnerControllers')
const router = new Router()



router.get('/', PartnerControllers.structure)



module.exports = router