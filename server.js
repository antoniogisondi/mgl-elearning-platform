const express = require('express')
const session = require('express-session')
const passportAdmin = require('./config/passportConfig')
const flash = require('connect-flash')
const cors = require('cors')
const methodOverride = require('method-override')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const {ensureAuthenticated} = require('./middleware/authMiddleware')
dotenv.config()

const port = process.env.PORT

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: "Content-Type,Authorization",
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, secure:false}
}))
app.use(passportAdmin.initialize());
app.use(passportAdmin.session());

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error"); 
    next();
})

const authRoutes = require('./routes/auth')
const dashboard = require('./routes/dashboard')
const studentsRoutes = require('./routes/students')
const api = require('./routes/api')

app.use('/', authRoutes)
app.use('/admin', ensureAuthenticated, dashboard)
app.use('/admin', ensureAuthenticated, studentsRoutes)
app.use('/api', api)

app.use('/', (req,res) => {
    res.render('homepage')
})

app.listen(port, () => console.log(`Server Admin avviato su http://localhost:${port}`));

connectDB()

