const Router = require('express')
const UserControllers = require('../controllers/UserControllers')
const router = new Router()


//registration
router.get('/inviter', UserControllers.inviter)
router.post('/registration', UserControllers.registration)

//login
router.post('/login', UserControllers.login)
router.post('/fio', UserControllers.fio)
router.post('/links', UserControllers.links)
router.post('/description', UserControllers.description)
router.get('/', UserControllers.user)
router.post('/avatar', UserControllers.avatar)
router.post('/password', UserControllers.password)


module.exports = router