
const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const campground = require('../controllers/campgrounds')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleWare')
const {storage} = require('../cloudinary');
const multer  = require('multer')
const upload = multer({storage})


router.route('/')
    //index page
    .get(catchAsync(campground.index))
    // creating new camp action route
    .post(isLoggedIn, upload.array('image'), validateCampground,catchAsync(campground.createNewCamp));
   

//creating new camp form page
router.get('/newCamp', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    //details page
    .get(isLoggedIn, catchAsync(campground.detailsPage))
    // Updating camp action route
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampgroud))
    //deleting camp action route
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

//editing campground form page using asyc works alot better in this .
 router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))


 module.exports = router;