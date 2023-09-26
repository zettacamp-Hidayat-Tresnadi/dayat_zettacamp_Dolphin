const express = require('express');
const songs =require('./songs')
const playlists=require('./playlists')
// const author =require('./author')
const router = express.Router();

router.use('/song',songs)
router.use('/playlist',playlists)
// router.use('/authors',author)

module.exports=router
