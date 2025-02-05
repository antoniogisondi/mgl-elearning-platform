const express = require('express')
const router = express.Router()
const {StudentsLogin} = require('../controllers/StudentController')

// API FRONTOFFICE

router.post('/login', StudentsLogin)

router.get("/logout", async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((error) => {
            if (error) return res.status(500).json({ message: "Errore nel logout" });
            res.clearCookie("student.sid");
            return res.status(200).json({ message: "Logout effettuato" });
        });
    });
});

router.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(req.user);
    } else {
        return res.status(401).json({ message: "Non autenticato" });
    }
});

module.exports = router