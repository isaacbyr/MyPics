const Joi = require("joi");

const photoSchema = Joi.object({
    photos: Joi.object({
        // image: Joi.string().required(),
        location: Joi.string().empty('').default(''),
        caption: Joi.string().empty('').default('')
    })
})

module.exports.photoSchema = photoSchema;

const commentSchema = Joi.object({
    comments: Joi.object({
        body: Joi.string().required().min(1).max(30)
    }).required()
})

module.exports.commentSchema = commentSchema;