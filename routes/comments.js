const Comments = require("../models/comments");
const express = require("express");
const router = express.Router({mergeParams:true});
const Photos =  require("../models/photos");
const {validateComment, isLoggedIn, isCommentCreator} = require("../middleware");
const asyncHandler = require('express-async-handler');

router.post("/",isLoggedIn, validateComment, asyncHandler(async(req, res) => {
    const {id} = req.params
    const photo = await Photos.findById(id)
    const comment = new Comments(req.body.comments)
    comment.user = req.user._id;
    photo.comments.push(comment);
    await comment.save()
    await photo.save()
    console.log(comment)
    req.flash("success", "Added new comment!")
    res.redirect(`/photos/${photo._id}`)
}))

router.delete("/:commentId", isLoggedIn, asyncHandler(async(req, res) => {
    const {id, commentId} = req.params;
    const photo = await Photos.findById(id)
    console.log(photo.comments)
    
    //const photo = await Photos.findByIdAndUpdate({_id: id}, {$pull: {comments: commentId}})
    //await Comments.findByIdAndDelete(commentId)
    req.flash("success", "Deleted Comment")
    res.redirect(`/photos/${photo._id}`)
}))

module.exports.commentRouter = router;
