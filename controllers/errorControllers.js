const AppError = require("../utils/appError")

const handleCastErrorDB = (err) => {
  const message = `Invaild Id ${err.value} for the path ${err.path} `
  return new AppError(message, 400)
}

const duplicateFieldValueErrorDB = err => {
  const message = `Duplicate field value present named ${err.keyValue.name}`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  const message = Object.values(err.errors).map(val => val.message).join('. ')
  return new AppError(message, 400)
}

const handleJsonWebTokenError = () => {
  return new AppError('Token has been Modified', 401)
}

const handleTokenExpiredError = () => {
  return new AppError('Token has Expired', 401)
}

const sendErrorsDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else {
    console.log(err)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    })
  }
}

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // trusted error can be shown here
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    // for non truested errors like app errors dependency errors or programming error
    else {
      return res.status(500).json({
        status: 'error',
        message: 'something went wrong'
      })
    }
  } else {
    // trusted error can be shown here
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      })
    }
    // for non truested errors like app errors dependency errors or programming error
    else {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: "Please try again later!"
      })
    }
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error"
  if (process.env.NODE_ENV == 'development') {
    sendErrorsDev(err, req, res)
  }
  else if (process.env.NODE_ENV == 'production') {
    let error = Object.defineProperties({}, Object.getOwnPropertyDescriptors(err))

    if (err.name === 'CastError') error = handleCastErrorDB(error)
    if (err.code === 11000) error = duplicateFieldValueErrorDB(error)
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError()
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError()
    sendErrorProd(error, req, res)
  }
}