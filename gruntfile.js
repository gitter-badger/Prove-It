'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        mochacli: {
            options: {
                harmony: true,
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
                    transform: ['uglifyify']
                }
            }
        }
    });

    grunt.registerTask('default', ['mochacli', 'browserify']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('build', ['browserify']);
};