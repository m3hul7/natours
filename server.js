const mongoose = require("mongoose")
const dotenv = require("dotenv")

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message)
    console.log('Uncaught Exception! 💀 Shutting down 💀')
    process.exit()
})

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
    console.log("APP STARTED!")
})

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Exception! 💀 Shutting down 💀')
    server.close(() => {
        process.exit()
    })
})