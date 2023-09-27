const Author = require('../model/authorSchema.js')
class AuthorController {
    static async getAllAuthors(req, res, next) {
        try {
            const authors = await Author.aggregate([{
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'books',
                }
            },
            {
                $project: {
                    'books.author': 0,
                    'books.taxPercentage':0,
                    'books.price':0
                }
            }])
            res.status(200).json({ authors })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async createAuthor(req, res, next) {
        try {
            let author = req.body.author
            let newAuthor = await Author.create({
                name: author
            })
            res.status(201).json({ newAuthor })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
module.exports = AuthorController