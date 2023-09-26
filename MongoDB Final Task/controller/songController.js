const Song = require('../model/songSchema.js')
const Playlist = require('../model/playlistSchema.js')
class SongController {
    static async createSong(req, res, next) {
        try {
            const title = req.body.title
            const duration = req.body.duration
            const artist = req.body.artist
            const genre = req.body.genre

            let newSong = await Song.create({
                title,
                duration,
                artist,
                genre,
            })
            res.status(201).json({ newSong })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getAllSong(req, res, next) {
        try {
            let songs = await Song.find({})
            res.status(200).json({ songs })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteSong(req, res, next) {
        try {
            const { songId } = req.params
            let chosenSong = await Song.findOne({
                _id: songId
            })

            await Playlist.updateOne({
                _id: chosenSong.playlist
            }, {
                '$pull': { 'songs': songId }
            })

            await Song.deleteOne({
                _id: songId
            })

            res.status(200).json({ message: 'The song has been deleted' })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async updateSong(req, res, next) {
        try {
            const title = req.body.title
            const duration = req.body.duration
            const artist = req.body.artist
            const genre = req.body.genre
            const { songId } = req.params

            await Song.updateOne({ _id: songId }, {
                title,
                duration,
                artist,
                genre,
            })
            res.status(201).json({ message: 'The song has been updated' })
        } catch (error) {
            console.log(error)
            next(error)
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