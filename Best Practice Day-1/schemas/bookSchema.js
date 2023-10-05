const { gql, ApolloError } = require('apollo-server-express')
const { BookController } = require('../controller/bookController')
// const Book = require('../model/bookSchema')
const { BookshelfController } = require('../controller/bookShelfController')
const { token } = require('../helper/index')

const bookTypeDefs = gql`
    input BookForm {
        title: String!
        price:Int!
        tax_percentage:Int!
        discount_percentage:Int!
        stock:Int!
        genre:String!
        is_discount:Boolean
        author:ID
    }
    input BookshelfForm{
        name:String
        books:[ID]
    }
    input BookId{
        book_id:ID!
    }
    type Author{
        _id:ID
        name:String
    }
    type Book {
        _id:ID
        title: String
        price:Int
        tax_percentage:Int
        discount_percentage:Int
        stock:Int
        genre:String
        author:Author
        is_discount:Boolean
    }
    type Bookshelf{
        _id:ID,
        name:String
        books:[Book]
    }
    type Message {
        message:String
    }

    type Query {
        getAllBooks: [Book],
        getOneBook(_id:BookId): Book
        getAllBookshelves(bookId:[String]):[Bookshelf]
        getOneBookshelf(_id:ID):Bookshelf
    }
    type Mutation{
        authenticate(username: String!, password: String!): String
        createBook(formBook:BookForm):Book
        deleteBook(_id:BookId):Message
        updateBook(_id:BookId,form:BookForm):Message
        createBookshelf(formBookshelf:BookshelfForm):Bookshelf
    }
`
const bookResolvers =
{
    Query: {
        getAllBookshelves: async (_, args, { user }) => {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                let getBookId
                if (args) {
                    const { bookId } = args
                    getBookId = bookId
                }
                let allBookshelves = await BookshelfController.getAllBookshelves(getBookId)
                return allBookshelves
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getOneBookshelf: async (_, args, { user}) => {
            try {
                const { _id } = args
                if (typeof user === 'string') {
                    throw { message: user };
                }
                return await BookshelfController.getOneBookShelf(_id)
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        getAllBooks: async function (_, __, { user }) {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const allOfBooks = await BookController.getAllBooks()
                return allOfBooks 
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        getOneBook: async function (_, args, { user }) {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const { _id } = args
                const dayat =  await BookController.getBookById(_id.book_id)
                return dayat
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    },
    Book: {
        author: async (parent, _, { authorListLoader }) => {
            if(!parent.author){
                throw new ApolloError('book is not found')
            }
            let authorOfTheBook = await authorListLoader.load(parent.author)
            return authorOfTheBook
        }
    },
    Bookshelf: {
        books: async (parent, _, { booksListsLoader }) => {
            let manyBooks = await booksListsLoader.loadMany(parent.books)
            return manyBooks
        }
    },
    Mutation: {
        authenticate: async (_, args) => {
            try {
                const { username, password } = args
                let jwtToken
                if(!username || !password){
                    throw {message:'Please input username and password'}
                }
                else if(username!=='Dayat' || password !=='Admin'){
                    throw {message:'username or password is wrong'}
                }
                jwtToken = token({
                    username: username
                })
                return jwtToken
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        createBook: async (_, args, { user }) => {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const { formBook } = args
                let newBook = await BookController.createBook(formBook)
                return newBook
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        deleteBook: async (_, args, { user }) => {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const { _id } = args
                let newMessage = await BookController.deleteBook(_id)
                return newMessage
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        updateBook: async (_, args, { user }) => {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const { _id, form } = args
                let newMessage = await BookController.updateBook(_id, form)
                return newMessage
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        createBookshelf: async (_, args, { user }) => {
            try {
                if (typeof user === 'string') {
                    throw { message: user };
                }
                const { formBookshelf } = args
                const newBookshelf = await BookshelfController.createBookShelf(formBookshelf)
                return newBookshelf
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    }
}

module.exports = { bookTypeDefs, bookResolvers }