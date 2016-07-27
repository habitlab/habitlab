/*global module:false*/
module.exports = function (grunt) {

  var LIVERELOAD_PORT = 35731,
      HTTP_PORT = 9400,
      KARMA_PORT = 9877,
      WATCHED_FILES = [
        'demo/**/*',
        'spec/**/*',
        'src/**/*'
      ];

  // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// jQuery.isInView, v<%= meta.version %>\n' +
        '// Copyright (c) 2014-<%= grunt.template.today("yyyy") %> Michael Heim, Zeilenwechsel.de\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/hashchange/jquery.isinview\n' +
        '\n'
    },

    preprocess: {
      build: {
        files: {
          'dist/jquery.isinview.js': 'src/jquery.isinview.js',
          'dist/amd/jquery.isinview.js': 'src/amd.js'
        }
      },
      interactive: {
        files: {
          'web-mocha/index.html': 'web-mocha/_index.html'
        }
      }
    },

    concat: {
      options: {
        banner: "<%= meta.banner %>"
      },
      build: {
        src: 'dist/jquery.isinview.js',
        dest: 'dist/jquery.isinview.js'
      },
      amd_banner: {
        src: 'dist/amd/jquery.isinview.js',
        dest: 'dist/amd/jquery.isinview.js'
      }
    },

    uglify: {
      options: {
        banner: "<%= meta.banner %>",
        mangle: {
          except: ['jQuery', 'Zepto', 'Backbone', '_']
        },
        sourceMap: true
      },
      amd: {
        src: 'dist/amd/jquery.isinview.js',
        dest: 'dist/amd/jquery.isinview.min.js'
      },
      core: {
        src: 'dist/jquery.isinview.js',
        dest: 'dist/jquery.isinview.min.js'
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['Chrome'],
        port: KARMA_PORT
      },
      test: {
        reporters: ['progress'],
        singleRun: true
      },
      build: {
        reporters: ['progress'],
        singleRun: true
      }
    },

    jshint: {
      components: {
        // Workaround for merging .jshintrc with Gruntfile options, see http://goo.gl/Of8QoR
        options: grunt.util._.merge({
          globals: {
            // Add vars which are shared between various sub-components
            // (before concatenation makes them local)
          }
        }, grunt.file.readJSON('.jshintrc')),
        files: {
          src: ['src/**/*.js']
        }
      },
      concatenated: {
        options: grunt.util._.merge({
          // Suppressing 'W034: Unnecessary directive "use strict"'.
          // Redundant nested "use strict" is ok in concatenated file,
          // no adverse effects.
          '-W034': true
        }, grunt.file.readJSON('.jshintrc')),
        files: {
          src: 'dist/**/jquery.isinview.js'
        }
      }
    },

    'sails-linker': {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileTmpl: '<script src="../%s"></script>',
        // relative doesn't seem to have any effect, ever
        relative: true,
        // appRoot is a misnomer for "strip out this prefix from the file path before inserting",
        // should be stripPrefix
        appRoot: ''
      },
      interactive_spec: {
        options: {
          startTag: '<!--SPEC SCRIPTS-->',
          endTag: '<!--SPEC SCRIPTS END-->'
        },
        files: {
          // the target file is changed in place; for generating copies, run preprocess first
          'web-mocha/index.html': ['spec/**/*.+(spec|test|tests).js']
        }
      }
    },

    focus: {
      demo: {
        exclude: ['build', 'buildDirty']
      },
      demoCi: {
        exclude: ['buildDirty']
      },
      demoCiDirty: {
        exclude: ['build']
      }
    },

    watch: {
      options: {
        nospawn: false
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: WATCHED_FILES
      },
      build: {
        tasks: ['default'],
        files: WATCHED_FILES
      },
      buildDirty: {
        tasks: ['build-dirty'],
        files: WATCHED_FILES
      }
    },

    connect: {
      options: {
        port: HTTP_PORT,
        // For restricting access to localhost only, change the hostname from '*' to 'localhost'
        hostname: '*',
        open: true,
        base: '.'
      },
      livereload: {
        livereload: LIVERELOAD_PORT
      },
      test: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>/web-mocha/',
          livereload: LIVERELOAD_PORT
        }
      },
      testNoReload: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>/web-mocha/',
          keepalive: true
        }
      },
      demo: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>/demo/',
          livereload: LIVERELOAD_PORT
        }
      }
    },

    replace: {
      version: {
        src: ['bower.json', 'package.json'],
        overwrite: true,
        replacements: [{
          from: /"version"\s*:\s*"((\d+\.\d+\.)(\d+))"\s*,/,
          to: function (matchedWord, index, fullText, regexMatches) {
            var version = grunt.option('inc') ? regexMatches[1] + (parseInt(regexMatches[2], 10) + 1) : grunt.option('to');

            if (version === undefined) grunt.fail.fatal('Version number not specified. Use the --to option, e.g. --to=1.2.3, or the --inc option to increment the revision');
            if (typeof version !== "string") grunt.fail.fatal('Version number is not a string. Provide a semantic version number, e.g. --to=1.2.3');
            if (!/^\d+\.\d+.\d+$/.test(version)) grunt.fail.fatal('Version number is not semantic. Provide a version number in the format n.n.n, e.g. --to=1.2.3');

            grunt.log.writeln('Modifying file: Changing the version number from ' + regexMatches[0] + ' to ' + version);
            return '"version": "' + version + '",';
          }
        }]
      }
    },
    getver: {
      files: ['bower.json', 'package.json']
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-sails-linker');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-focus');

  grunt.registerTask('lint', ['jshint:components']);
  grunt.registerTask('hint', ['jshint:components']);        // alias
  grunt.registerTask('test', ['jshint:components', 'karma:test']);
  grunt.registerTask('webtest', ['preprocess:interactive', 'sails-linker:interactive_spec', 'connect:testNoReload']);
  grunt.registerTask('interactive', ['preprocess:interactive', 'sails-linker:interactive_spec', 'connect:test', 'watch:livereload']);
  grunt.registerTask('demo', ['connect:demo', 'focus:demo']);
  grunt.registerTask('build', ['jshint:components', 'karma:build', 'preprocess:build', 'concat', 'uglify', 'jshint:concatenated']);
  grunt.registerTask('ci', ['build', 'watch:build']);
  grunt.registerTask('setver', ['replace:version']);
  grunt.registerTask('getver', function () {
    grunt.config.get('getver.files').forEach(function (file) {
      var config = grunt.file.readJSON(file);
      grunt.log.writeln('Version number in ' + file + ': ' + config.version);
    });
  });

  // Special tasks, not mentioned in Readme documentation:
  //
  // - build-dirty:
  //   builds the project without running checks (no linter, no tests)
  // - demo-ci:
  //   Runs the demo (= "demo" task), and also rebuilds the project on every source change (= "ci" task)
  // - demo-ci-dirty:
  //   Runs the demo (= "demo" task), and also rebuilds the project "dirty", without tests or linter, on every source
  //   change (= "build-dirty"/"ci" cross-over task)
  grunt.registerTask('build-dirty', ['preprocess:build', 'concat', 'uglify']);
  grunt.registerTask('demo-ci', ['build', 'connect:demo', 'focus:demoCi']);
  grunt.registerTask('demo-ci-dirty', ['build-dirty', 'connect:demo', 'focus:demoCiDirty']);

  // Make 'build' the default task.
  grunt.registerTask('default', ['build']);


};
