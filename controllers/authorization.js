const User = require("../model/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, AuthorizationError } = require("../errors")

const signup = async (req, res) => {
  const newUser = await User.create(req.body)
  const token = newUser.createJWT()
  res.status(StatusCodes.CREATED).json({ username: newUser.username, token })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("provide both email and password")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new AuthorizationError("user not found")
  }
  const passwordMatching = await user.passwordMatching(password)
  if (!passwordMatching) {
    throw new AuthorizationError("incorrect password")
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ username: user.username, token })
}
module.exports = {
  signup,
  login
}