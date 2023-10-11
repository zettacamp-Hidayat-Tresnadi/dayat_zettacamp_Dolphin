const Song = require('../model/songSchema.js')
const Playlist = require('../model/playlistSchema.js')
const { generateRandomPlaylist } = require('../helper/index.js')
const moment = require('moment')
class SongController {
    static async createSong(inputSong) {
        try {
            const { title, duration, artist, genre } = inputSong

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
    static async getSong(idSong) {
        try {
            const { _id } = idSong
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
    static async updateSong(songId, songInput) {
        try {
            const { _id } = songId
            const { title, duration, genre, artist } = songInput
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
    static async groupedByGenre() {
        try {
            const groupedSongs = await Song.aggregate([
                {
                    $group: {
                        _id: "$genre",
                        songs: {
                            $push: {
                                _id: "$_id",
                                title: "$title",
                                artist: "$artist",
                                duration: "$duration",
                                genre:"$genre"
                                // Add other song fields as needed
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        genre: "$_id",
                        songs: 1
                    }
                },
                {
                    $sort: {
                        genre: 1
                    },
                }
            ]);

            return groupedSongs;
        } catch (error) {
            console.log(error)
        }
    }
    static async groupedByArtist() {
        try {
            const groupedSongs = await Song.aggregate([
                {
                    $group: {
                        _id: "$artist",
                        songs: {
                            $push: {
                                _id: "$_id",
                                title: "$title",
                                artist: "$artist",
                                duration: "$duration"
                                // Add other song fields as needed
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        artist: "$_id",
                        songs: 1
                    }
                },
                {
                    $sort: {
                        artist: 1
                    },
                }
            ]);
            // let timeNow = moment();
            // let dayat = groupedSongs.map((songs) => {
            //   let dayat2 = songs.songs.reduce((acc, song) => {
            //     const [minutes, seconds] = song.duration.split(':').map(Number);
            //     return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            //   }, "00:00");

            //   const [minutes, seconds] = dayat2.split(':').map(Number);
            //   let timeEnding = moment(timeNow).add({ minutes, seconds });

            //   songs.start_time = timeNow.locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
            //   songs.end_time = timeEnding.locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
            //   timeNow = moment(timeEnding);
            //   return songs
            // })
            return groupedSongs;
        } catch (error) {
            console.log(error)
        }
    }
    static async getRandomSongs(limitTime) {
        try {
            if (!limitTime) {
                limitTime = 3600
            }
            const startTime = moment().locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
            let songs = await Song.find({})
            let randomSongs = generateRandomPlaylist(songs, limitTime)
            let objectMusic = {}
            objectMusic.songs = randomSongs
            objectMusic.start_time = startTime
            const totalDuration = randomSongs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, "00:00");

            // Format the total duration as a string (e.g., "hh:mm:ss")
            const [minutes, seconds] = totalDuration.split(':').map(Number);
            let timeEnding = moment().add({ m: minutes, s: seconds }).locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
            objectMusic.end_time = timeEnding
            return objectMusic
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { SongController }