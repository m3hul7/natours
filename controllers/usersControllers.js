const sharp = require("sharp")
const multer = require("multer")

const User = require("../models/userModel")

const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

const handlerFactory = require("./../controllers/handlerFactory")

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Chooose correct filetype to upload an Image',400))
  }
}

exports.resizeImage = (req, res, next) => {
  if(!req.file) next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
  sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`)
  next()
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadImage = upload.single('photo')

const filterBody = (obj, ...fields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if(fields.includes(el)) {
      newObj[el] = obj[[el]]
    }
  })
  return newObj
}

exports.getMe = (req, res, next) => {
  req.params.id= req.user.id
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('this route is not for password updation', 400))
  }
  let filteredObj
  if(req.body.role != 'admin' && req.body.role != 'lead-guide'){
    filteredObj = filterBody( req.body, 'name', 'email', 'role')
  } else {
    filteredObj = filterBody( req.body, 'name', 'email')
  }

  if(req.file.filename) filteredObj.photo = req.file.filename

  const update = await User.findByIdAndUpdate(req.user.id, filteredObj, {runValidators: true, new: true})

  res.status(200).json({
    status: 'success',
    update
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    user
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "Please use sign up to create new user",
  })
}

exports.getAllUser = handlerFactory.getAll(User)
exports.getUser = handlerFactory.getOne(User)
// do not try to update password
exports.updateUser = handlerFactory.updateOne(User)
exports.deleteUser = handlerFactory.deleteOne(User)