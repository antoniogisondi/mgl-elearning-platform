const express = require('express')
const router = express.Router()
const {ViewStudents, CreateStudents, DetailsStudents, UpdateStudentsGet, UpdateStudentsPost, AssignCoursesGet, AssignCoursesPost, DeleteStudents} = require('../controllers/StudentController')

router.get('/dashboard/students', ViewStudents)

router.get('/dashboard/students/create', (req,res) => {
    res.render('admin/students/create-students')
})
router.post('/dashboard/students/create', CreateStudents)

router.get('/dashboard/students/details/:id', DetailsStudents)

router.get('/dashboard/students/edit/:id', UpdateStudentsGet)
router.post('/dashboard/students/edit/:id', UpdateStudentsPost)

router.get('/dashboard/students/assign/:id', AssignCoursesGet)
router.post('/dashboard/students/assign/:id', AssignCoursesPost)

router.delete('/dashboard/students/delete/:id', DeleteStudents)


module.exports = router