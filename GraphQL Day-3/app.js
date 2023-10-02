const express = require('express');
const { ApolloServer } = require('apollo-server-express')
// const {makeExecutableSchema}=require('graphql-tools')
// const{applyMiddleware}=require('graphql-middleware')
const { bookTypeDefs, bookResolvers } = require('./schemas/bookSchema')
const { authentication } = require('./middleware/authentication')
const app = express();
const route = require('./routes/index')
const port = 4000;
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/"
const database = "book-Purchasing-Test-lala"

// const { errorHandler } = require('./middleware/handleError');

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

mongoose.set('debug',true)    
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// app.use('/', route);
// app.use('*', function(_){
//     throw {name:'Not Found'}
// });
// app.use(errorHandler)

const server = new ApolloServer({
    typeDefs: bookTypeDefs,
    resolvers: bookResolvers,
    context: async ({ req }) => {
        try {
        const user =await authentication(req)
        return { user }   
        } catch (error) {
            throw error 
        }
    }
})
server.applyMiddleware({ app })

app.listen(port, function (err) {
    console.log(`GraphQL Server running at http://localhost:${port}/graphql`);
});

