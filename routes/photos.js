const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Photos = require('../models/photos');
const {validatePhoto, isLoggedIn, isPhotoCreater} = require("../middleware.js")
const multer  = require('multer')
const {storage} = require("../cloudinary")
const upload = multer({ storage })
const Users = require("../models/users")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapbox_token = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapbox_token})

router.get("/:id/location", async(req, res) => {
    const {id} = req.params;
    const photo = await Photos.findById(id)
    res.render("photos/mymap", {photo})
})

router.get("/locations", async(req, res) => {
    const photos = await Photos.find({})
    res.render("photos/map", {photos})
})

//index page
router.get("/", asyncHandler(async(req, res) => {
    const photos = await Photos.find({}).populate("comments").populate("user");  
    const users = await Users.find({})
    console.log(photos);
    res.render('photos/index', {photos, users})
}))

// create new photo
router.get("/new", isLoggedIn, asyncHandler(async(req, res) => {
    const {id} = req.params;
    const photos = await Photos.findById(id);
    res.render("photos/new",{photos})
}))

// post new photo 
router.post('/', isLoggedIn, upload.array("image"), validatePhoto, asyncHandler(async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.photos.location,
        limit: 1
    }).send()
    const photos = new Photos(req.body.photos)
    photos.geometry = geoData.body.features[0].geometry;
    photos.user = req.user;
    photos.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    await photos.save().then(() => console.log(photos))
    req.flash("success", "Successfully added new photo!")
    res.redirect('/photos')
}))

// show page
router.get('/:id', asyncHandler(async(req, res) => {
    const {id} = req.params;
    const photo = await Photos.findById(id).populate({
       path: 'comments',
       populate: {
           path: "user"
       }
        }).populate("users")
    console.log(photo.images)
    res.render('photos/show', {photo})
}))

// edit form
router.get('/:id/edit', isPhotoCreater, isLoggedIn, asyncHandler(async(req, res) => {
    const {id} = req.params;
    const photo = await Photos.findById(id)
    console.log(photo)
    res.render("photos/edit", {photo})
}))

// posting edited photo
router.put("/:id", validatePhoto, isPhotoCreater, asyncHandler(async(req, res) => {
    const {id} = req.params
    console.log(req.body.photos)
    const photo = await Photos.findByIdAndUpdate(id, {...req.body.photos})
    await photo.save();
    console.log(photo)
    req.flash("success", "Successfully updated photo!")
    res.redirect(`/photos/${id}`)
}))

// deleting a post
router.delete("/:id", isLoggedIn, isPhotoCreater , asyncHandler(async(req, res) => {
    const {id} = req.params
    const photo = await Photos.findByIdAndDelete(id);
    console.log(photo)
    req.flash("success", "Successfully deleted photo!")
    res.redirect("/photos")
}))


module.exports.photoRouter = router;