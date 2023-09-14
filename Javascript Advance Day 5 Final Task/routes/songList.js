const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication');
const { SongController } = require('../controller/songController');


router.get('/genre',authentication,SongController.getMusicGenre)
router.get('/artist',authentication,SongController.getMusicArtist)
router.get('/randomSong',authentication,SongController.getMusicRandom)


module.exports=router