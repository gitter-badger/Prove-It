'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-plato');

    grunt.initConfig({
        mochacli: {
            options: {
                reporter: 'spec'
            },
            all: 'test/**/*Test.js'
        },

        browserify: {
            dist: {
                files: {
                    'bin/prove-it.min.js': ['lib/index.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'prove'
                    },
                    transform: ['uglifyify']
                }
            }
        },

        plato: {
            dist: {
                options: {
                    title: 'Prove-It',
                    jshint : grunt.file.readJSON('.jshintrc'),
                    exclude: /\.min\.js$/
                },
                files: {
                    'bin/reports': ['lib/**/*.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['mochacli', 'browserify']);
    grunt.registerTask('build', ['browserify']);
    grunt.registerTask('report', ['plato']);
};