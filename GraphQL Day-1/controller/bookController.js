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
    static async createBook(bookForm) {
        try {
            const {title,author,price,taxPercentage,discountPercentage,stock,genre,isDiscount}=bookForm
            // const { authorId } = req.params
            // const title = req.body.title
            // const price = req.body.price
            // const taxPercentage = req.body.taxPercentage
            // const discountPercentage = req.body.discountPercentage
            // const stock = req.body.stock
            // const genre = req.body.genre

            let newBook = await Book.create({
                title,
                price,
                taxPercentage,
                discountPercentage,
                author,
                stock,
                genre,
                isDiscount
            })
            return newBook
            res.status(201).json({ newBook })
        } catch (error) {
            if(error.name==='ValidationError'){
                let msg = []
                for (const [key] of Object.entries(error.errors)) {
                    msg.push(error.errors[key]['message'])
                }
                throw msg
            }
            throw error
        }
    }
    static async getAllBook() {
        try {
            const books = await Book.
                find({}).
                populate({ path: 'author', select: 'name' }).exec();
            return books
        } catch (error) {
            return error
        }
    }
    static async getBookById(bookId) {
        try {
            const book = await Book.
                findOne({ _id: bookId }).
                populate('author').exec();
            return book
            // res.status(200).json({ book })
        } catch (error) {
            return error
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
    static async getUnique(req, res, next) {
        try {
            let uniqueGenre = await Book.distinct('genre')
            res.status(200).json(uniqueGenre)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async showProject(req, res, next) {
        try {
            const agregatedBook = await Book.aggregate([
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        title: 1,
                        genre: 1, // Include the genre field
                    },
                },
            ])
            res.status(200).json(agregatedBook)
        } catch (error) {
            console.log(error)
            next(error)
            //  {
            //         $group: {
            //             _id: '$title', // Group by the "category" field
            //             genre: { $addToSet: '$genre' },
            //             price:{$addToSet:'$price'},
            //             stock:{$addToSet:'$stock'}
            //         },
            //     },
            //     {
            //         $unwind:'$genre'
            //     },
            //     {
            //         $unwind:'$price'
            //     },
            //     {
            //         $project:{
            //             _id:0,
            //             title: '$_id', // Rename the "_id" field to "category"
            //             genre:1,
            //             price:1,
            //             stock:1
            //         }
            //     }
        }
    }
    static async addFields(req, res, next) {
        try {
            let totalPrices = await Book.aggregate([
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        title: 1,
                        genre: 1,
                        price: 1,
                        stock: 1 // Include the stock field
                    }
                },
                {
                    $addFields: {
                        totalPrice: { $multiply: ['$price', '$stock'] }, // Create a new field
                    },
                }
            ])
            res.status(200).json(totalPrices)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async filter(req, res, next) {
        try {
            let genres = req.query.genres
            let query = [{
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                }
            },
            {
                $unwind: '$author'
            },
            {
                $sort:
                {
                    'author.name': 1,
                },
            },
            {
                $project: {
                    title: 1,
                    genre: 1,
                    price: 1,
                    stock: 1,
                    'author.name': 1,
                    'author._id': 1,
                    totalPrice: {
                        $concat: ['$title', " has price ", {
                            $toString: {
                                $multiply: ['$price', '$stock']
                            }
                        }]
                    },
                    titleGenre: {
                        $concat: ["$title", " has genre ", "$genre"]
                    }
                }
            }
            ]
            if (genres) {
                genres = req.query.genres.split(",")
                query.push({
                    $match: {
                        genre: {
                            $in: genres
                        }
                    }
                })
            }
            let books = await Book.aggregate(query)
            res.status(200).json({ books })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async pagination(req, res, next) {
        try {
            let { page, limit } = req.body
            if (!page) {
                page = 1
            }
            if (!limit) {
                limit = 3
            }

            let pageBooks = await Book.aggregate([{
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                }
            },
            {
                $unwind: '$author'
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    genre: 1,
                    price: 1,
                    stock: 1,
                    'author.name': 1,
                    'author._id': 1,
                    totalPrice: 1
                }
            },
            {
                $skip: (page - 1) * +limit
            },
            {
                $limit: +limit
            }])
            res.status(200).json(pageBooks)
        } catch (error) {
            console.log(error.name)
            res.status(400).json({ message: error.errmsg })
            // next(error)
        }
    }
    static async groupingGenre(req, res, next) {
        try {
            let { page, limit } = req.body
            if (!page) {
                page = 1
            }
            if (!limit) {
                limit = 3
            }
            let data = await Book.aggregate([
                {
                    $lookup: {
                        from: 'authors',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                    $unwind: '$author',
                },
                {
                    $group: {
                        _id: '$genre',
                        books: { $push: '$$ROOT' }, // Collect all book documents in an array
                    },
                },
                {
                    $sort: {
                        _id: 1
                    }
                },
                {
                    $facet: {
                        genres: [
                            {
                                $project: {
                                    _id: 0, // Exclude _id
                                    genre: '$_id', // Rename _id to genre
                                    books: {
                                        $slice: ['$books', 0, +limit]
                                    },
                                },
                            },
                            {
                                $skip: (page - 1) * +limit,
                            },
                            {
                                $limit: +limit,
                            },
                        ],
                    },
                },
                {
                    $unwind: '$genres',
                },
                {
                    $project: {
                        genre: '$genres.genre',
                        books: '$genres.books',
                    },
                }
            ]);
            res.status(200).json({ data })
        } catch (error) {
            console.log(error.name)
            res.status(400).json({ message: error.errmsg })
        }
    }
}

module.exports = { BookController }