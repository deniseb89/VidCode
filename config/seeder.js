var mongoose = require('mongoose');
var Unit = require('../models/unit');
var Lesson = require('../models/lesson');



module.exports = {
  check: function() {
    //mongoose.connection.db.collection('units').find({}, function(err, units) {

      Unit.find({}, function(err, units) {
      if (units.length === 0) {

        console.log('no units found, seeding...');

        var fileFailed = false;

        try {

            var seedUnits = require('./seed-units.json');

            mongoose.connection.db.collection('units').insert(seedUnits, function(err, units) {
              if(err){
                console.log(err);
              }
              else{
                console.log("Added units from seed-units.json. Count = " + units.length );
              }
            });

          } catch (e) {
            fileFailed = true;
            console.log("seed-units.json file is not proper JSON");
            console.log(e);
            console.log("Adding default units from seeder.js");
          }

        if(fileFailed){

          var newUnit = new Unit(

          {
            "unitId": 1,
            "unitName": "Filters",
            "lessons": [
              {
                "lessonId": "1-1",
                "name": "JavaScript!",
                "title": "What are we writing? JavaScript!",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "1-2",
                "name": "Play / Pause",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "1-3",
                "name": "Empty",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "1-4",
                "name": "Objects",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
            }]});

          newUnit.save(function(err, unit) {
            console.log('successfully inserted unit: _id:'  + unit._id);
          });


          newUnit = new Unit(

          {
            "unitId": 2,
            "unitName": "Stop Motion",
            "lessons": [
              {
                "lessonId": "2-1",
                "name": "The Power of Code",
                "title": "What are we writing? JavaScript!",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "2-2",
                "name": "Empty",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "2-3",
                "name": "Interval I",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "2-4",
                "name": "Interval II",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
              },
              {
                "lessonId": "2-5",
                "name": "Reverse",
                "title": "How is it changing my video?",
                "content": "Javascript is a programming language"
          }]});

          newUnit.save(function(err, unit) {
            console.log('successfully inserted unit: _id:'  + unit._id);
          });
        }
      }
      else {
        console.log('found ' + units.length + ' existing units!');
      }
    });
  }
};
