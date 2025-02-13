const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

const coursesPath = path.join(__dirname, '../config/courses.json')

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
            password: await bcrypt.hash(password, 10),
            plainPassword: password
        })

        await newStudent.save()
        res.redirect('/admin/dashboard/students')
    } catch (error) {
        console.error("Errore nel creare il corsista:", error);
        res.status(500).send("Errore nel creare il corsista");
    }
}

exports.DetailsStudents = async (req,res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) {
            return res.status(404).send("Corsista non trovato");
        }

        const plainPassword = student.plainPassword
        student.plainPassword = undefined
        await student.save()
    
        res.render("admin/students/details-students", { student: {...student.toObject(), plainPassword} });
    } catch (err) {
        console.error("Errore nel recuperare i dettagli del corsista:", err);
        res.status(500).send("Errore nel recuperare i dettagli del corsista");
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

exports.AssignCoursesGet = async (req,res) => {
    try {
        const coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'))
        const student = await Student.findById(req.params.id)
        res.render('admin/students/assign-courses', {student, courses:coursesData})
    } catch (error) {
        console.error("Errore nel recuperare corsista o corsi:", error);
        res.status(500).send("Errore nel recuperare corsista o corsi");
    }
}

exports.AssignCoursesPost = async (req,res) => {
    const { courseId } = req.body
    try {
        const student = await Student.findById(req.params.id)
        if (!student) return res.status(404).send("Corsista non trovato");

        const course = await Course.findById(courseId)
        if (!course) return res.status(404).send("Corso non trovato");

        if (!student.assignedCourses.includes(courseId)) {
            student.assignedCourses.push(courseId)
            await student.save()
        }

        if (!course.assignedTo.includes(student._id)) {
            course.assignedTo.push(student._id)
            await course.save()
            
        }

        res.redirect("/admin/dashboard/students");
    } catch (error) {
        console.error("Errore nell'assegnare il corso:", error);
        res.status(500).send("Errore nell'assegnare il corso");
    }
}

exports.DeleteStudents = async (req,res) => {
    try {
        const studentId = req.params.id
        const student = await Student.findByIdAndDelete(studentId)

        if(!student){
            return res.status(404).send('Corsista non trovato')
        }

        await Course.updateMany(
            {assignedTo: studentId},
            {$pull: {assignedTo: studentId}}
        )

        res.redirect('/admin/dashboard/students')
    } catch (error) {
        console.error("Errore nella cancellazione del corsista:", error);
        res.status(500).send("Errore nella cancellazione del corsista");
    }
}

// API FRONTOFFICE

exports.StudentsLogin = async (req, res) => {
    const {username, password} = req.body

    try {
        const student = await Student.findOne({username})
        if (!student) {
            return res.status(401).json({message: 'Studente non trovato'})
        }

        const isMatch = await bcrypt.compare(password, student.password)
        if (!isMatch) {
            return res.status(401).json({message: 'Password errata'})
        }

        const token = generateToken(student.id)

        res.status(200).json({
            message: 'Login riuscito',
            token,
            student
        })
    } catch (error) {
        console.error("Errore durante il login:", error);
        res.status(500).json({ message: "Errore del server" });
    }
};
