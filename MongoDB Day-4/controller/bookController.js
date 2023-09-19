const { bookPurchasing, validateInput, generateCreditDates, generatePrices, loopingText } = require('../helper/index')
const Book = require('../model/bookSchema.js')
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
            let validation = validateInput(+taxPercentage, +discountPercentage, +amountOfPurchasedBook, +terms, +chosenTerm, +additionalPrice)
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
            let listPrices = await generatePrices(creditDates, bookInfo.totalPrice, additionalPrice, chosenTerm)
            let uniquePrices = new Set(listPrices)
            const uniquePricesArray = Array.from(uniquePrices);
            let listCreditDates = new Map()
            creditDates.forEach((creditDate, index) => {
                listCreditDates.set(creditDate.dueDate, { term: creditDate.term, dueDate: creditDate.dueDate, term_amount: listPrices[index] })
            })
            let chosenDate = listCreditDates.get('13 Desember 2023')

            const listCreditDatesObject = {};
            for (const [key, value] of listCreditDates) {
                listCreditDatesObject[key] = value;
            }
            res.status(200).json({ bookInfo, list_terms_amount: uniquePricesArray, list_terms: listCreditDatesObject, chosenDate })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getCreditDates(req, res, next) {
        try {
            const terms = req.body.terms
            if (!terms || (+terms) <= 0) {
                throw { name: 'bad request', errors: 'Please input valid terms' }
            }
            let creditDates = await generateCreditDates(terms)
            res.status(200).json({ creditDates })
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
    static async testAwait(req, res, next) {
        try {
            const typedText = req.body.text
            if (!typedText) {
                throw { name: 'bad request', errors: 'Typed text is required' }
            }
            let text = await loopingText(typedText)
            res.status(200).json({ message: `Text: ${text} has gone through looping 5 times in terminal` })
        } catch (error) {
            next(error)
        }
    }
    static async testWithoutAwait(req, res, next) {
        try {
            const typedText = req.body.text
            if (!typedText) {
                throw { name: 'bad request', errors: 'Typed text is required' }
            }
            loopingText(typedText)
                .then((text) => {
                    res.status(200).json({ message: `Text: ${text} has gone through looping 5 times in terminal` })
                })
                .catch((error) => {
                    console.log(error)
                })
            // let text = loopingText(typedText)
            // res.status(200).json({ message: `Text: ${text} has not gone through looping 5 times in terminal` })
        } catch (error) {
            next(error)
        }
    }
    static async createBook(req, res, next) {
        try {
            const { authorId } = req.params
            const title = req.body.title
            const price = req.body.price
            const taxPercentage = req.body.taxPercentage
            const discountPercentage = req.body.discountPercentage
            const stock = req.body.stock
            const genre = req.body.genre

            let newBook = await Book.create({
                title,
                price,
                taxPercentage,
                discountPercentage,
                author: authorId,
                stock,
                genre
            })
            res.status(201).json({ newBook })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getAllBook(req, res, next) {
        try {
            const books = await Book.
                find({}).
                populate({ path: 'author', select: 'name' }).exec();
            res.status(200).json({ books })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async getBookById(req, res, next) {
        try {
            const { bookId } = req.params
            const book = await Book.
                findOne({ _id: bookId }).
                populate('author').exec();
            res.status(200).json({ book })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteBook(req, res, next) {
        try {
            let { bookId } = req.params
            await Book.deleteOne({ _id: bookId });
            res.status(200).json({ message: `Book with id:${bookId} has been deleted` })
        }
        catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteManyBooks(req, res, next) {
        try {
            let title = req.body.title
            await Book.deleteMany({ title });
            res.status(200).json({ message: `Book with title:${title} have been deleted` })
        }
        catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async updateBook(req, res, next) {
        try {
            const { bookId, authorId } = req.params
            const amountOfPurchasedBook = req.body.amountOfPurchasedBook
            const bookTitle = req.body.bookTitle
            const priceBook = req.body.price
            const taxPercentage = req.body.taxPercentage
            const discountPercentage = req.body.discountPercentage
            const amountOfStock = req.body.amountOfStock
            const terms = req.body.terms
            const additionalPrice = req.body.additionalPrice
            const chosenTerm = req.body.chosenTerm
            let validation = validateInput(+taxPercentage, +discountPercentage, +amountOfPurchasedBook, +terms, +chosenTerm, +additionalPrice)
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
            let listPrices = await generatePrices(creditDates, bookInfo.totalPrice, additionalPrice, chosenTerm)
            creditDates.forEach((element, index) => {
                element.payment = listPrices[index]
            })
            await Book.updateOne({ _id: bookId }, {
                title: bookTitle,
                price: bookInfo.totalPrice,
                tax: bookInfo.totalTax,
                discount: bookInfo.totalDiscount,
                terms: {
                    total_terms: terms,
                    list_terms: creditDates
                },
                author: authorId
            })
            let dataBook = await Book.find({ _id: bookId }).populate('Author').exec()

            res.status(200).json({ message: `Book with id:${bookId} has been updated`, dataBook })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = { BookController }