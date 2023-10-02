const { decoded } = require("../helper")

async function authentication(req, res, next) {
    try {
        if(!req.headers.authentication){
            throw {name:'cant login'}
        }
        let authenticationCode = req.headers.authentication.split(" ")[1]
        let userData = await decoded(authenticationCode)
        return userData
    } catch (error) {
        throw error
    }
}

module.exports = { authentication }