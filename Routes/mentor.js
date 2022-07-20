const express = require("express");
const Mentor = require("../Models/Mentor")

const router = express.Router();

// API to create Mentor
router.post("/", async function (req, res) {
    try {
        const newMentor = await Mentor.create({ name: req.body.name });
        res.send(newMentor)
    } catch (err) {
        res.send(err.message)
    }
})

// get all mentor or specific mentor with query
router.get("/", async function (req, res) {
    const mentorId = req.query.mentorId;
    if (mentorId) {
        try {
            const mentor = await Mentor.findById(mentorId)
            res.send(mentor);
        } catch (err) {
            res.send(err.message)
        }
    } else {
        try {
            const mentorList = await Mentor.find().populate("students");
            res.send(mentorList)
        } catch (err) {
            res.send(err.message)
        }
    }
})



module.exports = router;