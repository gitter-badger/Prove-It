'use strict';

var createErrorHandler = require('../errorHandler.js');
var objectValidator = require('./objectValidator.js');

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
        for (var i = 0; i < array.length; i += 1) {
            val = array[i];
            for (var j = 0; j < tests.length; j += 1) {
                test = tests[j];
                errors.add(i, test(val), val);
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