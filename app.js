if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const ExpressError = require('./utilities/expressError')
const {photoSchema} = require('./joi_schemas')
const {photoRouter} = require("./routes/photos")
const {commentRouter} = require("./routes/comments")
const session = require("express-session");
const flash = require("connect-flash")
const User = require("./models/users");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const userRouter = require("./routes/users")

mongoose.connect('mongodb://localhost:27017/my-pics', 
{useNewUrlParser: true, useUnifiedTopology: true});

app.engine('ejs', ejsMate);

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, 'public')))
app.use(flash());
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mydirtysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true,}
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Database Connected")
});

// Defning our express Router routes 
app.use('/photos', photoRouter);
app.use('/photos/:id/comments', commentRouter);
app.use("/", userRouter)


app.get('/', (req,res) => {
    res.send("hi")
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if(!err.message) err.message = "Something Went Wrong"
    res.status(status).render("error", {err})
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
})