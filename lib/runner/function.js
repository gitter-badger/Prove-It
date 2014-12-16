'use strict';

/**
 * Injects {PATH} and {VALUE} into an error message.
 *
 * @param path the path to set.
 * @param value the vlaue to set.
 * @returns {Function} a function to accept the message.
 */
var inject = function (path, value) {
    return function (msg) {
        return msg.replace(/\{VALUE\}/g, value).replace(/\{PATH\}/g, path);
    };
};

/**
 * Runs a function that returns a validator, then returns the ran validator.
 *
 * @returns {Function}
 */
module.exports = function FunctionRunner(/*Functions...**/) {
    var functions = [].slice.call(arguments);
    return function (path, errors, val) {
        var test;
        var result;
        for (var i = 0; i < functions.length; i += 1) {
            test = functions[i](val);
            if (null != test && null != test.test) {
                result = test.test(val);
                if (true !== result) {

                    if (Array.isArray(result)) {
                        result = result.map(inject(path, val));
                    }

                    errors.append({
                        path: '',
                        msg: result,
                        val: val
                    });
                }
            }
        }
    };
};
