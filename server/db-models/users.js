const mongoose = require('mongoose')

const User = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  password: String, //hashed
  teacher: Boolean
})

User.methods.toResult = function () {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phoneNumber: this.phoneNumber,
    teacher: this.teacher,
    id: this.id
  }
}

module.exports = mongoose.model('User', User)

