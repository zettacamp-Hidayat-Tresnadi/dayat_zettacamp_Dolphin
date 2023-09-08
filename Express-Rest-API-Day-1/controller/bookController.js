const { bookPurchasing, validateInput } = require('../helper/index')

class BookController {
    static async postPurchasingBook(req, res, next) {
        try {
            const amountOfPurchasedBook = req.body.amountOfPurchasedBook
            const bookTitle = req.body.bookTitle
            const priceBook = req.body.price
            const taxPercentage = req.body.taxPercentage
            const discountPercentage = req.body.discountPercentage
            const amountOfStock = req.body.amountOfStock
            const terms = req.body.terms
            let validation = validateInput(+taxPercentage, +discountPercentage, +amountOfPurchasedBook, +terms)
            // Validate Input
            if (validation) {
                throw { name: 'bad request', errors: validation }
            }
            const book = {
                title: bookTitle,
                price: +priceBook,
            }

            let response = bookPurchasing(book, +discountPercentage, +taxPercentage, +amountOfStock, +amountOfPurchasedBook, +terms)
            res.status(200).json({ response })
        } catch (error) {
            next(error)
        }
    }

    static async getExampleInput(req, res) {
        try {
            const data = {
                bookTitle: "Naruto",
                price: 10000,
                amountOfPurchasedBook: 4,
                taxPercentage: 10,
                discountPercentage: 25,
                amountOfStock: 12,
                terms: 3
            }
            res.status(200).json({ data })   
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { BookController }