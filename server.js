const express = require('express')
const session = require('express-session')
const passportAdmin = require('./config/passportConfig')
const passportStudent = require('./config/studentsPassportConfig')
const flash = require('connect-flash')
const methodOverride = require('method-override')
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

const adminSession = session({
    name: 'admin.sid',
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, secure:false}
})

const studentSession = session({
    name: 'student.sid',
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, secure:false}
})

app.use(methodOverride('_method'))
app.use(cors({origin: process.env.FRONTEND_URL , methods: 'GET,POST,PUT,DELETE', credentials: true,}))
app.use(flash())

app.use(adminSession)
app.use(passportAdmin.initialize());
app.use(passportAdmin.session());

const authRoutes = require('./routes/auth')
const dashboard = require('./routes/dashboard')
const coursesRoutes = require('./routes/courses')
const studentsRoutes = require('./routes/students')
const api = require('./routes/api')

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
app.use('/api', studentSession, passportStudent.initialize(), passportStudent.session(), api)

app.use('/', (req,res) => {
    res.render('homepage')
})


app.listen(port, () => console.log(`http://localhost:${port}`))
connectDB()