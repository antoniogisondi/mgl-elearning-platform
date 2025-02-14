const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const StudentSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    cognome: { type: String, required: true},
    codice_fiscale: {type: String, required:true, unique:true},
    email: {type: String, required:true, unique:true},
    username: {type:String, unique: true},
    password: {type:String, unique:true},
    plainPassword : {type:String},
    assignedCourses: [
        {
          nome_corso: { type: String, required: true },
          categoria_corso: { type: String },
          descrizione: { type: String },
          durata: { type: String },
          numero_autorizzazione: {type: String, unique: true}
        },
    ],
})

module.exports = mongoose.model('Student', StudentSchema)