const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

passport.use(
    new LocalStrategy(
        {usernameField: "email"},
        async (email, password, done) => {
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
        }
    )
)

// Serializza l'utente nella sessione
passport.serializeUser((user, done) => {
    done(null, user.id);
});

  // Deserializza l'utente dalla sessione
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport