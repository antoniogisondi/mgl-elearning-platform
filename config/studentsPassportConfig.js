const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Student = require('../models/Student')
const passportStudent = require('passport')

passportStudent.use("student", new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
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
        console.error("Errore durante l'autenticazione:", err);
        return done(err);
    }
    })
);

passportStudent.serializeUser((student, done) => {
    console.log("Serializing user ID:", student._id);
    done(null, student._id);
    });

passportStudent.deserializeUser(async (id, done) => {
    try {
        console.log("Deserializing user ID:", id);
        const student = await Student.findById(id);
        if (!student) {
        console.log("Utente non trovato durante la deserializzazione");
        return done(null, false);
        }
        console.log("Deserialized user:", student);
        done(null, student);
    }  catch (err) {
        console.error("Errore durante la deserializzazione:", err);
        done(err, null);
    }
});

module.exports = passportStudent