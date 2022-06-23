
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

//index page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})   
};

 //creating new camp form page
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/createPage')
};

 // creating new camp action route
module.exports.createNewCamp = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

 //details page
module.exports.detailsPage = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
       }).populate('author');
    if(!campground){
       req.flash('error', 'Campground not found!');
       res.redirect('/campgrounds');
   }
    res.render('campgrounds/detailsPage', {campground})
};

//editing campground form page using asyc works alot better in this .
module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground){
       req.flash('error', 'Campground not found!');
       res.redirect('/campgrounds');
   }
    res.render('campgrounds/editPage', {campground})
};

 // Updating camp action route
module.exports.updateCampgroud = async (req, res ) =>{
    const {id} = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } } );
    }
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

 //deleting camp action route
module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}


