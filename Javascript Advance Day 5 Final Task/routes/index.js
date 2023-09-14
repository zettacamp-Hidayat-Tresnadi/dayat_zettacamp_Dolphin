const express = require('express');
const songList =require('./songList')
const login = require('./login')
const router = express.Router();

router.use('/songList',songList)
router.use('/login',login)

module.exports=router
