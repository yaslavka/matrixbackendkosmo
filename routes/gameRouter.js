const Router = require('express')
const GameControllers = require('../controllers/GameControllers')
const router = new Router()



router.post('/html5/evoplay', GameControllers.project)




module.exports = router