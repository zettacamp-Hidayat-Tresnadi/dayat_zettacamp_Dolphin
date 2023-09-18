const express = require('express');
const bookPurchasing =require('./bookPurchasing')
const author =require('./author')
const router = express.Router();

router.use('/bookPurchasing',bookPurchasing)
router.use('/authors',author)

module.exports=router
