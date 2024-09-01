const mongoose = require('mongoose')
const connectDb = ()=>{
    mongoose.connect(process.env.srv)
    console.log("connected")
}
module.exports = connectDb