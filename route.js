const express = require("express")
const router = express.Router()
const {
    CreateUser,
    LoginUser,
    GetUser,
    DeleteUser,
    UpdateUserCash
} = require('./controller')

const VerifyToken = require('./verify-token')

router.route('/user').post(CreateUser).get(VerifyToken, GetUser).delete(VerifyToken, DeleteUser)

router.route('/login').post(LoginUser)

router.route('/updateCash').post(VerifyToken, UpdateUserCash)

module.exports = router