const { Schema, model } = require('mongoose')

const User = new Schema({
    username : { type : String, required : true },
    password : { type : String, required : true },
    cash : { type : Number, default : 0 }
},
{ collection : 'users' }
)

const UserModel = model('User', User)

module.exports = UserModel