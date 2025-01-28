const express = require('express')
const router = express.Router()
const {ViewCourses, CreateCourses, UpdateCoursesGet, UpdateCoursesPost, DeleteCourses} = require('../controllers/CourseController')

router.get('/dashboard/courses', ViewCourses)

router.get('/dashboard/courses/create', (req,res) => {
    res.render('admin/courses/create-courses')
})

router.post('/dashboard/courses/create', CreateCourses)

router.get('/dashboard/courses/edit/:id', UpdateCoursesGet)
router.post('/dashboard/courses/edit/:id', UpdateCoursesPost)

router.delete('/dashboard/courses/delete/:id', DeleteCourses)

module.exports = router