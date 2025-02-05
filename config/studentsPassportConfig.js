const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/Student'); // Modello degli studenti
const bcrypt = require('bcryptjs');

// Strategia di autenticazione per gli studenti
passport.use(new LocalStrategy(
    { usernameField: 'username' }, // Email come campo username
    async (username, password, done) => {
        try {
            const student = await Student.findOne({ username });
            if (!student) {
                return done(null, false, { message: 'Studente non trovato' });
            }
            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                return done(null, false, { message: 'Password errata' });
            }
            return done(null, student);
        } catch (error) {
            return done(error);
        }
    }
));

// Serializza lo studente
passport.serializeUser((student, done) => {
    console.log("Serializzando studente:", student.id);
    done(null, student.id);
});

// Deserializza lo studente
passport.deserializeUser(async (id, done) => {
    try {
        const student = await Student.findById(id);
        console.log("Deserializzando studente:", student);
        done(null, student);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
