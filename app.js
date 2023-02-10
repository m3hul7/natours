const express = require("express");
const path = require("path")
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const hpp = require("hpp")
const mongoSanitize = require("express-mongo-sanitize")
const cookieParser = require("cookie-parser")

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorControllers")

const usersRouter = require("./routes/usersRoutes")
const tourRouter = require("./routes/toursRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const bookingRouter = require("./routes/bookingRoutes")
const viewRouter = require("./routes/viewRoutes")

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// to serve static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({ origin: true, credentials: true }));

// for security 
// app.use(helmet())

// for logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// set request limiter 
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  messsage: 'Too many requests from this IP, Please try again in an hour!'
})

app.use('/api', limiter)

// prevent params pollution
app.use(hpp({
  whitelist: [
    'duration',
    'maxGroupSize',
    'ratingAverage',
    'ratingQuantity',
    'price',
    'difficulty'
  ]
}))

// parser of body to req body
app.use(express.json({ limit: '10kb' }))

app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}))

app.use(cookieParser())

// express mongo sanitize for nosql injection
app.use(mongoSanitize())

// xss sanitizer
app.use(xss())

app.use((req, res, next) => {
  req.timeofreq = new Date().toDateString()
  console.log("Time of Req ", req.timeofreq)
  next()
})

// routes
app.use("/", viewRouter)

app.use("/api/v1/users", usersRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/booking", bookingRouter)

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find URL 😭 ${req.originalUrl} on this server !`, 404))
})

app.use(globalErrorHandler)

module.exports = app