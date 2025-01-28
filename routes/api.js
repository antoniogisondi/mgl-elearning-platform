const express = require('express')
const router = express.Router()
const {StudentsLogin} = require('../controllers/StudentController')

// API FRONTOFFICE

router.post('/login', StudentsLogin)

module.exports = router