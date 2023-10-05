const { decoded } = require('../helper')

async function authentication(req) {
    if (!req.headers.authentication) {
        throw { name: 'Please login first' }
    }
    let authenticationCode = req.headers.authentication.split(' ')[1]
    let userData = await decoded(authenticationCode)
    return userData
}

module.exports = { authentication }