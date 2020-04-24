const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
})

schema.methods.toResult = function () {
  return {
    id: this._id,
    title: this.title,
    date: this.date,
    description: this.description,
  }
}

module.exports = mongoose.model('Event', schema)