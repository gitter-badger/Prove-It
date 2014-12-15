'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-browserify');

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
        }
    });

    grunt.registerTask('default', ['mochacli', 'browserify']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('build', ['browserify']);
};