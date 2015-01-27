var mongoose = require('mongoose');
var Lesson = require('./lesson');
var ObjectId = mongoose.Schema.ObjectId;

var unitSchema = new mongoose.Schema({
  unitId: { type: String },
  name: { type: String },
  lessons: [{}]
}, {collection: 'units'});

module.exports = mongoose.model('Unit', unitSchema);
