const express = require("express");
const router = express.Router()
const User = require("../models/users")
const passport = require("passport")
const Photos = require("../models/photos")

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", async(req, res) => {
   const {firstName, lastName, email, username, password} = req.body;
   console.log(req.body.password);
   const user = new User({username, firstName, lastName, email});
   console.log(user)
   const regUser = await User.register(user, password);
   req.login(regUser, err => {
       if (err) return next(err)
   });
   req.flash("success", "Welcome to MyPics!")
   res.redirect("/photos");
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", passport.authenticate('local', {failureFlash:true, failureRedirect: "/login"}), (req, res) => {
    console.log(req.user)
    const redirectUrl = req.session.returnTo || "/photos"
    req.flash("success", `Welcome ${req.user.firstName}!`);
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!")
    res.redirect("/photos")
})

router.get("/:id/profile", async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id)
    const photos = await Photos.find({user: user})
    console.log(photos)
    res.render("users/profile", {user, photos})
})

module.exports = router;