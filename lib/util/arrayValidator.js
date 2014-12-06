'use strict';

var objectValidator = require('./objectValidator.js');

/**
 * Validate all values or documents in an array with a given test(s) or object with test(s).
 *
 * Can accept any number of objects/tests as validator params (merges/composes them).
 * @returns a validator that can test against the provided tests against an entire array.
 */
module.exports = function ArrayValidatorOptions(validators) {
    var fieldTests = [];
    var collectionTests = [];

    var validator;
    for (var i = 0, len = validators.length; i < len; i += 1) {
        validator = validators[i];
        if (typeof validator === 'function') {
            if (null != validator.test) {
                fieldTests.push(validator);
            }
        } else if (Object(validator) === validator) {
            collectionTests.push(validator);
        }
    }

    var collectionTest;
    if (0 !== collectionTests.length) {
        collectionTest = objectValidator.apply(null, collectionTests).test;
    }

    var runTest = function ArrayValidatorRun(array) {
        array = array || [];
        var errors = {};

        var val;
        var fieldMessage;
        var collectionMessage;
        var errPath;
        for (var i = 0; i < array.length; i += 1) {
            val = array[i];
            if (null != fieldTests && 0 !== fieldTests.length) {
                for (var j = 0; j < fieldTests.length; j += 1) {
                    fieldMessage = fieldTests[j](val);
                    if (true !== fieldMessage) {
                        errors[i] = { message: fieldMessage, value: val };
                    }
                }
            }
            if (null != collectionTest) {
                collectionMessage = collectionTest(val);
                if (true !== collectionMessage) {
                    for (errPath in collectionMessage.errors) {
                        if (collectionMessage.errors.hasOwnProperty(errPath)) {
                            val = collectionMessage.errors[errPath];
                            errors[[i, errPath].join('.')] = val;
                        }
                    }
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