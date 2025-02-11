const jwt = require('jsonwebtoken')
const Student = require('../models/Student')

const authStudents = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Estrai il token dalla richiesta

    if (!token) {
        return res.status(401).json({ message: "Token mancante, accesso negato" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica il token
        const student = await Student.findById(decoded.id).select("-password"); // Recupera lo studente dal DB senza la password

        if (!student) {
            return res.status(401).json({ message: "Utente non trovato" });
        }

        req.student = student; // Salva lo studente in `req.student`
        next();
    } catch (err) {
        console.error("Errore autenticazione:", err);
        return res.status(401).json({ message: "Token non valido" });
    }
};

module.exports = authStudents