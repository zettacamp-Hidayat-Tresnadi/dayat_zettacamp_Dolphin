const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'The title is required']
    },
    duration: {
        type: String,
        required: [true,'The duration is required']
    },
    artist: {
        type: String,
        required: [true,'The artist is required']
    },
    genre: {
        type: String,
        required: [true,'The genre is required']
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlists'
    }
}, {
    timestamps: true
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song
