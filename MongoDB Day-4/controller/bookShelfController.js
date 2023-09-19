const BookShelf = require('../model/bookShelfSchema')
class BookShelfController {
    static async createBookShelf(req, res, next) {
        try {
            const name = req.body.name
            const books = req.body.books
            let newBookShelf = await BookShelf.create({
                name,
                books
            })
            res.status(201).json(newBookShelf)
        } catch (error) {
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
    static async removeBook(req,res,next){
        try {
            let { bookShelfId } = req.params
            let bookId =req.body.bookId
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
            let bookId =req.body.bookId
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
                filter.books = {$eq:bookId}
            }
            let bookShelfs = await BookShelf.find(filter).
                populate({ path: 'books',populate:{path:'author',select:'name'},select:'title' }).exec();
            res.status(200).json({ bookShelfs })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
module.exports = { BookShelfController }