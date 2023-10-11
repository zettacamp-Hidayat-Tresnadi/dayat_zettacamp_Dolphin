const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name must be required'],
        unique:true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
}, {
    timestamps: true
})

const playlists = mongoose.model('Playlist', playlistSchema)

module.exports = playlists
