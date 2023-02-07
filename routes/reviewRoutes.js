const express = require("express")

const reviewController = require("./../controllers/reviewControllers")
const authController = require("./../controllers/authControllers")

const router = express.Router({
    mergeParams: true
})

router.use(authController.protect)

router
    .route('/')
    .get(
        reviewController.setUserAndTourId,
        reviewController.getAllReviews
    )
    .post(
        authController.restrictTo('user'),
        reviewController.setUserAndTourId,
        reviewController.createReview
    )

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )

module.exports = router