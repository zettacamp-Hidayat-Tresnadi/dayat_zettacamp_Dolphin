const { decoded } = require("../helper")
const { ApolloError } = require('apollo-server-express');

async function authentication(req) {
    try {
        if(!req.headers.authentication){
            throw new ApolloError('Please login first')
        }
        let authenticationCode = req.headers.authentication.split(" ")[1]
        let userData = await decoded(authenticationCode)
        return userData
    } catch (error) {
        console.log( error,'wkwkk')
    }
}

module.exports = { authentication }