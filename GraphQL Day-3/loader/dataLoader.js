const DataLoader  = require('dataloader');
const BookShelf=require('../model/bookShelfSchema')
const Book = require('../model/bookSchema')
const Author =require('../model/authorSchema')


const batchLoadBook = async (keys) => {
    const bookShelves = await BookShelf.find({ _id: { $in: keys } })
    const bookShelvesMap = {};
    bookShelves.forEach((bookShelf) => {
    bookShelvesMap[bookShelf._id.toString()] = bookShelf
    });
    return keys.map((key) => bookShelvesMap[key.toString()]);
};

const batchBooks=async(keys)=>{
    const bookLists = await Book.find({ _id: { $in: keys }})
    const bookMap = {};
    bookLists.forEach((book) => {
    bookMap[book._id.toString()] = book
    });
    return keys.map((key) => bookMap[key.toString()]);
}

const batchAuthors=async(keys)=>{
    const authorLists = await Author.find({ _id: { $in: keys }})
    const authorMap = {};
    authorLists.forEach((author) => {
    authorMap[author._id.toString()] = author
    });
    return keys.map((key) => authorMap[key.toString()]);
}

const bookShelfLoader = new DataLoader(batchLoadBook);
const booksLists = new DataLoader(batchBooks);
const authorLists = new DataLoader(batchAuthors)

module.exports={bookShelfLoader,booksLists,authorLists}
