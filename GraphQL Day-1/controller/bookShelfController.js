const BookShelf = require('../model/bookShelfSchema')
const Book = require('../model/bookSchema')
class BookShelfController {
    static async createBookShelf(req, res, next) {
        try {
            const name = req.body.name
            const books = req.body.books

            let genres =
                await Promise.all(books.map(async (element) => {
                    let book = await Book.findOne({ _id: element._id })
                    return book.genre
                    // console.log(genre)
                }))

            let newBookShelf = await BookShelf.create({
                name,
                books,
                booksGenre: {
                    genre: genres
                }
            })
            res.status(201).json({ newBookShelf })

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteBookShelfById(req, res, next) {
        try {
            let { bookShelfId } = req.params
            await BookShelf.deleteOne({ _id: bookShelfId });
            res.status(200).json({ message: `Book Shelf with id:${bookShelfId} has been deleted` })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async removeBook(req, res, next) {
        try {
            let { bookShelfId } = req.params
            let bookId = req.body.bookId
            await BookShelf.updateOne({ _id: bookShelfId }, {
                '$pull': { 'books': bookId }
            })
            res.status(200).json({ message: `Book Shelf with id:${bookShelfId} has been updated` })

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async updateBookShelf(req, res, next) {
        try {
            let { bookShelfId } = req.params
            let bookId = req.body.bookId
            await BookShelf.updateOne({ _id: bookShelfId }, {
                '$addToSet': { 'books': bookId }
            })
            res.status(200).json({ message: `Book Shelf with id:${bookShelfId} has been updated` })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getBookShelfs(req, res, next) {
        try {
            let { bookId } = req.query
            let filter = {}
            if (bookId) {
                filter.books = { $eq: bookId }
            }
            //  let bookShelfs = await BookShelf.find(filter)
            let bookShelfs = await BookShelf.find(filter).
                populate({ path: 'books._id', populate: { path: 'author', select: 'name' }, select: ['title', 'genre'] }).exec();
            res.status(200).json({ bookShelfs })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getElematch(req, res, next) {
        try {
            const bookId = req.body.bookId
            let matchedBooks = await BookShelf.find({
                books: {
                    $elemMatch: {
                        _id: bookId,
                    },
                },
            }).
                populate({ path: 'books._id', populate: { path: 'author', select: 'name' }, select: 'title' }).exec();
            res.status(200).json({ matchedBooks })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async arrayFilter(req, res, next) {
        try {
            const bookShelfId = req.body.bookShelfId
            const chosenBookId = req.body.chosenBookId
            const changingBookId = req.body.changingBookId
            await BookShelf.updateOne({ _id: bookShelfId }, {
                $set: {
                    "books.$[book]._id": changingBookId
                }
            }, {
                arrayFilters: [{ "book._id": { $eq: chosenBookId } }]
            })
            res.status(200).json({ message: 'The book has been updated' })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getUnique(req, res, next) {
        try {
            let uniqueGenre = await BookShelf.find({}).distinct('booksGenre.genre')
            res.status(200).json(uniqueGenre)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async unwindFunction(req, res, next) {
        try {
            let booksofEachBookShelf = await BookShelf.aggregate([
                {
                    $unwind: '$books', // Deconstruct the "books" array
                },
                {
                    $lookup: {
                        from: 'books', // The name of the "Book" collection
                        localField: 'books._id', // ini field yang punya foreign key dari schema si collection => bookshelf punya schema books._id untuk nyimpen fk dari id books
                        foreignField: '_id', // The field in the "Book" collection to match => yang match sama si key dari local(bookShelf collection) dengan book collectionnya. Yang match kan _id dari book collection makanya diisi _id 
                        as: 'bookDetails', // The alias for the joined documents => cuman ngasih nama tambahan aja
                    },
                },
                {
                    $unwind: '$bookDetails', // Deconstruct the "tags" array
                },
                {
                    $addFields: {
                        bookTitle: '$bookDetails.title', // Create a new field with book titles
                        bookPrice: '$bookDetails.price',
                        bookGenre: '$bookDetails.genre'
                    },
                },
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        name: 1, // Include the name field
                        bookTitle: 1, // Include the bookTitles field
                        bookPrice: 1,
                        bookGenre: 1,
                    },
                },
            ])
            res.status(200).json(booksofEachBookShelf)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async lookUp(req, res, next) {
        try {
            let booksofEachBookShelf = await BookShelf.aggregate([
                {
                    $lookup: {
                      from: 'books', // The name of the "Book" collection
                      localField: 'books._id',
                      foreignField: '_id',
                      as: 'book_details',
                    },
                  },
                  {
                    $unwind: '$book_details', // Unwind the book_details array
                  },
                  {
                    $lookup: {
                      from: 'authors', // The name of the "Author" collection
                      localField: 'book_details.author', // Assuming "author" is the foreign key field in the Book collection
                      foreignField: '_id',
                      as: 'book_details.author', // Populate the author field within book_details
                    },
                  },
                  {
                    $project: {
                      name: 1, // Include the name field from the BookShelf collection
                      'book_details._id': 1,
                      'book_details.title': 1,
                      'book_details.price': 1,
                      'book_details.stock': 1,
                      'book_details.genre': 1,
                      'book_details.author.name': 1, // Include the author's name from the joined Author collection
                    },
                  },])
                // {
                //     $lookup: {
                //         from: 'authors', 
                //         localField: 'book_details.author', 
                //         foreignField: '_id', 
                //         as: 'author',
                //     }
                // }
                // {
                //     $unwind: '$book_details.author', // Unwind the array of books
                // },

            
            res.status(200).json(booksofEachBookShelf)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
module.exports = { BookShelfController }