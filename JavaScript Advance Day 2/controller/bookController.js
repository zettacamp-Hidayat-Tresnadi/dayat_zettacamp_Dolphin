const { bookPurchasing, validateInput, generateCreditDates, generatePrices } = require('../helper/index')

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
            const additionalPrice = req.body.additionalPrice
            const chosenTerm = req.body.chosenTerm
            let validation = validateInput(+taxPercentage, +discountPercentage, +amountOfPurchasedBook, +terms,+chosenTerm,+additionalPrice)
            // Validate Input
            if (validation) {
                throw { name: 'bad request', errors: validation }
            }
            const book = {
                title: bookTitle,
                price: +priceBook,
            }

            let bookInfo = await bookPurchasing(book, +discountPercentage, +taxPercentage, +amountOfStock, +amountOfPurchasedBook)
            let creditDates = await generateCreditDates(terms)
            let creditTerms = await generatePrices(creditDates,bookInfo.totalPrice,additionalPrice,chosenTerm)
            res.status(200).json({ bookInfo,creditTerms })
        } catch (error) {
            next(error)
        }
    }
    static async getCreditDates(req,res,next){
        try {
            const terms = req.body.terms
            if(!terms || (+terms)<=0){
                throw { name: 'bad request', errors: 'Please input valid terms' }
            }
            let creditDates = await generateCreditDates(terms)
            res.status(200).json({creditDates})
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