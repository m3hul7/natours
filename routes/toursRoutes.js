const express = require("express")

const tourController = require("./../controllers/toursControllers")
const authController = require("./../controllers/authControllers")

const reviewRouter = require("./../routes/reviewRoutes")

const router = express.Router()

router
  .use("/:tourId/reviews",
    reviewRouter
  )

router
  .route("/top-five")
  .get(
    tourController.aliasTopFive,
    tourController.getAllTour
  )

router
  .route("/tour-stats")
  .get(tourController.getToursStats)

router
  .route("/tour-monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  )

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin)
// tours-within/400/center/34.013332,-118.288166/unit/mi

router
  .route("/distances/:latlng/unit/:unit")
  .get(tourController.getDistances)

router
  .route("/")
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  )

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )

module.exports = router
