const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likesSchema = new Schema({
  likes: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

module.exports = mongoose.model('Like', likesSchema)
