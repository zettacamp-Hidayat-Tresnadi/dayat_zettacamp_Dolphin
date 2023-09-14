const { token } = require('../helper/index')
class UserController {
    static async login(req,res,next){
        try {
            const user = req.body.user
            const password =req.body.password
            if (!user || !password) {
                throw { name: 'Unauthorized' }
            }
            else if (user !== 'Admin' || password !== 'Dayat') {
                throw { name: 'Wrong Credentials' }
            }
            let jwtToken = token({
                user:user
            })
            res.status(200).json({jwtToken})
        } catch (error) {
            next(error)
        }
    }
}
module.exports={UserController}