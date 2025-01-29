const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Student = require('../models/Student')

module.exports = (passport) => {
    passport.use(
        "student",
        new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
        try {
        const student = await Student.findOne({ username });
        if (!student) {
            console.log("Utente non trovato");
            return done(null, false, { message: "Utente non trovato" });
        }
    
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            console.log("Password errata");
            return done(null, false, { message: "Password errata" });
        }
    
        console.log("Login riuscito:", student);
        return done(null, student);
        } catch (err) {
        console.error("Errore nella strategia Passport:", err);
        return done(err);
        }
    })
    );

    passport.serializeUser((student, done) => {
        console.log("Serializing user:", student._id);
        done(null, student._id);
    });
    
    passport.deserializeUser(async (id, done) => {
    try {
        const student = await Student.findById(id);
        if (!student) {
        console.log("Utente non trovato nella deserializzazione");
        return done(null, false);
        }
        console.log("Deserializing user:", student);
        done(null, student);
    } catch (err) {
        console.error("Errore nella deserializzazione:", err);
        done(err, null);
    }
    });
}