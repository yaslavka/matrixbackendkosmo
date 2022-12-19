const Router = require('express')
const SettingsControllers = require('../controllers/SettingsControllers')
const router = new Router()



router.post('/fin-password', SettingsControllers.finPass)
router.post('/restore-password', SettingsControllers.restore)




module.exports = router