const { gql, ApolloError } = require('apollo-server-express')
const { token } = require('../helper/index')
const UserController = require('../controller/userController')
const { SongController } = require('../controller/songController')
const { PlayListController } = require('../controller/playlistController')
const moment = require('moment')
const Playlist = require('../model/playlistSchema')
const Song = require('../model/songSchema')
const fetch = require('../node_modules/node-fetch')
// const { playList, songLoader } = require('../loader/dataLoader')


const TypeDefs = gql`
    input userInput{
        username:String
        password:String
        firstName:String
        lastName:String
    }
    input inputUserId{
        _id:ID
    }
    type User {
        _id:ID
        username:String
        password:String
        firstName:String
        lastName:String
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
        totalDurasi:String
        totalTambahDurasi:String
        totalDuration:String
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
        totalDuration:String
        predictEndSong:String
    }
    type ArtistPlaylists {
        artist: String
        playlists: [Playlist]
    }
    input SongWebhook {
        song_name:String
        genre:String
        duration:String
        album:String
        artist:String
    }
    input newPlaylist {
        playlist_name:String
        description:String
        song_list:[SongWebhook]
        creator:String
        total_favorite:String
    }
    type SongWebhooks {
        song_name:String
        genre:String
        duration:String
        album:String
        artist:String
    }
    type newPlaylists {
        playlist_name:String
        description:String
        song_list:[SongWebhooks]
        creator:String
        total_favorite:String
    }
    type Query {
        getUsers:[User]
        getUser(_id:inputUserId):User
        login(userForm:userInput):String
        getSongs:[Song]
        getSong(_id:inputSongId):Song
        getPlaylists:[Playlist]
        getPlaylist(_id:inputplayListId):Playlist
        playlistsByArtist:[ArtistPlaylists]
    }
    type Mutation{
        register(userForm:userInput):User
        createSong(songForm:songInput):Song
        deleteSong(_id:inputSongId):Message
        updateSong(_id:inputSongId,songForm:songInput):Message
        createPlayList(playListForm:playlistInput):Playlist
        deletePlaylist(_id:inputplayListId):Message
        updatePlaylist(_id:inputplayListId,songs:[String],addSongs:Boolean):Message
        postingWebHook(data:[newPlaylist]):[newPlaylists]
    }
`
const Resolvers =
{
    Query: {
        playlistsByArtist: async () => {
            // Find all playlists
            const playlists = await Playlist.find({}).populate('songs');
            // Create a map to group playlists by artist
            const artistPlaylistsMap = new Map();
      
            // Iterate through each playlist and its songs
            playlists.forEach((playlist) => {
              playlist.songs.forEach((song) => {
                const artist = song.artist;
      
                // Check if the artist is null or undefined and handle it
                if (artist) {
                  // Check if the artist already has a playlist, if not, create one
                  if (!artistPlaylistsMap.has(artist)) {
                    artistPlaylistsMap.set(artist, {
                      artist,
                      playlists: [],
                    });
                  }
      
                  // Add the playlist to the artist's playlists
                  artistPlaylistsMap.get(artist).playlists.push(playlist);
                }
              });
            });
      
            // Convert the map values (grouped playlists) to an array
            const artistPlaylists = Array.from(artistPlaylistsMap.values());
      
            return artistPlaylists;
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
    Song: {
        playlist: async (parent, _, { playList }) => {
            let chosenPlaylist = await playList.load(parent.playlist)
            return chosenPlaylist
        },
        totalDurasi: (parent, __, context) => {
            return context.totalDurasi = parent.title
        },
        totalTambahDurasi: (parent, _, { totalDurasi }) => {
            return `${totalDurasi} ini dari this`
        }
    },
    Playlist: {
        songs: async (parent, _, context) => {
            let chosenSongs = await context.songLoader.loadMany(parent.songs)
            // let totalDuration = moment("00:00", "mm:ss").format("mm:ss")
            // chosenSongs.forEach((song, index) => {
            //     song['totalDuration'] = moment(totalDuration, "mm:ss").add({ m: 2, s: 5 }).format("mm:ss")
            //     totalDuration = song.totalDuration
            //     if (index + 1 < chosenSongs.length) {
            //         if (chosenSongs[index]['playlist'].toString() !== chosenSongs[index + 1]['playlist'].toString()) {
            //             totalDuration = moment("00:00", "mm:ss").format("mm:ss")
            //         }
            //     }
            // })
            // context['dayat']=3
            // context['totalDuration']=chosenSongs[chosenSongs.length-1]['totalDuration']
            return chosenSongs
        },
        totalDuration: async (parent, _, context) => {
            // Calculate the total duration for the playlist
            const playlistId = parent.id; // Assuming you have an ID field in the Playlist type
            const songs = await context.songLoader.loadMany(parent.songs);

            // Calculate the total duration by summing up the durations of all songs
            const totalDuration = songs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, moment("00:00", "mm:ss").format("mm:ss"));

            // Format the total duration as a string (e.g., "hh:mm:ss")
            return totalDuration
        },
        predictEndSong: async (parent, _, context) => {
            // Calculate the total duration for the playlist
            const playlistId = parent.id; // Assuming you have an ID field in the Playlist type
            const songs = await context.songLoader.loadMany(parent.songs);

            // Calculate the total duration by summing up the durations of all songs
            const totalDuration = songs.reduce((acc, song) => {
                const [minutes, seconds] = song.duration.split(':').map(Number);
                // const songDuration = moment.duration({ minutes, seconds }); // Assuming duration is stored as a string in your data
                return moment(acc, "mm:ss").add({ m: minutes, s: seconds }).format("mm:ss");
            }, "00:00");

            // Format the total duration as a string (e.g., "hh:mm:ss")
            const [minutes, seconds] = totalDuration.split(':').map(Number);
            let timeEnding = moment().add({ m: minutes, s: seconds }).format("HH:mm:ss")
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
        },
        postingWebHook:async(_,args)=>{
            try {
                const {data}=args
                const response = await fetch('https://webhook.site/b393bd30-ab25-400c-97fb-ef6c20c4da42', {
                    method: 'POST', 
                    body: JSON.stringify(data)
                })
                const inputPlaylists = await response.json()
                return inputPlaylists
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    }
}

module.exports = { TypeDefs, Resolvers }