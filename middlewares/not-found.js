const { StatusCodes } = require("http-status-codes")
const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "route not found" })
}
module.exports = notFound