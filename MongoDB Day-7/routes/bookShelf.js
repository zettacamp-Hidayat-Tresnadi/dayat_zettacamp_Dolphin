const express = require('express');
const { BookShelfController } = require('../controller/bookShelfController');
const router = express.Router();

router.post('/',BookShelfController.createBookShelf)
router.get('/',BookShelfController.getBookShelfs)
router.get('/elemMatch',BookShelfController.getElematch)
router.get('/getUnique',BookShelfController.getUnique)
router.get('/unwind',BookShelfController.unwindFunction)
router.get('/lookUp',BookShelfController.lookUp)
router.patch('/arrayFilter',BookShelfController.arrayFilter)
router.patch('/:bookShelfId/remove',BookShelfController.removeBook)
router.patch('/:bookShelfId',BookShelfController.updateBookShelf)
router.delete('/:bookShelfId',BookShelfController.deleteBookShelfById)

module.exports=router