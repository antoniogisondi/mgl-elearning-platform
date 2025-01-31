const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passportAdmin = require('passport')

passportAdmin.use('admin', new LocalStrategy( {usernameField: "email"}, async (email, password, done) => {
        try {
            const user = await User.findOne({email})
            if (!user) {
                return done(null,false, {message: 'Email non registrata'})
            }

            const isMatch = bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: "Password errata" });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
)

// Serializza l'utente nella sessione
passportAdmin.serializeUser((user, done) => {
    done(null, user.id);
});

    // Deserializza l'utente dalla sessione
passportAdmin.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passportAdmin
