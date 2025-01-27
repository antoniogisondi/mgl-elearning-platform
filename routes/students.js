const express = require('express')
const router = express.Router()
const {ViewStudents, CreateStudents, UpdateStudentsGet, UpdateStudentsPost} = require('../controllers/StudentController')

router.get('/dashboard/students', ViewStudents)

router.get('/dashboard/students/create', (req,res) => {
    res.render('admin/students/create-students')
})
router.post('/dashboard/students/create', CreateStudents)

router.get('/dashboard/students/edit/:id', UpdateStudentsGet)
router.post('/dashboard/students/edit/:id', UpdateStudentsPost)

module.exports = router