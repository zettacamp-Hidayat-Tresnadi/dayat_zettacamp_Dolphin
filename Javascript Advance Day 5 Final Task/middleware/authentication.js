const { decoded } = require("../helper")

async function authentication(req, res, next) {
    try {
        if(!req.headers.authorization){
            throw { name: 'Unauthorized' }
        }
        let authenticationCode = req.headers.authorization.split(" ")[1]
        await decoded(authenticationCode)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { authentication }