const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: String,
    filename: String
})

const photoSchema = new Schema({
    images: [imageSchema],
    geometry: {
        type: {
            type: "String",
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    caption: String,
    comments: [
    {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const photo = mongoose.model("Photo", photoSchema)

module.exports= photo;