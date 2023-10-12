const { gql, ApolloError } = require('apollo-server-express')
const { SongController } = require('../controller/songController')


const songTypeDefs = gql`
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
        title:String
        duration:String
        artist:String
        genre:String
    }
    type Query1 {
        getSongs:[Song]
        getSong(_id:inputSongId):Song
    }
    type Mutation1{
        createSong(songForm:songInput):Song
    }
`
const songResolvers =
{
    Query1: {
        getSongs: async (_, __, { user }) => {
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
                const songs = await SongController.getAllSong()
                return songs
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getSong: async (_, args,{user}) => {
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
                const song = await SongController.getSong(_id)
                return song
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    },
    Mutation1: {
        createSong: async (_, args,{user}) => {
            try {
                const { songForm } = args
                let newSong = await SongController.createSong(songForm)
                return newSong
            } catch (error) {
                throw new Error(error);
            }
        },
    }
}

module.exports = { songTypeDefs, songResolvers }