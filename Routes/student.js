const express = require("express");
const Student = require("../Models/Student");
const Mentor = require("../Models/Mentor");

const router = express.Router();

// API to get all Students
router.get("/", async function (req, res) {
    try {
        const student = await Student.find().populate("mentor");
        res.send(student)
    } catch (err) {
        res.send(err.message)
    }
})

// API to create Student
router.post("/", async function (req, res) {
    try {
        const newStudent = await Student.create({ name: req.body.name });
        res.send(newStudent)
    } catch (err) {
        res.send(err.message)
    }
})

// API to show all students for a particular mentor
router.get("/:mentorId", async function (req, res) {
    try {
        const studentList = await Student.find({ mentor: req.params.mentorId });
        res.send(studentList)
    } catch (err) {
        res.send(err.message)
    }
})

// API to delete a student
router.delete("/", async function (req, res) {
    try {
        const newStudent = await Student.findByIdAndDelete(req.body.studentId);
        res.send(newStudent)
    } catch (err) {
        res.send(err.message)
    }
})

// API to Assign or Change Mentor for particular Student
router.put("/assign-mentor", async function (req, res) {
    try {
        const foundStudent = await Student.findById(req.body.studentId);
        if (foundStudent.mentor !== null) {
            res.send({ "msg": "Mentor is already assigned" })
        } else {
            // updating mentor value
            const mentorAssign = await foundStudent.updateOne({ $set: { mentor: req.body.mentorId } });
            // adding student to mentor's students list
            const foundMentor = await Mentor.findOne({ _id: req.body.mentorId })
            const addStudentToMentorStudents = await foundMentor.updateOne({ $push: { students: req.body.studentId } });
            res.send("Mentor Assigned!")
        }
        // console.log(foundStudent);
    } catch (err) {
        res.send(err.message)
    }
})


// API to Assign a student to Mentor
router.put("/assign-student", async function (req, res) {
    try {
        const foundMentor = await Mentor.findById(req.body.mentorId);
        const findStudent = await Student.findById(req.body.studentId);
        if (foundMentor.students.includes(req.body.studentId)) {
            res.send("Same student is already assigned to the required mentor");
        } else if (findStudent.mentor !== null) {
            res.send("Mentor is already assigned to the required student")
        } else {
            const addStudent = await foundMentor.updateOne({ $push: { students: req.body.studentId } });
            const assignMentor = await findStudent.updateOne({ $set: { mentor: req.body.mentorId } });
            res.send(foundMentor)
        }
    } catch (err) {
        res.send(err.message)
    }
})

// API to Assign multiple students to Mentor
router.put("/add-multiple-students", async function (req, res) {
    try {
        const findMentor = await Mentor.findById(req.body.mentorId);
        const studentList = JSON.parse(req.body.students);

        for (let student of studentList) {
            const findStudent = await Student.findById(student);
            if ((!findMentor.students.includes(findStudent._id)) || (findStudent.mentor === null)) {
                try {
                    const addStudent = await findMentor.updateOne({ $push: { students: student } });
                    const assignMentor = await findStudent.updateOne({ $set: { mentor: req.body.mentorId } });
                } catch (err) {
                    res.send(err.message);
                }
            }
        }

        const updatedMentorData = await Mentor.findById(req.body.mentorId);
        res.send(updatedMentorData)

    } catch (err) {
        console.log(err);
    }
})




module.exports = router;