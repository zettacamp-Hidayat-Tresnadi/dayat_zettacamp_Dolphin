const { gql } = require('apollo-server-express')
const { BookController } = require('../controller/bookController')

const bookTypeDefs = gql`
    input bookForm {
        title: String!
        price:Int!
        taxPercentage:Int!
        author:ID!
        discountPercentage:Int!
        stock:Int!
        genre:String!
        isDiscount:Boolean
    }
    input bookId{
        _id:ID!
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
    type Message {
        message:String
    }

    type Query {
        getBooks: [Book],
        getBook(_id:bookId): Book
    }
    type Mutation{
        createBook(form:bookForm):Book
        deleteBook(_id:bookId):Message
        updateBook(_id:bookId,form:bookForm):Message
    }
`
const bookResolvers =
{
    Query: {
        getBooks: async () => await BookController.getAllBook(),
        getBook: async function (_, args) {
            try {
                const { _id } = args
                let chosenBook = await BookController.getBookById(_id)
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
        },
        deleteBook: async(_,args)=>{
            try {
                const { _id } = args
                let newMessage = await BookController.deleteBook(_id)
                return newMessage
            } catch (error) {
                throw new Error(error)
            }
        },
        updateBook: async(_,args)=>{
            try {
                const { _id,form } = args
                let newMessage = await BookController.updateBook(_id,form)
                return newMessage
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = { bookTypeDefs, bookResolvers }