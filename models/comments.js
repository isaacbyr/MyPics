const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Comment', commentsSchema);

