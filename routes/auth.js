const express = require('express')
const {register, login} = require('../controllers/Auth')
const router = express.Router()

router.get('/register', (req,res) => {
    res.render('auth/register')
})
router.post('/register', register)

router.get('/login', (req,res) => {
    res.render('auth/login')
})
router.post('/login', login)

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
        console.error(err);
        return res.status(500).send("Errore durante il logout");
        }
        res.redirect("/");
    });
});

module.exports = router