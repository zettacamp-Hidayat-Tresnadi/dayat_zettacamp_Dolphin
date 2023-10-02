const { gql } = require('apollo-server-express')
const { BookController } = require('../controller/bookController')
const Author = require('../model/authorSchema')
const BookShelf = require('../model/bookShelfSchema')
const Book = require('../model/bookSchema')
const { BookShelfController } = require('../controller/bookShelfController')
const { token } = require('../helper/index')
const { bookShelfLoader, booksLists,authorLists } = require('../loader/dataLoader')

const bookTypeDefs = gql`
    input bookForm {
        title: String!
        price:Int!
        taxPercentage:Int!
        discountPercentage:Int!
        stock:Int!
        genre:String!
        isDiscount:Boolean
        author:ID
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
        discountPercentage:Int
        stock:Int
        genre:String
        author:author
        isDiscount:Boolean
        bookShelf:BookShelves
    }
    type BookShelves{
        _id:ID,
        name:String
        books:[Book]
    }
    type Message {
        message:String
    }

    type Query {
        getBooks: [Book],
        getBook(_id:bookId): Book
        getBookShelves:[BookShelves]
        getBookShelf(_id:ID):BookShelves
    }
    type Mutation{
        authenticate(username: String!, password: String!): String
        createBook(form:bookForm):Book
        deleteBook(_id:bookId):Message
        updateBook(_id:bookId,form:bookForm):Message
    }
`
const bookResolvers =
{
    Query: {
        getBookShelves: async (_, __, { user }) => {
            try {
                // if (!user) {
                //     throw errorHandler;
                // }
                if(!user){
                    throw error
                }
                const bookShelves = await BookShelf.find({}, '_id')
                return bookShelfLoader.loadMany(
                    bookShelves.map((book) => {
                        return book._id
                    })
                )
            } catch (error) {
                throw new Error(error) 
            }
        },
        getBookShelf:async(_,args,{user})=>{
            try {
                const {_id}=args
                if (!user) {
                    throw new Error('Authentication required');
                }
                return bookShelfLoader.load(_id)
            } catch (error) {
                return error
            }
        },

        getBooks: async function (_, __, { user }) {
            try {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const manyBooks = await Book.find({}, '_id')
                return booksLists.loadMany(
                    manyBooks.map((book) => {
                        return book._id
                    })
                )
            } catch (error) {
                return error
            }
        }
    },
    Book: {
        author: async parent => {
            // console.log(parent.author)
            let bookShelves = await authorLists.load(parent.author)
            return bookShelves
        }
    },
    BookShelves: {
        books: async parent => {
            let books = await booksLists.loadMany(parent.books)
            return books
        }
    },
    Mutation: {
        authenticate: async (_, args) => {
            try {
                const { username, password } = args
                let jwtToken
                if (username === 'Dayat' && password === 'Admin') {
                    jwtToken = token({
                        username: username
                    })
                }
                return jwtToken
            } catch (error) {
                throw new Error(error)
            }
        },
        createBook: async (_, args, { user }) => {
            try {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const { form } = args
                let newBook = await BookController.createBook(form)
                return newBook
            } catch (error) {
                throw new Error(error);
            }
        },
        deleteBook: async (_, args, { user }) => {
            try {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const { _id } = args
                let newMessage = await BookController.deleteBook(_id)
                return newMessage
            } catch (error) {
                throw new Error(error)
            }
        },
        updateBook: async (_, args, { user }) => {
            try {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const { _id, form } = args
                let newMessage = await BookController.updateBook(_id, form)
                return newMessage
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = { bookTypeDefs, bookResolvers }