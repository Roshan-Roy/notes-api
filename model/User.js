require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minLength: [3, "min length for username is 3"],
        maxLength: [30, "max length for username is 30"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is requied"],
        minLength: [6, "min length for password is 6"],
        maxLength: [12, "max length for password is 12"],
        trim: true
    }

})
userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.createJWT = function () {
    return jwt.sign({ username: this.username, userid: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}
userSchema.methods.passwordMatching = async function(userPassword){
    const matching = await bcrypt.compare(userPassword,this.password)
    return matching
}
module.exports = mongoose.model("User", userSchema)