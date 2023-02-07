const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(
    // DB, {
    process.env.DATABASE_LOCAL, {
}).then(con => {
    console.log("DATABASE CONNECTED!")
})

const app = require("./app")

const port = process.env.port || 1212

const server = app.listen(port, '127.0.0.1', () => {
    console.log("app started running...")
})