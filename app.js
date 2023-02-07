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

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// to serve static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({origin:true, credentials: true}));

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

// parser of body to req body
app.use(express.json( {limit: '10kb'} ))

app.use(express.urlencoded({
  extended:true,
  limit:'10kb'
}))

app.use(cookieParser())

// express mongo sanitize for nosql injection
app.use(mongoSanitize())

// xss sanitizer
app.use(xss())

app.use((req, res, next) => {
  req.timeofreq = new Date().toDateString()
  console.log("Time of Req ",req.timeofreq)
  next()
})

// routes

module.exports = app