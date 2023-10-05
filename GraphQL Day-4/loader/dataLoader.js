const DataLoader  = require('dataloader');
const BookShelf=require('../model/playlistSchema')
const Book = require('../model/songSchema')
const Author =require('../model/userSchema')
const Playlist = require('../model/playlistSchema')
const Song = require('../model/songSchema')


// const batchLoadBook = async (keys) => {
//     const bookShelves = await BookShelf.find({ _id: { $in: keys } })
//     const bookShelvesMap = {};
//     bookShelves.forEach((bookShelf) => {
//     bookShelvesMap[bookShelf._id.toString()] = bookShelf
//     });
//     return keys.map((key) => bookShelvesMap[key.toString()]);
// };

const batchPlaylist=async(keys)=>{
    const playList = await Playlist.find({ _id: { $in: keys }})
    const playListMap = {}
    playList.forEach((playList) => {
    playListMap[playList._id.toString()] = playList
    })
    return keys.map((key) => playListMap[key.toString()])
}

const batchSongs=async(keys)=>{
    const songLists = await Song.find({ _id: { $in: keys }})
    const songMap = {};
    songLists.forEach((song) => {
    songMap[song._id.toString()] = song
    });
    return keys.map((key) => songMap[key.toString()]);
}

// const bookShelfLoader = new DataLoader(batchLoadBook,{ cache: true });
const playList = new DataLoader(batchPlaylist,{ cache:true })
const songLoader = new DataLoader(batchSongs,{ cache: true })

module.exports={playList,songLoader}
