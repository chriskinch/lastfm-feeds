module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: {
        dist: '/*!\n'+
               ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n'+
               ' * <%= pkg.repository.url %>\n'+
               ' */\n'
      },
      outputDir: 'dist',
      output : '<%= meta.outputDir %>/<%= pkg.name %>',
      outputMin : '<%= meta.outputDir %>/<%= pkg.name.replace("js", "min.js") %>'
    },

    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: [
          'src/last.fm.feeds.js'
        ],
        dest: '<%= meta.output %>.js'
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner.dist %>'
        },
        files: {
          '<%= meta.outputDir %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      files: ['Gruntfile.js', 'src/']
    },


  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['concat','uglify']);

};