'use strict';

var objectValidator = require('./objectValidator.js');

var createErrorHandler = function () {
    var errors = {};
    return {
        add: function (key, newError) {
            var error = errors[key] = errors[key] || {
                message: []
            };
            error.message.push.apply(error.message, newError.message);
            error.value = newError.value;
            return this;
        },
        get: errors
    };
};

/**
 * Validate all values or documents in an array with a given test(s) or object with test(s).
 *
 * Can accept any number of objects/tests as validator params (merges/composes them).
 * @returns a validator that can test against the provided tests against an entire array.
 */
module.exports = function ArrayValidatorOptions(validators) {
    var tests = [];
    var objValidators = [];

    var validator;
    for (var i = 0, len = validators.length; i < len; i += 1) {
        validator = validators[i];
        if (typeof validator === 'function') {
            if (null != validator.test) {
                tests.push(validator.test);
            }
        } else if (Object(validator) === validator) {
            objValidators.push(validator);
        }
    }

    if (0 < objValidators.length) {
        tests.push(objectValidator.apply(null, objValidators));
    }

    var runTest = function ArrayValidatorRun(array) {
        array = array || [];
        var errors = createErrorHandler();

        var val;
        var test;
        var message;
        var errPath;
        for (var i = 0; i < array.length; i += 1) {
            val = array[i];
            for (var j = 0; j < tests.length; j += 1) {
                test = tests[j];
                message = test(val);
                if (true !== message) {
                    if (null != message.errors) {
                        for (errPath in message.errors) {
                            if (message.errors.hasOwnProperty(errPath)) {
                                errors.add([i, errPath].join('.'), message.errors[errPath]);
                            }
                        }
                    } else {
                        errors.add(i,  { message: message, value: val });
                    }
                }
            }
        }

        errors = errors.get;

        return 0 === Object.keys(errors).length || {
            message: 'Validation failed',
            name: 'ValidationError',
            errors: errors
        };
    };

    runTest.test = runTest.bind(null);
    return runTest;
};