require("dotenv").config()
const jwt = require("jsonwebtoken")
const { AuthorizationError } = require("../errors")

const authorization = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthorizationError("unable to authorize")
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { username: decoded.username, userid: decoded.userid }
        next()
    } catch (error) {
        throw new AuthorizationError("unable to authorize")
    }
}
module.exports = authorization