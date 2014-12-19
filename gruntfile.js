'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.initConfig({
        mocha_istanbul: {
            coveralls: {
                src: 'test/**/*Test.js',
                options: {
                    coverageFolder: 'bin/coverage',
                    coverage:true,
                    check: {
                        lines: 75,
                        statements: 75
                    },
                    root: './lib'
                }
            }
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

    grunt.registerTask('default', ['mocha_istanbul', 'browserify']);
    grunt.registerTask('build', ['browserify']);
    grunt.registerTask('report', ['plato']);
};