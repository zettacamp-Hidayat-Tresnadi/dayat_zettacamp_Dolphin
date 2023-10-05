const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const { bookTypeDefs, bookResolvers } = require('./schemas/bookSchema')
const { authentication } = require('./middleware/authentication')
const app = express();
const port = 4000;
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/'
const database = 'book-Purchasing-API'
const { booksListsLoader, authorListLoader, bookshelfLoader } = require('./loader/dataLoader')

mongoose.connect(`${url}${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

    .then(() => {
        console.log('Connected to MongoDB version 4.4.24')
    })
    .catch((error) => {
        console.log(error)
    })

mongoose.set('debug', true)

const server = new ApolloServer({
    typeDefs: bookTypeDefs,
    resolvers: bookResolvers,
    context: async ({ req }) => {
        let user
        try {
            user = await authentication(req)
            return { user, booksListsLoader, authorListLoader, bookshelfLoader }
        } catch (error) {
            if (error.name === 'Please login first') {
                user = 'Please login first'
            }
            else if (error.name === 'Invalid Token') {
                user = 'Invalid Token'

            }
            else if (error.name === 'TokenExpiredError') {
                user = 'Please do relogin'
            }
            return { user, booksListsLoader, authorListLoader, bookshelfLoader }
        }
    }
})
server.applyMiddleware({ app })

app.listen(port, function () {
    console.log(`GraphQL Server running at http://localhost:${port}/graphql`);
});

