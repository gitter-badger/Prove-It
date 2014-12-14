'use strict';

var createErrorHandler = require('../errorHandler.js');
/**
 * Returns a validator function that will test an the structure of an object and run other validators. (Schema).
 *
 * Can accept any number of objects as test params (merges them).
 * @returns a validator that can test against the provided tests.
 */

module.exports = function ObjectValidatorOptions() {
    var tests = {};
    var arg;
    for (var i = 0; i < arguments.length; i += 1) {
        arg = arguments[i];
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                if (null == arg[key].test) {
                    throw new Error('Prove-It: Non test provided at ' + key);
                } else {
                    tests[key] = tests[key] || [];
                    tests[key].push(arg[key].test);
                }
            }
        }
    }

    /**
     * The validator function to test an object.
     *
     * @param obj the object to scan for invalid properties.
     * @returns false if no invalid properties, otherwise returns an array of invalid property names.
     */
    var runTest = function ObjectValidatorRun(obj) {
        obj = obj || {};
        var errors = createErrorHandler();

        var val;
        var test;
        var path;

        for (path in tests) {
            if (tests.hasOwnProperty(path)) {
                val = obj[path];

                for (var i = 0; i < tests[path].length; i += 1) {
                    test = tests[path][i];
                    errors.add(path, test(val), val);
                }
            }
        }

        for (path in obj) {
            if (obj.hasOwnProperty(path)) {
                val = obj[path];

                if (null == tests[path]) {
                    errors.add(path, '{PATH} is not an allowed field', val);
                }
            }
        }

        errors = errors.get();
        return false === errors || {
            message: 'Validation failed',
            name: 'ValidationError',
            errors: errors
        };
    };

    runTest.test = runTest.bind(null);
    return runTest;
};