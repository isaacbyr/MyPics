const {photoSchema, commentSchema} = require('./joi_schemas')
const Photos = require("./models/photos");
const Comments = require("./models/comments");

const ExpressError = require('./utilities/expressError')

const validatePhoto = (req, res, next) => {
    const {error} = photoSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateComment = (req, res, next) => {
    const {error} = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in")
        return res.redirect("/login")
    }
    next();
}

const isPhotoCreater = async(req, res, next) => {
    const {id} = req.params;
    const photo = await Photos.findById(id)
    if(!photo.user.equals(req.user._id)) {
        req.flash("error", "You dont have permission")
        res.redirect("/photos")
    }
    next();
}

const isCommentCreator = async(req, res, next) => {
    const {id, commentId} = req.params;
    const comment = await Comments.findById(commentId)
    console.log(comment)
    if(!comment.user.equals(req.user._id)) {
        req.flash("error", "You dont have permission")
        res.redirect(`/photos/${id}`)
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn; 
module.exports.validateComment = validateComment;
module.exports.validatePhoto = validatePhoto;
module.exports.isPhotoCreater = isPhotoCreater;
module.exports.isCommentCreator = isCommentCreator;