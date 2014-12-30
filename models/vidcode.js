var mongoose = require('mongoose');

// define the schema for our user model
var vidcodeSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    title: {type: String, trim: true},
    desc: {type: String, trim: true},
    token:  {type: String, trim: true}
});

module.exports = mongoose.model('Vidcode', vidcodeSchema);
