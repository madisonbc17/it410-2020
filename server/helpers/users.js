const User = require('../db-models/users')

exports.getUserList = () => {
    return User.find()
}

exports.getUserById = async (userId) => {
    return User.findById(userId)
}

exports.getUserByEmail = async (email) => {
    return User.findOne({email})
}

exports.createUser = async (userWithHashedPassword) => {
    const existing = await User.find({
        email: userWithHashedPassword.email
    })
    if (existing.length > 0) {
        return false
    } else {
        const newUser = new User(userWithHashedPassword)
        await newUser.save()
        return newUser
    }
}

exports.updateUser = async (user) => {
    return User.findOneAndUpdate(user.id, user)
}

exports.deleteUser = async (userId) => {
    return User.findByIdAndDelete(userId)
}
