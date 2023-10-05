const DataLoader  = require('dataloader');
const Bookshelf=require('../model/bookShelfSchema')
const Book = require('../model/bookSchema')
const Author =require('../model/authorSchema')


const batchBookshelf = async (keys) => {
    const bookshelves = await Bookshelf.find({ _id: { $in: keys } })
    const bookshelvesMap = {};
    bookshelves.forEach((bookshelf) => {
    bookshelvesMap[bookshelf._id.toString()] = bookshelf
    });
    return keys.map((key) => bookshelvesMap[key.toString()]);
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

const bookshelfLoader = new DataLoader(batchBookshelf);
const booksListsLoader = new DataLoader(batchBooks)
const authorListLoader = new DataLoader(batchAuthors)

module.exports={bookshelfLoader,booksListsLoader,authorListLoader}