

const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');


router.route('/register')
// Rigister Page
.get(user.renderNewRegister)
//Create New user
.post(catchAsync(user.createNewUser))

router.route('/login')
    //Login page
    .get(user.renderLoginPage)
    //Login User
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.userLogin);

    
//Logout Routes
router.get('/logout', user.userLogout)


module.exports = router