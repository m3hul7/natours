const stripe =require("stripe")(process.env.STRIPE_SECRET_KEY)

const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

const Tour = require("../models/tourModel")
const Booking = require("./../models/bookingModel")

const handlerFactory = require("./handlerFactory")

exports.getCheckoutSession = catchAsync( async (req, res, next) => {
    // 1> get tour by id
    const tour = await Tour.findById(req.params.tourId)

    // 2> create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: `${tour.name} Tour`
                  },
                  unit_amount: tour.price * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment'
    })

    // 3> Create checkout session by response
    res.status(200).json({
        status: 'success',
        session
    })
})

exports.createBookingCheckout = catchAsync( async (req, res, next) => {
    // not so secure anyone can book without payment
    const { tour,  user, price } = req.query

    if(!tour && !user && !price) return next()

    await Booking.create({tour, user, price})

    res.redirect(req.originalUrl.split('?')[0])
})

exports.getBookings = handlerFactory.getAll(Booking)
exports.createBooking = handlerFactory.createOne(Booking)
exports.getBooking = handlerFactory.getOne(Booking)
exports.updateBooking = handlerFactory.updateOne(Booking)
exports.deleteBooking = handlerFactory.deleteOne(Booking)
