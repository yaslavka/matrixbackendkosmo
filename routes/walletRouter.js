const Router = require('express')
const WalletControllers = require('../controllers/WalletControllers')
const router = new Router()


//freeKassa
router.post('/create-pay', WalletControllers.freeKassa)
router.get('/success_freeKassa', WalletControllers.redirectErr)
router.get('/warning', WalletControllers.redirect)
router.get('/error',WalletControllers.redirectErr)

router.post('/create-payeer-pay', WalletControllers.payeer)
router.get('/success_payeer', WalletControllers.redirectAndPa)
router.get('/warning_payeer', WalletControllers.redirectp)
router.get('/error_payee',WalletControllers.redirectErr)

//withdraw
router.post('/create-withdraw', WalletControllers.withdraw)
router.post('/create-payeer-withdraw', WalletControllers.withdraw)

//transfer
router.post('/transfer', WalletControllers.transfer)
//transaction
router.get('/transactions', WalletControllers.transaction)
//tinkoffRouter
router.get('/success', WalletControllers.success)



module.exports = router

