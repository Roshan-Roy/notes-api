const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is  required"],
        maxLength: [50, "max length for title is 50"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "description is required"],
        maxLength: [2500, "max length for description is 2500"],
        trim: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    starred: {
        type: Boolean,
        required:[true,"specify whether the note is starred or not"]
    }
}, { timestamps: true })

module.exports = mongoose.model("Note", notesSchema)