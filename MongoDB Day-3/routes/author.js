const express = require('express');
const AuthorController = require('../controller/authorController');
const router = express.Router();

router.post('/',AuthorController.createAuthor)
router.get('/',AuthorController.getAllAuthors)

module.exports=router