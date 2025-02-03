const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Student = require('../models/Student')
const passportStudent = require('passport')

passportStudent.use(
    "student",
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

passportStudent.serializeUser((student, done) => {
    console.log("Serializzazione:", student._id);
    done(null, student._id);
});

passportStudent.deserializeUser(async (id, done) => {
    try {
        const student = await Student.findById(id);
        if (!student) {
            return done(null, false);
        }
        console.log("Deserializzazione:", student);
        done(null, student);
    } catch (err) {
        done(err);
    }
});

module.exports = passportStudent