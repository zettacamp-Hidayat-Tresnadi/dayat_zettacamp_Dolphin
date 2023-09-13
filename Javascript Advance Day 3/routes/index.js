const express = require('express');
const bookPurchasing =require('./bookPurchasing')
const router = express.Router();

router.use('/bookPurchasing',bookPurchasing)

module.exports=router
