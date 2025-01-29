const express = require('express')
const router = express.Router()
const {StudentsLogin, AuthStudents} = require('../controllers/StudentController')

// API FRONTOFFICE

router.post('/login', StudentsLogin)

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        req.session.destroy((error) => {
            if (error) return res.status(500).json({message: 'Errore nel logout'})
            res.clearCookie('connect.sid')
            return res.status(200).json({message: 'Logout effettuato'})
        })
    });
});

router.get('/auth', AuthStudents)

module.exports = router