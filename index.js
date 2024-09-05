require('dotenv').config()
const connect = require('./db')
const express = require("express");
const cors = require('cors')
const app = express()
app.use(express.json())
connect();
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/books/', require('./routes/books'))
app.use('/', (req, res)=>{
    res.send("Hello World")
})


app.listen(5000, ()=>{
    console.log("Listening on port", 5000)
})