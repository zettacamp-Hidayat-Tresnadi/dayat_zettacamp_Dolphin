const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'The name is required']
    }
}, {
    timestamps: true
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author
