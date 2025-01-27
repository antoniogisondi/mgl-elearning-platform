const Course = require('../models/Course')

exports.ViewCourses = async (req,res) => {
    try {
        const courses = await Course.find()
        res.render('admin/courses/view-courses', {courses})
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore nel recuperare i corsi");
    }
}

exports.CreateCourses = async (req, res) => {
    const {nome_corso, programma_corso, categoria_corso, numero_autorizzazione, durata} = req.body
    try {
        const newCourse = new Course({
            nome_corso,
            programma_corso,
            categoria_corso,
            numero_autorizzazione,
            durata
        })
        await newCourse.save()
        res.redirect('/admin/dashboard/courses')
    } catch (error) {
        console.error(error)
    }
}

exports.UpdateCoursesGet = async (req,res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).send("Corso non trovato");
        }
        res.render('admin/courses/edit-courses', {course})
    } catch (error) {
        console.error(error)
        res.status(500).send('Errore nel recupero del corso')
    }
}

exports.UpdateCoursesPost = async (req,res) => {
    const { nome_corso, categoria_corso, numero_autorizzazione, durata, programma_corso } = req.body;
    try {
        // Aggiorna il corso nel database
        await Course.findByIdAndUpdate(req.params.id, {
        nome_corso,
        categoria_corso,
        numero_autorizzazione,
        durata,
        programma_corso, // Questo aggiorna il programma
        });

        // Reindirizza alla lista dei corsi
        res.redirect("/admin/dashboard/courses");
    } catch (err) {
        console.error("Errore nell'aggiornare il corso:", err);
        res.status(500).send("Errore nell'aggiornare il corso");
    }
}