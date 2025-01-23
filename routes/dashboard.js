const express = require('express')
const router = express.Router()

router.get('/dashboard', (req,res) => {
    res.render('admin/dashboard', {user: req.user})
})

module.exports = router