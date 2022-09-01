const User = require('./models/user')

async function createUser (username, password) {
    try {
        const user = new User({ username, password })
        const allUsers = await User.where('username').equals(username)
        if (allUsers.length > 0) {
            return null
        }
        await user.save()
        return user
    } catch (error) {
        throw error
    }
}

async function loginUser (username) {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        throw error
    }
}

async function deleteUser (id) {
    try {
        const user = await User.findOneAndDelete({_id : id})
        return user
    } catch (error) {
        throw error
    }
}

async function getUserById (id) {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        throw error
    }
}

async function updateUserCash (id, amount) {
    try {
        const user = await User.findById(id)
        const newCash = user.cash + amount

        const updateUser = await User.updateOne({ _id : id }, { cash : newCash })
        return updateUser.modifiedCount
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    getUserById,
    updateUserCash
}