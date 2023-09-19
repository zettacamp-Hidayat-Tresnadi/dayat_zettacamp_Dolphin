const express = require('express');
const { BookShelfController } = require('../controller/bookShelfController');
const router = express.Router();

router.post('/',BookShelfController.createBookShelf)
router.get('/',BookShelfController.getBookShelfs)
router.patch('/:bookShelfId/remove',BookShelfController.removeBook)
router.patch('/:bookShelfId',BookShelfController.updateBookShelf)
router.delete('/:bookShelfId',BookShelfController.deleteBookShelfById)

module.exports=router