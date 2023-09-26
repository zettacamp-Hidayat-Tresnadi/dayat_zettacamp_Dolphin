const express = require('express');
const router = express.Router();
const { SongController } = require('../controller/songController');

router.post('/',SongController.createSong);
router.get('/',SongController.getAllSong);
router.get('/aggregate',SongController.getaggregate)
router.put('/:songId',SongController.updateSong);
router.delete('/:songId',SongController.deleteSong);

module.exports=router