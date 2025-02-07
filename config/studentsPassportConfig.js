const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/Student'); // Modello degli studenti
const bcrypt = require('bcryptjs');

// Strategia di autenticazione per gli studenti
passport.use( "student",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
        try {
            const student = await Student.findOne({ username });
            if (!student) {
                return done(null, false, { message: "Studente non trovato" });
            }

            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                return done(null, false, { message: "Password errata" });
            }

            return done(null, student);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((student, done) => {
    done(null, student._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("ID deserializzato:", id); // Verifica che l'ID venga passato correttamente
        const student = await Student.findById(id); // Cerca lo studente nel database
        if (!student) {
            console.log("Studente non trovato durante la deserializzazione");
            return done(null, false);
        }
        console.log("Studente deserializzato:", student);
        done(null, student); // Imposta lo studente come `req.user`
    } catch (err) {
        console.error("Errore durante la deserializzazione:", err);
        done(err, null);
    }
});

module.exports = passport;
