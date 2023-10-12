const { decodedWebhook } = require("../helper")

async function authentication(req,res,next) {
    try {
        if(!req.headers.authorization){
            throw {name:'Unauthorized'}
        }
        let authenticationCode = req.headers.authorization.split(" ")[1]
        let userData = await decodedWebhook(authenticationCode)
        console.log(userData)
        if(!userData){
            throw {name:'Unauthorized'}
        }
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { authentication }