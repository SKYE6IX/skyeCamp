// Setting Up the enviroment 
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}




const express = require('express')
const app = express();
const port = process.env.PORT || 8080 ;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utility/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';



//Requireing campgrounds routes
const campgroundRoutes = require('./routes/campgrounds');

//Requiring review routes
const reviewRoutes = require('./routes/review');

//Requiring user routes
const userRoutes = require('./routes/user');


// 'mongodb://localhost:27017/yelp-camp'
//connecting mongoose to mongo db
mongoose.connect(dbUrl)
.then(()=> {
    console.log('Connection Open')
})
.catch((err)=>{
    console.log('Oh No Error!!')
    console.log(err);
})




// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', ()=>{
//     console.log('Database Connected');
// })



// MIDDLEWARE OR APP SETTINGS

//this give access to the data from the form
app.use(express.urlencoded({extended: true}))

// override method for put and delete method
app.use(methodOverride('_method'))

//setting up view dir to be able to open from any folder
app.set('views', path.join(__dirname, 'views'));

// templating settings
app.set('view engine', 'ejs');

//adding more functionality to our ejs... like the partia(ejsMate is a tool)
app.engine('ejs', ejsMate);

//To able to use static like (js,css)
app.use(express.static(path.join(__dirname, 'public')));


//session configure

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

 store.on('error', function (e){
     console.log('session store erroe', e);
});

const sessionConfig = {
    store,
    name: 'sesssion',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//initialize flash message
app.use(flash());

//initialize passport user
app.use(passport.initialize());
app.use(passport.session());

//connecting passport-local with user schema
passport.use(new localStrategy(User.authenticate()));

//Getiing user into a session to make them stay log in
passport.serializeUser(User.serializeUser());
//Get user out of session when they log out
passport.deserializeUser(User.deserializeUser())


// this middleware automatically have acess to all template and routes;
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // This help to show log in and out when it neccessary. like user helper(but needed to be run in our template)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Mongo injection protection  
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
);


// Setting Up ContentSecurityPolicy with HELMET
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/skyecamp/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//ROUTES

//Home
app.get('/', (req, res) => {
    res.render('home')
})

//Campground Routes
app.use('/campgrounds', campgroundRoutes);

//Review routes
app.use('/campgrounds', reviewRoutes);

//User routes
app.use('/', userRoutes);




// Using the Error class to deal with url route that isn't recoqnize
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404 ))
})

//Setting up error handler (middleware)
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.mesage) err.mesage = 'Oh no, Something went wrong!'
    res.status(statusCode).render('error', {err});

})

//Run server
app.listen(port, ()=>{
    console.log('Connection Open')
})