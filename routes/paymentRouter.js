const router = require('express').Router()
const paymentControl = require('../controllers/paymentControl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/payment')
    .get(auth, authAdmin, paymentControl.getPayments)
    .post(auth, paymentControl.createPayment)


module.exports = router