const Playlist = require('../model/playlistSchema')
const Song = require('../model/songSchema')
class PlayListController {
    static async createPlayList(playlistInput) {
        try {
            const { name, songs } = playlistInput

            // 1. cek lagu yang mau di add ke playlist baru
            // apakah dia udah ada di playlist lain atau belum
            // kalau udah ada, nanti playlist lama bakal ilangin lagu itu dan bakal ke add di playlist baru
            // bgtu juga song yang punya playlist Id akan berganti playlist id nya

            let playlist = await Playlist.find({
                songs: {
                    $in: songs
                },
            })
            if (playlist.length > 0) {
                await Playlist.updateOne({ _id: playlist[0]._id }, {
                    '$pull': {
                        'songs': {
                            $in: songs
                        }
                    }
                })
            }

            let newPlayList = await Playlist.create({
                name,
                songs
            })
            await Song.updateMany(
                { _id: { $in: songs } }, // Match songs with IDs in the 'songs' array
                { $set: { playlist: newPlayList._id } } // Update the 'playlist' field
            );
            return newPlayList

        } catch (error) {
            throw error
        }
    }
    static async getAllPlaylist() {
        try {
            let playlists = await Playlist.find({})
            return playlists
        } catch (error) {
            throw error
        }
    }
    static async getPlaylistById(idPlayList) {
        try {
            const { _id } = idPlayList
            let playlists = await Playlist.find({ _id: _id })
            return playlists
        } catch (error) {
            throw error
        }
    }
    static async deletePlaylistById(playlistId) {
        try {
            const { _id } = playlistId
            console.log(_id,'wkwkwk')
            let chosenPlayList = await Playlist.findOne({
                _id: _id
            })
            await Song.updateMany(
                { _id: { $in: chosenPlayList.songs } }, // Match songs with IDs in the 'songs' array
                { $set: { playlist: null } } // Update the 'playlist' field
            )
            await Playlist.deleteOne({ _id: _id })
            return { message: 'Play list has been deleted' }
        } catch (error) {
            throw error
        }
    }
    static async updatePlaylist(_id,songs,addSongs) {
        try {
            if (!addSongs) {
                await Playlist.updateOne({ _id: _id }, {
                    '$pull': {
                        'songs': {
                            $in: songs
                        }
                    }
                })
                await Song.updateMany(
                    { _id: { $in: songs } }, // Match songs with IDs in the 'songs' array
                    { $set: { playlist: null } } // Update the 'playlist' field
                )
            }
            else {
                for (const songId of songs) {
                    await Playlist.updateOne(
                        { _id: _id },
                        { $addToSet: { songs: songId } }
                    )
                    let chosenSong = await Song.findOne({
                        _id: songId
                    })
                    await Playlist.updateOne({
                        _id: chosenSong.playlist
                    }, {
                        '$pull': {
                            'songs': {
                                $in: chosenSong._id
                            }
                        }
                    })
                }
                await Song.updateMany(
                    { _id: { $in: songs } }, // Match songs with IDs in the 'songs' array
                    { $set: { playlist: _id } } // Update the 'playlist' field
                )
            }
            return { message: `play list has been updated` }

        } catch (error) {
            throw error
        }
    }
    static async getaggregate(req, res, next) {
        try {
            let { names } = req.query
            let { page, limit } = req.body
            if (!page) {
                page = 1
            }
            if (!limit) {
                limit = 3
            }
            let pipeline = [
                {
                    $lookup: {
                        from: 'songs',
                        localField: 'songs',
                        foreignField: '_id',
                        as: 'songs',
                    },
                },
                {
                    $unwind: {
                        path: '$songs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        song: {
                            $ifNull: ['$songs', {}], // If 'playlist' is null or missing, replace it with an empty object
                        },
                    },
                },
                {
                    $facet: {
                        playlists: [
                            {
                                $group: {
                                    _id: '$_id', // Group by playlist ID or any unique identifier
                                    name: { $first: '$name' },
                                    songs: {
                                        $push: {
                                            _id: '$song._id',
                                            title: '$song.title',
                                            duration: '$song.duration',
                                            artist: '$song.artist',
                                            genre: '$song.genre',
                                            createdAt: '$song.createdAt',
                                            updatedAt: '$song.updatedAt'
                                        }
                                    },
                                    genres: { $push: '$song.genre' }, // Collect 'genre' values in an array
                                    songCount: { $sum: 1 }, // Count the number of songs
                                },
                            },
                            {
                                $sort: {
                                    name: 1
                                }
                            },
                            {
                                $skip: (page - 1) * +limit,
                            },
                            {
                                $limit: +limit,
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    songs: 1,
                                    genres: 1,
                                    songCount: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$playlists' // Unwind the playlists array
                }
            ]
            if (names) {
                names = req.query.names.split(",")
                pipeline.unshift({
                    $match: {
                        name: {
                            $in: names
                        }
                    }
                })
            }

            let playlists = await Playlist.aggregate(pipeline)
            res.status(200).json(playlists)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = { PlayListController }