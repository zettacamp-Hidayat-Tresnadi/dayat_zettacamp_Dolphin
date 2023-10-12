const express = require('express');
const { ApolloServer,ApolloError } = require('apollo-server-express')
const { TypeDefs, Resolvers } = require('./schemas/Schema')
const { authentication } = require('./middleware/authentication')
const app = express();
const jwt = require('jsonwebtoken');
const route = require('./route/index')
const port = 4000;
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/"
const database = "testing-final-task-2"
const { playList,songLoader } = require('./loader/dataLoader')
// const { bookShelfLoader, booksLists,authorLists } = require('./loader/dataLoader')

const { errorHandler } = require('./middleware/handleError');

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
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', route);
// app.use('*', function(_){
//     throw {name:'Not Found'}
// });
app.use(errorHandler)

const server = new ApolloServer({
    typeDefs: TypeDefs,
    resolvers: Resolvers,
    context: async ({ req }) => {
        let user
        try {
            if(!req.headers.authentication){
                user='Token empty'
            }
            let authenticationCode = req.headers.authentication.split(" ")[1]
            let decodedToken = jwt.verify(authenticationCode, 'ini rahasia');
            user=decodedToken
            return {user,playList,songLoader}
        } catch (error) {
            if(error.name==='JsonWebTokenError'){
                user ='Invalid Token'
            }
            else if(error.name==='TokenExpiredError'){
                user = 'Relogin'
            }
            return {user}
        }
    }
})
server.applyMiddleware({ app })

app.listen(port, function (err) {
    console.log(`GraphQL Server running at http://localhost:${port}/graphql`);
});

