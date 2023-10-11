const { gql, ApolloError } = require('apollo-server-express')
const { token } = require('../helper/index')
const UserController = require('../controller/userController')
const { SongController } = require('../controller/songController')
const { PlayListController } = require('../controller/playlistController')
const moment = require('moment')
const { generateRandomPlaylist } = require('../helper/index')
// const { playList, songLoader } = require('../loader/dataLoader')


const TypeDefs = gql`
    input userInput{
        username:String
        password:String
        first_name:String
        last_name:String
    }
    input inputUserId{
        _id:ID
    }
    type User {
        _id:ID
        username:String
        password:String
        first_name:String
        last_name:String
    }
    input songInput{
        title:String
        duration:String
        artist:String
        genre:String
    }
    input inputSongId{
        _id:ID
    }
    type Song {
        _id:ID
        title:String
        duration:String
        artist:String
        genre:String
        playlist:Playlist
        start_time:String
        end_time:String
    }
    type Message{
        message:String
    }
    input playlistInput{
        name:String
        songs:[String]
    }
    input inputplayListId{
        _id:ID
    }
    type Playlist {
        _id:ID
        name:String
        songs:[Song]
        start_time:String
        end_time:String
    }
    type GenrePlaylists {
        genre: String
        songs: [Song]
        start_time:String
        end_time:String
    }
    type ArtistPlaylists{
        artist: String
        songs: [Song]
        start_time:String
        end_time:String
    }
    type RandomSong{
        songs: [Song]
        start_time:String
        end_time:String
    }
    type Query {
        getUsers:[User]
        getUser(_id:inputUserId):User
        login(userForm:userInput):String
        getSongs:[Song]
        getSong(_id:inputSongId):Song
        getPlaylists:[Playlist]
        getPlaylist(_id:inputplayListId):Playlist
        playlistsByGenre:[GenrePlaylists]
        playlistsByArtist:[ArtistPlaylists]
        getRandomSongs(limitTime:Int):RandomSong
        getAllPlaylistsWithDuration:[Playlist]
        getOnePlaylistWithDuration(_id:inputplayListId):Playlist
        getRandomPlaylists:[Playlist]
    }
    type Mutation{
        register(userForm:userInput):User
        createSong(songForm:songInput):Song
        deleteSong(_id:inputSongId):Message
        updateSong(_id:inputSongId,songForm:songInput):Message
        createPlayList(playListForm:playlistInput):Playlist
        deletePlaylist(_id:inputplayListId):Message
        updatePlaylist(_id:inputplayListId,songs:[String],addSongs:Boolean):Message
    }
`
const Resolvers =
{
    Query: {
        playlistsByGenre: async (_,__,{user}) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                let groupedByGenre = await SongController.groupedByGenre()
                return groupedByGenre
            } catch (error) {
                throw new ApolloError(error.message)
            }

        },
        playlistsByArtist: async (_,__,{user}) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                let groupedByArtist = await SongController.groupedByArtist()
                return groupedByArtist
            } catch (error) {
                throw new ApolloError(error.message)
            }

        },
        getRandomSongs: async (_, args,{user}) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { limitTime } = args
                let randomSongs = await SongController.getRandomSongs(limitTime)
                return randomSongs
            }
            catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getAllPlaylistsWithDuration: async (_, __, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const playlists = await PlayListController.getAllPlaylist()
                return playlists
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getOnePlaylistWithDuration: async (_, args, { user, playList }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                const chosenPlaylist = await playList.load(_id._id)
                return chosenPlaylist
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getRandomPlaylists: async (_, __, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const playlists = await PlayListController.getAllPlaylist()
                const randomPlaylists = generateRandomPlaylist(playlists)
                return randomPlaylists
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getUsers: async (_, __, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const users = await UserController.getAllUsers()
                return users
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getUser: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                const chosenUser = await UserController.getUserById(_id)
                return chosenUser
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        login: async (_, args, { user }) => {
            try {
                const { userForm } = args
                const user = await UserController.login(userForm)
                return user
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getSongs: async (_, __, { user, songLoader }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const songs = await SongController.getAllSong()
                return songs

            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getSong: async (_, args, { user, songLoader }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                const song = await songLoader.load(_id._id)
                return song
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getPlaylists: async (_, __, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const playlists = await PlayListController.getAllPlaylist()
                return playlists
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getPlaylist: async (_, args, { user, playList }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                const chosenPlaylist = await playList.load(_id._id)
                return chosenPlaylist
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    },
    ArtistPlaylists: {
        start_time: async () => {
            return moment().locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a")
        },
        end_time: async (parent, _) => {
            // Calculate the total duration by summing up the durations of all songs
            const totalDuration = parent.songs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, "00:00");

            // Format the total duration as a string (e.g., "hh:mm:ss")
            const [minutes, seconds] = totalDuration.split(':').map(Number);
            let timeEnding = moment().add({ m: minutes, s: seconds }).locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a")
            return timeEnding
        },
    },
    GenrePlaylists: {
        start_time: async () => {
            return moment().locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a")
        },
        end_time: async (parent, _, context) => {
            // Calculate the total duration by summing up the durations of all songs
            const totalDuration = parent.songs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, "00:00");

            // Format the total duration as a string (e.g., "hh:mm:ss")
            const [minutes, seconds] = totalDuration.split(':').map(Number);
            let timeEnding = moment().add({ m: minutes, s: seconds }).locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a")
            return timeEnding
        },
    },
    Song: {
        playlist: async (parent, _, { playList }) => {
            let chosenPlaylist = await playList.load(parent.playlist)
            return chosenPlaylist
        }
    },
    Playlist: {
        songs: async (parent, _, context) => {
            let chosenSongs = await context.songLoader.loadMany(parent.songs)
            return chosenSongs
        },
        start_time: async () => {
            return moment().locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
        },
        end_time: async (parent, _, context) => {
            const songs = await context.songLoader.loadMany(parent.songs);

            // Calculate the total duration by summing up the durations of all songs
            const totalDuration = songs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, "00:00");

            // Format the total duration as a string (e.g., "hh:mm:ss")
            const [minutes, seconds] = totalDuration.split(':').map(Number);
            let timeEnding = moment().add({ m: minutes, s: seconds }).locale('id').format("dddd Do MMMM YYYY [pukul] h:mm:ss a");
            return timeEnding
        },
    },
    Mutation: {
        register: async (_, args) => {
            try {
                const { userForm } = args
                let newUser = await UserController.createUser(userForm)
                return newUser
            } catch (error) {
                throw new Error(error);
            }
        },
        createSong: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { songForm } = args
                let newSong = await SongController.createSong(songForm)
                return newSong
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        deleteSong: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                const message = await SongController.deleteSong(_id)
                return message
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        updateSong: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id, songForm } = args
                const message = await SongController.updateSong(_id, songForm)
                return message
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        createPlayList: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { playListForm } = args
                let newSong = await PlayListController.createPlayList(playListForm)
                return newSong
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        deletePlaylist: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id } = args
                let message = await PlayListController.deletePlaylistById(_id)
                return message
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        updatePlaylist: async (_, args, { user }) => {
            try {
                if (user === 'Invalid Token') {
                    throw { message: 'Invalid Token' }
                }
                else if (user === 'Token empty') {
                    throw { message: 'please login first' }
                }
                else if (user === 'Relogin') {
                    throw { message: 'Please relogin' }
                }
                const { _id, songs, addSongs } = args
                let message = await PlayListController.updatePlaylist(_id, songs, addSongs)
                return message
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    }
}

module.exports = { TypeDefs, Resolvers }