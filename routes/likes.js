const Likes = require('../models/likes')
const express = require('express')
const router = express.Router({ mergeParams: true })
const Photos = require('../models/photos')
const { isLoggedIn } = require('../middleware')
const asyncHandler = require('express-async-handler')

// router.get('/', async (req, res) => {
//   console.log('test')
// })

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const like = new Date()
    console.log('liked photo')
    //console.log(like)
    const photo = await Photos.findById(id)
    const newLike = new Likes({ likes: like })
    newLike.user = req.user
    photo.likes.push(newLike)
    await newLike.save()
    await photo.save()
    res.redirect(`/photos/${id}`)
  })
)

module.exports.likesRouter = router
