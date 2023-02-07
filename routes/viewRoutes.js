const express = require("express")

const viewContorller = require("../controllers/viewControllers")
const authController = require("../controllers/authControllers")
const bookingController = require("../controllers/bookingControllers")

const router = express.Router()

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     title: 'Exciting tours for adventurous people',
//     user: 'mehul'
//   })
// })

router.get('/', bookingController.createBookingCheckout,authController.isLoggedIn, viewContorller.getOverview)
router.get('/tour/:slug', authController.protect, viewContorller.getTour)
router.get('/login', authController.isLoggedIn, viewContorller.getLogIn)
router.get('/me', authController.protect, viewContorller.getAccount)
router.get('/my-tours', authController.protect, viewContorller.getMyTours)

router.post('/update-user-setting', authController.protect, viewContorller.updateUser)

module.exports = router  