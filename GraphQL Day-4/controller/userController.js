const User = require('../model/userSchema')
const { token } = require('../helper/index')
const bcrypt = require('bcryptjs');
class UserController {
    static async getAllUsers() {
        try {
            const users = await User.find({})
            return users
        } catch (error) {
            console.log(error)
        }
    }
    static async createUser(userInput) {
        try {
            const { username, password, firstName, lastName } = userInput
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            let newUser = await User.create({
                username, password: hash, firstName, lastName
            })
            return newUser
        } catch (error) {
            console.log(error)
        }
    }
    static async getUserById(userId) {
        try {
            const { _id } = userId
            let user = await User.findOne({ _id: _id })
            return user
        } catch (error) {
            console.log(error)
        }
    }
    static async login(dataUser) {
        try {
            const { username, password } = dataUser
            if (!username || !password) {
                throw { name: 'data empty' }
            }
            let user = await User.findOne({ username: username})
            if(!user){
                throw { name: 'wrong credentials' }
            }
            let authenPassword = bcrypt.compareSync(password, user.password);
            if (!authenPassword) {
                throw { name: 'wrong credentials' }
            }
            let encodedToken = token({
                _id: user._id
            })

            return encodedToken
        } catch (error) {
            if (error.name === 'data empty') {
                throw { message: 'please fill requirement data' }
            }
            else if (error.name === 'wrong credentials') {
                throw { message: 'your username or password wrong' }
            }
            throw error
        }
    }
}
module.exports = UserController