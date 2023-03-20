const Router = require('express')
const UserControllers = require('../controllers/UserControllers')
const router = new Router()
// const multer = require('multer');
//
// const storage = multer.diskStorage({
//     destination(req, file, callback) {
//         callback(null, '.././files/images');
//     },
//     filename(req, file, callback) {
//         callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
//     },
// });
// const upload = multer({ storage });
// router.post('/avatars', upload.array('avatar'), UserControllers.avatars);


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
