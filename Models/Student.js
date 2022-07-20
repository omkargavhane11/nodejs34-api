const mongoose = require('mongoose');
const Mentor = require("../Models/Mentor")

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mentor: {
        type: mongoose.Types.ObjectId,
        ref: "Mentor",
        default: null
    }
})

module.exports = mongoose.model("Student", studentSchema)