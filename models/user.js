

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//creating a schema
const UserSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    }
});

//Using passport plugin to make a user and password for us, which will be hash before storing to data base;

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);