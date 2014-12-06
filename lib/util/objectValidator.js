'use strict';

/**
 * Returns a validator function that will test an the structure of an object and run other validators. (Schema).
 *
 * Can accept any number of objects as test params (merges them).
 * @returns a validator that can test against the provided tests.
 */

module.exports = function ObjectValidatorOptions() {
    var tests = {};
    var arg;
    for (var i = 0, len = arguments.length; i < len; i += 1) {
        arg = arguments[i];
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                if (null == arg[key].test) {
                    throw new Error('Prove-It: Non test provided at ' + key);
                } else {
                    tests[key] = arg[key].test;
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
        var errors = {};
        var val;
        var path;
        var errPath;
        var message;

        for (path in tests) {
            if (tests.hasOwnProperty(path)) {
                val = obj[path];
                message = tests[path](val);

                if (true !== message) {
                    if (message.errors) {
                        for (errPath in message.errors) {
                            if (message.errors.hasOwnProperty(errPath)) {
                                val = message.errors[errPath];
                                errors[[path, errPath].join('.')] = val;
                            }
                        }
                    } else {
                        errors[path] = { message: message, value: val };
                    }
                }
            }
        }

        for (path in obj) {
            if (obj.hasOwnProperty(path)) {
                val = obj[path];

                if (null == tests[path]) {
                    errors[path] = {
                        message: [path + ' is not an allowed field'],
                        value: val
                    };
                }
            }
        }

        return 0 === Object.keys(errors).length || {
                message: 'Validation failed',
                name: 'ValidationError',
                errors: errors
            };
    };

    runTest.test = runTest.bind(null);
    return runTest;
};