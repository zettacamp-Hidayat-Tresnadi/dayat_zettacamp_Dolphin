const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication')
const { BookController } = require('../controller/bookController');

router.post('/',authentication,BookController.postPurchasingBook);
router.get('/',BookController.getExampleInput)
router.post('/creditDates',BookController.getCreditDates)
router.post('/awaitTest',BookController.testAwait)
router.post('/noAwait',BookController.testWithoutAwait)

module.exports=router