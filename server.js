const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
dotenv.config()

const app = express()

app.use('/', (req,res) => {
    res.send('Ciao')
})

app.listen(port, () => console.log(`http:localhost/${port}`))
connectDB()