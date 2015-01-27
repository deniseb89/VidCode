module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      express: {
        files:  [ '**/*.js', '!**/node_modules/**', '!**/static/js/vendor/**' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      },

      reload: {
        files: [ '**/*', '!**/node_modules/**' ],
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

  grunt.registerTask('server', [ 'express:dev', 'watch' ]);
  grunt.registerTask('default', ['server']);
};
