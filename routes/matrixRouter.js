const Router = require('express')
const SweepsControllers = require('../controllers/SweepsControllers')
const KeplerControllers = require('../controllers/KeplerControllers')
const GlieseControllers = require('../controllers/GlieseControllers')
const AidaControllers = require('../controllers/AidaControllers')


const router = new Router()


//sweeps
router.get('/clone-stat', SweepsControllers.getCloneStat)
router.get('/type', SweepsControllers.getType)
router.post('/buy', SweepsControllers.buy)
router.get('/structure', SweepsControllers.structure)
router.get('/structure-upper', SweepsControllers.structureUpper)
router.get('/clone', SweepsControllers.clone)
router.post('/target-install-clone', SweepsControllers.targetClone)

//kepler
router.get('/uno/clone-stat', KeplerControllers.getCloneStat)
router.post('/uno/buy', KeplerControllers.buy)
router.get('/uno/type', KeplerControllers.getType)
router.get('/uno/structure', KeplerControllers.structure)
router.get('/uno/structure-upper', KeplerControllers.structureUpper)
router.get('/uno/clone', KeplerControllers.clone)
router.post('/uno/target-install-clone', KeplerControllers.targetClone)
//Gliese
router.get('/mini/type', GlieseControllers.getType)
router.get('/mini/clone-stat', GlieseControllers.getCloneStat)
router.post('/mini/buy', GlieseControllers.buy)
router.get('/mini/structure', GlieseControllers.structure)
router.get('/mini/structure-upper', GlieseControllers.structureUpper)
router.get('/mini/clone', GlieseControllers.clone)
router.post('/mini/target-install-clone', GlieseControllers.targetClone)
//aida
router.get('/super/type', AidaControllers.getType)
router.get('/super/clone-stat', AidaControllers.getCloneStat)
router.post('/super/buy', AidaControllers.buy)
router.get('/super/structure', AidaControllers.structure)
router.get('/super/structure-upper', AidaControllers.structureUpper)
router.get('/super/clone', AidaControllers.clone)
router.post('/super/install-clone', AidaControllers.targetClone)


module.exports = router 