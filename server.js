const express = require('express')
const session = require('express-session')
const passport = require('./config/passportConfig')
const flash = require('connect-flash')
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const {ensureAuthenticated} = require('./middleware/authMiddleware')
const port = process.env.PORT || 5000
dotenv.config()

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth')
const dashboard = require('./routes/dashboard')
const coursesRoutes = require('./routes/courses')
const studentsRoutes = require('./routes/students')

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error"); 
    next();
})

app.use('/', authRoutes)
app.use('/admin', ensureAuthenticated, dashboard)
app.use('/admin', ensureAuthenticated, coursesRoutes)
app.use('/admin', ensureAuthenticated, studentsRoutes)

app.use('/', (req,res) => {
    res.render('homepage')
})


app.listen(port, () => console.log(`http://localhost:${port}`))
connectDB()