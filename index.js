require("dotenv").config()
require("express-async-errors")

//security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

const express = require("express")
const app = express()

//routers
const authorizationRouter = require("./routers/authorization")
const notesRouter = require("./routers/notes")

//middlewares
const notFound = require("./middlewares/not-found")
const errorHandler = require("./middlewares/error-handler")
const authorization = require("./middlewares/authorization")

//connect to database
const connectDB = require("./db/connect")

//app.use
app.set("trust proxy", 1)
app.use(rateLimiter({
    windowMs: 2 * 60 * 1000, //2 minutes
    max: 150 //150 requests per 2 minutes
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use("/api",authorizationRouter)
app.use("/api/notes",authorization,notesRouter)
app.use(notFound)
app.use(errorHandler)

//start server
const port = process.env.PORT || 5000
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server started successfully on port ${port}`)
        })
    } catch (error) {
        console.log("unable to start server", error)
    }
}

startServer()