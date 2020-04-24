const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: String,
  queryTitle: String,
  description: String,
  dueDate: Date
})

schema.methods.toResult = function () {
  return {
    title: this.title,
    queryTitle: this.queryTitle,
    description: this.description,
    dueDate: this.Date,
    id: this._id
  }
}

module.exports = mongoose.model('Assignment', schema)