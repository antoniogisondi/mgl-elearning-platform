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
          type: mongoose.Schema.Types.ObjectId, // Deve essere ObjectId
          ref: "Course", // Deve riferirsi al modello "Course"
        },
    ],
})

// StudentSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next()
//     }

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

module.exports = mongoose.model('Student', StudentSchema)