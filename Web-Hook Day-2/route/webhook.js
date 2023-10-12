const express = require('express');
const { WebhookController } = require('../controller/webhookController');
const router = express.Router();
const {authentication}=require('../middleware/authenticationWebHook')

router.post('/:songId',authentication, WebhookController.updateSong)

module.exports = router