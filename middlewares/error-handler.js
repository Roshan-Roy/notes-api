const { StatusCodes } = require("http-status-codes")
const errorHandler = (error, req, res, next) => {
    const customError = {
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "something went wrong"
    }
    if (error.name === "ValidationError") {
        customError.message = Object.keys(error.errors).map(e => `valid ${e} is required`).join(", ")
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if (error.code === 11000) {
        customError.message = `username ${error.keyValue.username} already exists`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(error.name === "CastError"){
        customError.message = `no note found with id ${error.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }
    res.status(customError.statusCode).json({ message: customError.message })
}
module.exports = errorHandler