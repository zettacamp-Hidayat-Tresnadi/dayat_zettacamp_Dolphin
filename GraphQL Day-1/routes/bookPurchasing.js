const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication')
const { BookController } = require('../controller/bookController');

// router.post('/',authentication,BookController.postPurchasingBook);
// router.get('/',BookController.getExampleInput)
// router.post('/creditDates',BookController.getCreditDates)
// router.post('/awaitTest',BookController.testAwait)
// router.post('/noAwait',BookController.testWithoutAwait)
router.get('/',BookController.getAllBook)
router.get('/pagination',BookController.pagination)
router.get('/groupGenre',BookController.groupingGenre)
router.get('/filter',BookController.filter)
router.get('/getUnique',BookController.getUnique)
router.get('/project',BookController.showProject)
router.get('/addFields',BookController.addFields)
router.delete('/',BookController.deleteManyBooks)
router.post('/:authorId',BookController.createBook)
router.get('/:bookId',BookController.getBookById)
router.delete('/:bookId',BookController.deleteBook)
router.put('/:bookId/:authorId',BookController.updateBook)

module.exports=router