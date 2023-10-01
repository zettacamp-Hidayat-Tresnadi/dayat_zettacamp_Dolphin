const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'The title is required']
    },
    price: {
        type: Number,
        required: [true,'The price is required']
    },
    taxPercentage: {
        type: Number,
        required: [true,'The tax percentage is required']
    },
    discountPercentage: {
        type: Number,
        required: [true,'The discount percentage is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    stock: {
        type: Number,
        required: [true,'The stock is required']
    },
    genre: {
        type: String,
        required: [true,'The genre is required']
    },
    isDiscount:{
        type:Boolean,
        default:true
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
