const express = require('express')
const router = express.Router()
const authStudents = require('../middleware/protect')
const {StudentsLogin} = require('../controllers/StudentController')

// API FRONTOFFICE

router.post('/login', StudentsLogin)

router.post("/logout", (req, res) => {
    res.status(200).json({logout})
});

router.get('/auth', authStudents, async (req, res) => {
    console.log("Studente autenticato:", req.student);
    
    const studentWithCourses = await req.student.populate('assignedCourses')
    if (!studentWithCourses) {
        return res.status(401).json({ message: "Non autenticato" });
    }

    res.status(200).json({ student: studentWithCourses });
});

module.exports = router