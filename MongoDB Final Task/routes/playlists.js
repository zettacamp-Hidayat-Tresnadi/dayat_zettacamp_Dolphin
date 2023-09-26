const express = require('express');
const { PlayListController } = require('../controller/playlistController');
const router = express.Router();

router.post('/',PlayListController.createPlayList)
router.get('/',PlayListController.getAllPlaylist)
router.get('/aggregate',PlayListController.getaggregate)
router.patch('/:playlistId',PlayListController.updatePlaylist)
router.delete('/:playlistId',PlayListController.deleteplaylist)

module.exports=router