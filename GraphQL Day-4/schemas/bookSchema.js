// const { gql } = require('apollo-server-express')
// const { BookController } = require('../controller/bookController')
// const Author = require('../model/userSchema')
// const BookShelf = require('../model/playlistSchema')
// const Book = require('../model/songSchema')
// const { BookShelfController } = require('../controller/bookShelfController')
// const { token } = require('../helper/index')
// const { bookShelfLoader, authorLists } = require('../loader/dataLoader')

// const TypeDefs = gql`
//     input bookForm {
//         title: String!
//         price:Int!
//         taxPercentage:Int!
//         discountPercentage:Int!
//         stock:Int!
//         genre:String!
//         isDiscount:Boolean
//         author:ID
//     }
//     input BookShelfForm{
//         name:String
//         books:[String]
//     }
//     input bookId{
//         _id:ID!
//     }
//     type author{
//         _id:ID
//         name:String
//     }
//     type Book {
//         _id:ID
//         title: String
//         price:Int
//         taxPercentage:Int
//         discountPercentage:Int
//         stock:Int
//         genre:String
//         author:author
//         isDiscount:Boolean
//         bookShelf:BookShelves
//     }
//     type BookShelves{
//         _id:ID,
//         name:String
//         books:[Book]
//     }
//     type Message {
//         message:String
//     }

//     type Query {
//         getBooks: [Book],
//         getBook(_id:bookId): Book
//         getBookShelves:[BookShelves]
//         getBookShelf(_id:ID):BookShelves
//     }
//     type Mutation{
//         authenticate(username: String!, password: String!): String
//         createBook(form:bookForm):Book
//         deleteBook(_id:bookId):Message
//         updateBook(_id:bookId,form:bookForm):Message
//         createBookShelf(form1:BookShelfForm):Message
//     }
// `
// const Resolvers =
// {
//     Query: {
//         getBookShelves: async (_, __, { user }) => {
//             if (!user) {
//                 throw new Error('Authentication required');
//             }
//             // if(!user){
//             //     throw error
//             // }
//             const bookShelves = await BookShelf.find({}, '_id')
//             return bookShelfLoader.loadMany(
//                 bookShelves.map((book) => {
//                     return book._id
//                 })
//             )
//         },
//         getBookShelf: async (_, args, { user }) => {
//             try {
//                 const { _id } = args
//                 if (!user) {
//                     throw new Error('Authentication required');
//                 }
//                 return bookShelfLoader.load(_id)
//             } catch (error) {
//                 return error
//             }
//         },

//         getBooks: async function (_, __, { user }) {
//             try {
//                 if (!user) {
//                     throw new Error('Authentication required');
//                 }
//                 const manyBooks = await Book.find({}, '_id')
//                 return booksLists.loadMany(
//                     manyBooks.map((book) => {
//                         return book._id
//                     })
//                 )
//             } catch (error) {
//                 return error
//             }
//         }
//     },
//     Book: {
//         author: async parent => {
//             // console.log(parent.author)
//             let bookShelves = await authorLists.load(parent.author)
//             return bookShelves
//         }
//     },
//     BookShelves: {
//         books: async (parent, _, { booksLists }) => {
//             let books = await booksLists.loadMany(parent.books)
//             return books
//         }
//     },
//     Mutation: {
//         authenticate: async (_, args) => {
//             try {
//                 const { username, password } = args
//                 let jwtToken
//                 if (username === 'Dayat' && password === 'Admin') {
//                     jwtToken = token({
//                         username: username
//                     })
//                 }
//                 return jwtToken
//             } catch (error) {
//                 throw new Error(error)
//             }
//         },
//         createBook: async (_, args, { user }) => {
//             try {
//                 if (!user) {
//                     throw new Error('Authentication required');
//                 }
//                 const { form } = args
//                 let newBook = await BookController.createBook(form)
//                 return newBook
//             } catch (error) {
//                 throw new Error(error);
//             }
//         },
//         deleteBook: async (_, args, { user }) => {
//             try {
//                 if (!user) {
//                     throw new Error('Authentication required');
//                 }
//                 const { _id } = args
//                 let newMessage = await BookController.deleteBook(_id)
//                 return newMessage
//             } catch (error) {
//                 throw new Error(error)
//             }
//         },
//         updateBook: async (_, args, { user }) => {
//             try {
//                 if (!user) {
//                     throw new Error('Authentication required');
//                 }
//                 const { _id, form } = args
//                 let newMessage = await BookController.updateBook(_id, form)
//                 return newMessage
//             } catch (error) {
//                 throw new Error(error)
//             }
//         },
//         createBookShelf: async (_, args) => {
//             const { form1 } = args
//             const {name,books}= form1
//             await BookShelf.create({
//                 name,books
//             })
//             return {message:'horee sudah dibuat'}
//         }
//     }
// }

// module.exports = { TypeDefs, Resolvers }