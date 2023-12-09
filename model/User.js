require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        match:[/^[a-zA-Z\s]{2,30}$/,"please provide a valid name"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        match: [/^[a-z_][a-z0-9_]{4,19}$/, "please provide a valid username"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is requied"],
        minLength: [6, "min length for password is 6"],
        maxLength: [12, "max length for password is 12"]
    }

})
userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.createJWT = function () {
    return jwt.sign({ userid: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}
userSchema.methods.passwordMatching = async function (userPassword) {
    const matching = await bcrypt.compare(userPassword, this.password)
    return matching
}
module.exports = mongoose.model("User", userSchema)