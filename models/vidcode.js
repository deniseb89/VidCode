var mongoose = require('mongoose');

var vidcodeSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    title: {type: String, trim: true},
    desc: {type: String, trim: true},
    token: {type: String, trim: true},
    code: {type: String}
});

module.exports = mongoose.model('Vidcode', vidcodeSchema);
