const { groupingArtistMusic, groupingGenreMusic, groupingDurationRandomSong} = require('../helper/index')

const songsList = [
    {
        title: "Yesterday",
        duration: "20:20",
        genre: "Pop",
        artist: 'Dayat'
    },
    {
        title: "Yesterday",
        duration: "20:20",
        genre: "Rock",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration: "30:20",
        genre: "Pop",
        artist: 'Dayat'
    },
    {
        title: "Yesterday",
        duration: "01:20:20",
        genre: "Rock",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration: "05:20",
        genre: "Jazz",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration: "01:20",
        genre: "Jazz",
        artist: 'Dayat1'
    }
]
class SongController {
    static async getMusicGenre(req, res, next) {
        try {
            const musicByGenre = await groupingGenreMusic(songsList)
            res.status(200).json({musicByGenre})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getMusicArtist(req,res,next){
        try {
            const musicByArtist = await groupingArtistMusic(songsList)
            res.status(200).json({musicByArtist})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getMusicRandom(req,res,next){
        try {
            const musicByRandom = await groupingDurationRandomSong(songsList)
            res.status(200).json({musicByRandom})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = { SongController }