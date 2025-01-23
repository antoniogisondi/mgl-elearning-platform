const express = require('express')
const session = require('express-session')
const passport = require('./config/passportConfig')
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

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth')
const dashboard = require('./routes/dashboard')

app.use('/', authRoutes)
app.use('/admin', ensureAuthenticated, dashboard)

app.use('/', (req,res) => {
    res.render('homepage')
})


app.listen(port, () => console.log(`http://localhost:${port}`))
connectDB()