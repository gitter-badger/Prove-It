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

    for (var i = 0; i < arguments.length; i += 1) {
        arg = arguments[i];
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                if (null == arg[key]) {
                    tests[key] = tests[key] || [];
                } else if (null != arg[key].test) {
                    tests[key] = tests[key] || [];
                    tests[key].push(arg[key].test);
                } else {
                    throw new Error('Prove-It: Non test provided at ' + key);
                }
            }
        }
    }

    return function ObjectValidatorRun(errors, obj) {
        obj = obj || {};

        var val;
        var test;
        var path;

        for (path in tests) {
            if (tests.hasOwnProperty(path)) {
                val = obj[path];

                for (var i = 0; i < tests[path].length; i += 1) {
                    test = tests[path][i];
                    errors.append({
                        path: path,
                        msg: test(val),
                        val: val
                    });
                }
            }
        }

        for (path in obj) {
            if (obj.hasOwnProperty(path)) {
                val = obj[path];

                if (null == tests[path]) {
                    errors.append({
                        path: path,
                        msg: '{PATH} is not an allowed field',
                        val: val
                    });
                }
            }
        }
    };
};