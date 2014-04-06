module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      express: {
        files:  [ 'Gruntfile.js', 'web.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      },

      reload: {
        files: [ '**/*' ],
        options: {
          livereload: true
        }
      }
    },

    express: {
      options: {
        port: 8080
      },
      dev: {
        options: {
          script: 'web.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('server', [ 'express:dev' ]);
  grunt.registerTask('default', ['server']);
};
