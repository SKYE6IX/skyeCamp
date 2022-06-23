
const User = require('../models/user');

//Register page
module.exports.renderNewRegister = (req, res) => {
    res.render('users/register');
};

//Create New User
module.exports.createNewUser = async (req, res, next) => {
    try{
        const {username, password, email} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        //logging user in after registration.
        req.login(registerUser, err => {
            if(err) return next(err);
        //****************** */
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('campgrounds');
        })
       
    }catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

//Login Page
module.exports.renderLoginPage = (req, res) => {
    res.render('users/login')
};

//Login User
module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome Back !');
    const redirect = req.session.returnTo || 'campgrounds';
    delete req.session.returnTo;
    res.redirect(redirect);
}

//Logout User
module.exports.userLogout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};