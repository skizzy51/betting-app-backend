const express = require("express")
const router = express.Router()
const {
    CreateUser,
    LoginUser,
    GetUser,
    DeleteUser,
    Deposit,
    Debit,
    CreateUserNoExpire,
    LoginNoExpire
} = require('./controller')

const VerifyToken = require('./verify-token')

router.route('/user').post(CreateUser).get(VerifyToken, GetUser).delete(VerifyToken, DeleteUser)

router.route('/user/no-expire').post(CreateUserNoExpire)

router.route('/login').post(LoginUser)

router.route('/login/no-expire').post(LoginNoExpire)

router.route('/deposit').post(VerifyToken, Deposit)

router.route('/debit').post(VerifyToken, Debit)

module.exports = router