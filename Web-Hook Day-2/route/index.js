const express = require('express');
const webhook =require('./webhook')
const router = express.Router();

router.use('/webhook',webhook)

module.exports=router