const User = require("../model/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, AuthorizationError } = require("../errors")

const signup = async (req, res) => {
  const newUser = await User.create(req.body)
  const token = newUser.createJWT()
  res.status(StatusCodes.CREATED).json({ name: newUser.name, token })
}
const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequestError("provide both username and password")
  }
  const user = await User.findOne({ username })
  if (!user) {
    throw new AuthorizationError("user not found")
  }
  const passwordMatching = await user.passwordMatching(password)
  if (!passwordMatching) {
    throw new AuthorizationError("incorrect password")
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ name: user.name, token })
}
module.exports = {
  signup,
  login
}