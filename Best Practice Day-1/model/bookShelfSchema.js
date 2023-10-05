const mongoose = require('mongoose')

const bookshelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of bookshelf must be filled'],
        unique: true
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
}, {
    timestamps: true
})

const bookshelf = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = bookshelf
