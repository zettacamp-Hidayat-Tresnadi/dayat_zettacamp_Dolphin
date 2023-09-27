const { gql } = require('apollo-server-express')
const { BookController } = require('../controller/bookController')

const bookTypeDefs = gql`
    input bookForm {
        title: String
        price:Int
        taxPercentage:Int
        author:ID
        discountPercentage:Int
        stock:Int
        genre:String
        isDiscount:Boolean
    }
    type author{
        _id:ID
        name:String
    }
    type Book {
        _id:ID
        title: String
        price:Int
        taxPercentage:Int
        author:author
        discountPercentage:Int
        stock:Int
        genre:String
        isDiscount:Boolean
    }

    type Query {
        getBooks: [Book],
        getBook(bookId:ID): Book
    }
    type Mutation{
        createBook(form:bookForm):Book
    }
`
const bookResolvers =
{
    Query: {
        getBooks: async () => await BookController.getAllBook(),
        getBook: async function (_, args) {
            try {
                const { bookId } = args
                let chosenBook = await BookController.getBookById(bookId)
                return chosenBook
            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        createBook: async (_, args) => {
            try {
                const { form } = args
                let newBook = await BookController.createBook(form)
                return newBook
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

module.exports = { bookTypeDefs, bookResolvers }