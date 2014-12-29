// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    username: String,
    social: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    vidcodes: [{}],
    vidcode: {
        email: {type: String, trim: true},
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    instagram: {
        id: String,
        token: String,
        username: String,
        displayName: String,
        IGvideos: {type: Array, default: []}
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.vidcode.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
