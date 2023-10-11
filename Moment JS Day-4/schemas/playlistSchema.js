const { gql, ApolloError } = require('apollo-server-express')
const { PlayListController } = require('../controller/playlistController')


const playListTypeDefs = gql`
    input playlistInput{
        name:String
        songs:[String]
    }
    input inputplayListId{
        _id:ID
    }
    type Playlist {
        name:String
        Songs:[Song]
    }
    type Query1 {
        getPlaylists:[Playlist]
        getPlaylist(_id:inputplayListId):Playlist
    }
    type Mutation1{
        createPlayList(playListForm:playlistInput):Playlist
    }
`
const playListResolvers =
{
    Query1: {
        getPlaylists: async (_, __, { user }) => {
            try {
                if (user==='Invalid Token'){
                    throw{message:'Invalid Token'}
                }
                else if(user ==='Token empty'){
                    throw{message:'please login first'}
                }
                else if(user==='Relogin'){
                    throw {message:'Please relogin'}
                }
                const playlists = await PlayListController.getAllPlaylist()
                return playlists
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getPlaylist: async (_, args,{user}) => {
            try {
                if (user==='Invalid Token'){
                    throw{message:'Invalid Token'}
                }
                else if(user ==='Token empty'){
                    throw{message:'please login first'}
                }
                else if(user==='Relogin'){
                    throw {message:'Please relogin'}
                }
                const { _id } = args
                const playlist = await PlayListController.getPlaylistById(_id)
                return playlist
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    },
    Mutation1: {
        createPlayList: async (_, args,{user}) => {
            try {
                if (user==='Invalid Token'){
                    throw{message:'Invalid Token'}
                }
                else if(user ==='Token empty'){
                    throw{message:'please login first'}
                }
                else if(user==='Relogin'){
                    throw {message:'Please relogin'}
                }
                const { playListForm } = args
                let newSong = await PlayListController.createPlayList(playListForm)
                return newSong
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
    }
}

module.exports = { playListTypeDefs, playListResolvers }