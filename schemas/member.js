const mongoose = require('mongoose')
const {Schema} = mongoose

const member = new Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    dateOfJoining:{
        type:Date,
        default: Date.now
    },
    password:{
        type:String
    },
})

module.exports = mongoose.model('members', member)