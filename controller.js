const {
    createUser,
    loginUser,
    deleteUser,
    getUserById,
    deposit,
    debit
} = require('./repository')

const HTTPStatus = require("http-status");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
require('dotenv').config()

function Success(res, message, data = {}) {
    res.status(HTTPStatus.OK).json({ message, data });
}
function Failure(res, code, message, data = {}) {
    res.status(code).json({ message, data });
}
  

async function CreateUser (req, res, next) {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser(username, hashedPassword)
        if (!user) {
            Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'User not created')
            return
        }
        const token = jwt.sign({ id : user._id }, process.env.CIPHER, { expiresIn : '1d' })
        res.status(HTTPStatus.CREATED).json({ message : 'User Created and signed in', token : token })
    } catch (error) {
        next(error)
    }
}

async function CreateUserNoExpire (req, res, next) {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser(username, hashedPassword)
        if (!user) {
            Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'User not created')
            return
        }
        const token = jwt.sign({ id : user._id }, process.env.CIPHER)
        res.status(HTTPStatus.CREATED).json({ message : 'User Created and signed in', token : token })
    } catch (error) {
        next(error)
    }
}

async function LoginUser (req, res, next) {
    try {
        const { username, password } = req.body
        const user = await loginUser(username)
        if (!user) {
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid username')
            return
        }
        if (await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ id : user._id }, process.env.CIPHER, { expiresIn : '1d' })
            res.json({ message : 'logged in', token : token })
        }else{
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid password')
            return
        }
    } catch (error) {
        next(error)
    }
}

async function LoginNoExpire (req, res, next) {
    try {
        const { username, password } = req.body
        const user = await loginUser(username)
        if (!user) {
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid username')
            return
        }
        if (await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ id : user._id }, process.env.CIPHER)
            res.json({ message : 'logged in', token : token })
        }else{
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid password')
            return
        }
    } catch (error) {
        next(error)
    }
}

async function GetUser (req, res, next) {
    try {
        const user = req.user
        const getUser = await getUserById(user._id)
        getUser
        ? res.json({ user : user })
        : res.json(null)
    } catch (error) {
        next(error)
    }
}

async function DeleteUser (req, res, next) {
    try {
        const user = req.user
        const deletedUser = await deleteUser(user._id)
        deletedUser
        ? Success(res, 'User deleted', deletedUser)
        : Failure(res, HTTPStatus.NOT_IMPLEMENTED, 'Error deleting user')
    } catch (error) {
        next(error)
    }
}

async function Deposit (req, res, next) {
    try {
        const user = req.user
        const { amount } = req.body
        const userUpdate = await deposit(user._id, amount)
        userUpdate > 0
        ? Success(res, 'Cash successfully deposited')
        : Failure(res, HTTPStatus.NOT_MODIFIED,)
    } catch (error) {
        next(error)
    }
}

async function Debit (req, res, next) {
    try {
        const user = req.user
        const { amount } = req.body
        const userUpdate = await debit(user._id, amount)
        userUpdate > 0
        ? Success(res, 'Cash successfully debited')
        : Failure(res, HTTPStatus.NOT_MODIFIED,)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateUser,
    CreateUserNoExpire,
    LoginUser,
    LoginNoExpire,
    GetUser,
    DeleteUser,
    Deposit,
    Debit
}