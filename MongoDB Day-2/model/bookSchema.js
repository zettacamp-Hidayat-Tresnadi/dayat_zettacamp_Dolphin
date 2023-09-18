const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    terms: {
        total_terms: {
            type: Number
        },
        list_terms: {
            type: Array,
            items: {
                type: Object
            }
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
