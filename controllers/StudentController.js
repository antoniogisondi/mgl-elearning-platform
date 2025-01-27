const Student = require('../models/Student')

exports.ViewStudents = async (req,res) => {
    try {
        const students = await Student.find()
        res.render('admin/students/view-students', {students: students})
    } catch (error) {
        console.error("Errore nel cercare il corsista:", error);
        res.status(500).send("Errore nel cercare il corsista");
    }
}

exports.CreateStudents = async (req,res) => {
    const {nome, cognome, codice_fiscale, email} = req.body

    try {
        const username = `${nome.toLowerCase()}.${cognome.toLowerCase()}${Math.floor(Math.random() * 1000)}`
        const password = Math.random().toString(36).slice(-8)

        const newStudent = new Student({
            nome,
            cognome,
            codice_fiscale,
            email,
            username,
            password
        })

        await newStudent.save()
        res.redirect('/admin/dashboard/students')
    } catch (error) {
        console.error("Errore nel creare il corsista:", error);
        res.status(500).send("Errore nel creare il corsista");
    }
}

exports.UpdateStudentsGet = async (req,res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) {
            return res.status(404).send("Corsista non trovato");
        }
        res.render('admin/students/edit-students', {student})
    } catch (error) {
        console.error(error)
        res.status(500).send('Errore nel recupero del corso')
    }
}

exports.UpdateStudentsPost = async (req,res) => {
    const {nome, cognome, codice_fiscale, email} = req.body
    try {
        // Aggiorna il corso nel database
        await Student.findByIdAndUpdate(req.params.id, {
            nome,
            cognome,
            codice_fiscale,
            email, // Questo aggiorna il programma
        });

        // Reindirizza alla lista dei corsi
        res.redirect("/admin/dashboard/students");
    } catch (error) {
        console.error("Errore nell'aggiornare il corsista:", error);
        res.status(500).send("Errore nell'aggiornare il corsista");
    }
}