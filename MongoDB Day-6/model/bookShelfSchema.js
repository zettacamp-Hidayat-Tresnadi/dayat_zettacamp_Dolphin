const mongoose = require('mongoose')

const bookShelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name of bookshelf must be filled'],
        unique:true
    },
    books: [{_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }}],
    booksGenre:{
        genre:{
            type:Array
        }
    }
}, {
    timestamps: true
})

const bookShelf = mongoose.model('BookShelf', bookShelfSchema)

module.exports = bookShelf
