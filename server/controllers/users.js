const { baseUrl } = require('../env')
const User = require('../db-models/users')
const UserHelpers = require('../helpers/users')

exports.getUserList = async (req, res) => {
    const users = await User.find()
    const results = users.map(user => user.toResult(req.query.fieldsets || ['basic']))
    res.send(results)
}

exports.getUser = async function (req, res) {
    const user = await User.findById(req.params.id)
    if (user) {
        res.send(user.toResult(req.query.fieldsets))
    } else {
        res.sendStatus(404)
    }
}

exports.createUser = async function (req, res) {
    const existing = await User.find({
        email: req.body.email
    })

    if (existing.length > 0) {
        res.status(400)
        res.send("A user with that email already exists. Try another!")
    } else {
        // hash password here req.password hash
        const user = new User(req.body)
        await user.save()

        res.status(200)
        res.set('location', baseUrl + '/api/users/' + user._id)
        res.send(user.toResult(['basic']).basic)
    }
}

exports.updateUser = async (req, res) => {
    //make sure the user is authenticated
    if (!req.user) return res.sendStatus(401)
    // user can only update their own record not someone else's
    const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body)
    res.send("User updated")
}

// exports.deleteUser = async (userId) => {
//     return await User.findByIdAndDelete(userId)
//     res.send(200)
// }

exports.deleteUser = async function (req, res) {
    await User.findByIdAndDelete(req.params.id)
}

