const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    nome_corso: { type: String, required: true, maxlength: 255 },
    programma_corso: [
        {
            modulo: { type: String, required: true },
            descrizione: { type: String, required: true }, 
            durata: { type: Number, required: true},
        },
    ],
    categoria_corso: { type: String, required: true, maxlength: 255 },
    numero_autorizzazione: { type: String, unique: true },
    durata: { type: Number, required:true},
    assignedTo : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    data_richiesta: {type: Date, default: Date.now,},
    status: { type: String, enum: ['Richiesto', 'Attivo', 'Completato'], default: 'Richiesto' },
})

module.exports = mongoose.model('Course', CourseSchema)