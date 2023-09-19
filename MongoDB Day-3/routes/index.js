const express = require('express');
const bookPurchasing =require('./bookPurchasing')
const author =require('./author')
const bookShelf=require('./bookShelf')
const router = express.Router();

router.use('/bookPurchasing',bookPurchasing)
router.use('/authors',author)
router.use('/bookShelf',bookShelf)

module.exports=router
