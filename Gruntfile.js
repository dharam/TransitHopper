module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/javascripts/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    concat: {
      dist: {
        src: ['public/javascripts/google-maps.js', 'public/javascripts/location-service.js'],
        dest: 'public/javascripts/<%= pkg.name %>.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {
          jQuery: true,
          module: true,
          require: true
        },
      },
      beforeconcat: ['public/javascripts/location-service.js', 'api/*.js']
    }
  });

//Js goodness
  grunt.loadNpmTasks('grunt-contrib-jshint');

  //Concat
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Uglify the js
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};