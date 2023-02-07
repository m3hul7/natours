const Tour = require("../models/tourModel")
const User = require("../models/userModel")
const Booking = require("../models/bookingModel")

const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find()

    res.status(200).render('overview', {
        title : 'All tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    if(!tour) {
        return next(new AppError('No tour found with that tour name', 404))
    }

    res.status(200).render('tour', {
        title : `${tour.name} Tour`,
        tour
    })
})

exports.getLogIn = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Account details'
    })
}

exports.updateUser = catchAsync(async (req, res) => {

    const doc = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.user,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    })

    res.status(200).render('account', {
        title: 'Account details',
        user: doc
    })
})

exports.getMyTours = catchAsync( async (req, res, next) => {
    
    // find all bookings
    const bookings = await Booking.find({user: req.user.id})

    // find tours with the returned ids
    const tourIds = bookings.map(el => el.tour)

    const tours = await Tour.find({ _id: { $in : tourIds}})

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    })
})