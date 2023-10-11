const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'The name is required']
    },
    password:{
        type:String,
        required: [true,'The name is required']
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User
