const express = require('express')
const router = express.Router()
const authStudents = require('../middleware/protect')
const {StudentsLogin} = require('../controllers/StudentController')

// API FRONTOFFICE

router.post('/login', StudentsLogin)

router.post("/logout", (req, res) => {
    res.status(200).json({logout})
});

router.get('/auth', authStudents, (req, res) => {
    console.log("Studente autenticato:", req.student);
    
    if (!req.student) {
        return res.status(401).json({ message: "Non autenticato" });
    }

    res.status(200).json({ student: req.student });
});

module.exports = router