const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author
