const Song = require('../model/songSchema.js')
const Playlist = require('../model/playlistSchema.js')
class SongController {
    static async createSong(inputSong) {
        try {
            const{title,duration,artist,genre}=inputSong

            let newSong = await Song.create({
                title,
                duration,
                artist,
                genre,
            })
            return newSong
        } catch (error) {
            throw error
        }
    }
    static async getAllSong() {
        try {
            let songs = await Song.find({})
            return songs
        } catch (error) {
            console.log(error)
        }
    }
    static async getSong(idSong){
        try {
            const {_id}=idSong
            let song = await Song.findOne({ _id: _id })
            return song
            
        } catch (error) {
            throw error
        }
    }
    static async deleteSong(songId) {
        try {
            const { _id } = songId
            let chosenSong = await Song.findOne({
                _id: _id
            })

            await Playlist.updateOne({
                _id: chosenSong.playlist
            }, {
                '$pull': { 'songs': _id }
            })

            await Song.deleteOne({
                _id: _id
            })

            return { message: 'The song has been deleted' }
        } catch (error) {
            throw error
        }
    }
    static async updateSong(songId,songInput) {
        try {
            const {_id}=songId
            const {title,duration,genre,artist}=songInput
            await Song.updateOne({ _id: _id }, {
                title,
                duration,
                artist,
                genre,
            })
            return { message: 'The song has been updated' }
        } catch (error) {
            throw error
        }
    }
    static async getaggregate(req, res, next) {
        try {
            let { genres } = req.query
            let { page, limit,limitSong } = req.body
            if (!page) {
                page = 1
            }
            if (!limit) {
                limit = 4
            }
            let pipeline = [{
                $lookup: {
                    from: 'playlists',
                    localField: 'playlist',
                    foreignField: '_id',
                    as: 'playlist',
                },

            },
            {
                $unwind: {
                    path: '$playlist',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                  playlist: {
                    $ifNull: ['$playlist', {}], // If 'playlist' is null or missing, replace it with an empty object
                  },
                },
            },
            {
                $group: {
                    _id: '$genre',
                    songs: { $push: '$$ROOT' }, // Collect all songs documents in an array
                },
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $facet: {
                    genres: [
                        {
                            $project: {
                                _id: 0, // Exclude _id
                                genre: '$_id', // Rename _id to genre
                                songs: {
                                    $slice: ['$songs', 0, +limitSong]
                                },
                            },
                        },
                        {
                            $skip: (page - 1) * +limit,
                        },
                        {
                            $limit: +limit,
                        },
                    ],
                },
            },
            {
                $unwind: '$genres',
            },
            {
                $project: {
                    genre: '$genres.genre',
                    songs: '$genres.songs',
                },
            }

            ]
            if (genres) {
                genres = req.query.genres.split(",")
                console.log(genres)
                pipeline.unshift({
                    $match: {
                        genre: {
                            $in: genres
                        }
                    }
                })
            }
            let playlists = await Song.aggregate(pipeline)
            res.status(200).json({ playlists })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = { SongController }