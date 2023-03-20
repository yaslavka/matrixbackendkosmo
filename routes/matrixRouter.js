const Router = require('express')
const SweepsControllers = require('../controllers/SweepsControllers')
const KeplerControllers = require('../controllers/KeplerControllers')
const GlieseControllers = require('../controllers/GlieseControllers')
const AidaControllers = require('../controllers/AidaControllers')
const RocketsControllers =require('../controllers/RocketsControllers')
const IonControllers = require('../controllers/IonControllers')
const RoyalsControllers = require('../controllers/RoyalControllers')
const UnoControllers = require('../controllers/UnoControllers')


const router = new Router()

//sweeps
router.get('/clone-stat', SweepsControllers.getCloneStat)
router.get('/type', SweepsControllers.getType)
router.post('/buy', SweepsControllers.buy)
router.get('/structure', SweepsControllers.structure)
router.get('/structure-upper', SweepsControllers.structureUpper)
router.get('/clone', SweepsControllers.clone)
router.post('/target-install-clone', SweepsControllers.targetClone)

//x2
router.get('/unos/clone-stat', UnoControllers.getCloneStat)
router.post('/unos/buy', UnoControllers.buy)
router.get('/unos/type', UnoControllers.getType)
router.get('/unos/structure', UnoControllers.structure)
router.get('/unos/structure-upper', UnoControllers.structureUpper)
router.get('/unos/clone', UnoControllers.clone)
router.post('/unos/target-install-clone', UnoControllers.targetClone)

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

//Rockets
router.get('/rockets/type', RocketsControllers.getType)
router.get('/rockets/clone-stat', RocketsControllers.getCloneStat)
router.post('/rockets/buy', RocketsControllers.buy)
router.get('/rockets/structure', RocketsControllers.structure)
router.get('/rockets/structure-upper', RocketsControllers.structureUpper)
router.get('/rockets/clone', RocketsControllers.clone)
router.post('/rockets/target-install-clone', RocketsControllers.targetClone)

//Ion
router.get('/ion/clone-stat', IonControllers.getCloneStat)
router.post('/ion/buy', IonControllers.buy)
router.get('/ion/type', IonControllers.getType)
router.get('/ion/structure', IonControllers.structure)
router.get('/ion/structure-upper', IonControllers.structureUpper)
router.get('/ion/clone', IonControllers.clone)
router.post('/ion/target-install-clone', IonControllers.targetClone)

//Royal
router.get('/royals/type', RoyalsControllers.getType)
router.get('/royals/clone-stat', RoyalsControllers.getCloneStat)
router.post('/royals/buy', RoyalsControllers.buy)
router.get('/royals/structure', RoyalsControllers.structure)
router.get('/royals/structure-upper', RoyalsControllers.structureUpper)
router.get('/royals/clone', RoyalsControllers.clone)
router.post('/royals/install-clone', RoyalsControllers.targetClone)


module.exports = router
