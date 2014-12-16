'use strict';

/**
 * Validate all values or documents in an array with a given test(s) or object with test(s).
 *
 * Can accept any number of objects/tests as validator params (merges/composes them).
 * @returns a validator that can test against the provided tests against an entire array.
 */
module.exports = function ArrayRunner() {
    var tests = [];

    var arg;
    for (var i = 0; i < arguments.length; i += 1) {
        arg = arguments[i];
        if (null != arg.test) {
            tests.push(arg.test);
        } else {
            throw new Error('Prove-It: Non test provided to array validator');
        }
    }

    return function (errors, arr) {
        var val;
        var test;

        for (var i = 0; i < arr.length; i += 1) {
            val = arr[i];
            for (var j = 0; j < tests.length; j += 1) {
                test = tests[j];
                errors.append({
                    path: i,
                    msg: test(val),
                    val: val
                });
            }
        }
    };
};