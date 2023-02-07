const express = require("express")

const userController = require("./../controllers/usersControllers")
const authController = require("./../controllers/authControllers")

const router = express.Router()

router.post('/sign-up', authController.signup)
router.post('/log-in', authController.login)
router.get('/log-out', authController.logout)

router.post('/fortget-password', authController.forgetPassword)
router.patch('/reset-password/:token', authController.resetPassword)

router.use(authController.protect)

router.patch('/update-password/', authController.updatePassword)

router.get('/get-me', userController.getMe, userController.getUser)
router.patch('/update-me', userController.uploadImage, userController.resizeImage, userController.updateMe)
router.delete('/delete-me', userController.deleteMe)

router.use(authController.restrictTo('admin'))

router
  .route("/")
  .get(userController.getAllUser)
  .get(userController.createUser)


router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router