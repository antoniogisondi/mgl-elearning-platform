const express = require('express')
const session = require('express-session')
const passport = require('./config/studentsPassportConfig')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const cors = require('cors')
const methodOverride = require('method-override')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
dotenv.config()

const port = process.env.PORT_API

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(cors({origin: process.env.FRONTEND_URL , methods: 'GET,POST,PUT,DELETE', credentials: true,}))

const studentSession = session({
    name: "student.sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false, // Deve essere true in produzione con HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 giorno
    },
});

app.use(studentSession)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

const api = require('./routes/api')

app.use('/api', api)

app.listen(port, () => console.log(`Server API avviato su http://localhost:${port}`));

connectDB()

