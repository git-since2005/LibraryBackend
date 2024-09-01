const mongoose = require('mongoose')
const {Schema} = mongoose

const book = new Schema({
    name:{
        type: String,
        default:'Book'
    },
    borrower:{
        type:String,
        default:'null'
    }
})

module.exports = mongoose.model('books', book)