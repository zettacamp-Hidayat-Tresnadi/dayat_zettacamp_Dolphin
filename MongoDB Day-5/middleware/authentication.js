async function authentication(req, res, next) {
    try {
        let authenticationCode = req.headers.authorization.split(" ")[1]
        let decodedCode = Buffer.from(authenticationCode, 'base64').toString()
        let user = decodedCode.split(":")[0]
        let password = decodedCode.split(":")[1]

        if (!user || !password) {
            throw { name: 'Unauthorized' }
        }
        else if (user !== 'admin' || password !== 'dayat') {
            throw { name: 'Wrong Credentials' }
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { authentication }