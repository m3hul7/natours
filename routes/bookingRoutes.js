const express = require("express")

const bookingController = require("./../controllers/bookingControllers")
const authController = require("./../controllers/authControllers")

const router = express.Router()

router.use(authController.protect)

router.route('/checkout-session/:tourId').get(bookingController.getCheckoutSession)

router.use(authController.restrictTo('admin', 'lead-guide'))

router.route('/').get(bookingController.getBookings).post(bookingController.createBooking)
router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking)

module.exports = router