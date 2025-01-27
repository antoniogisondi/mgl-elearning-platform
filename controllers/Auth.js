const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')

exports.register = async (req,res) => {
    const {name,surname,email,password} = req.body

    try {
        console.log("Tentativo di registrazione per:", email);
        const userExists = await User.findOne({email})
        
        if (userExists) {
            return res.status(400).send("L'email è già registrata")
        }

        const newUser = new User({name, surname, email, password})
        await newUser.save()
        res.status(201)
        res.redirect('/dashboard')
    } catch (error) {
        res.status(500).send("Errore durante la registrazione");
    }
}

exports.login = (req,res,next) => {
    passport.authenticate("local", {
        successRedirect: "/admin/dashboard", // Reindirizza alla dashboard
        failureRedirect: "/login", // Reindirizza al login in caso di fallimento
        failureFlash: true, // Mostra messaggi di errore (se configurato)
    })(req, res, next);
}