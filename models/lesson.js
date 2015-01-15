var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Lesson = new mongoose.Schema({
  lessonId: { type: String },
  name: { type: String },
  title: {type: String},
  content: {type: String}
});

module.exports = mongoose.model('Lesson', Lesson);
