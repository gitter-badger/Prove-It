'use strict';

var createErrorHandler = require('./errorHandler.js');
var runObj;
var runArr;
var runFn;

var validators = {};

/**
 * The function that begins a validation chain.
 */
var prove = function ValidatorOptions(/**Path, Objs...*/) {
    var objTest = null;
    var arrTest = null;
    var fnTest = null;

    var path = [].shift.call(arguments) || '';

    if (typeof path !== 'string' && null != path) {
        [].unshift.call(arguments, path);
    }

    if (0 !== arguments.length) {
        objTest = runObj.apply(null, arguments);
    }

    //The current list of validators to execute.
    var selectedValidators = [];
    var isOptional = false;

    /**
     * Function that extends prove with a chain, provide a value for it to evaluate all selected validators.
     *
     * @param val the value to run the selected validators on.
     * @returns {boolean|Array} return true if value is valid, otherwise returns an array of errors.
     */
    var chainedValidators = function ChainedValidatorsRun(val) {
        var errors = createErrorHandler();
        var test;
        var result;

        if (null != objTest) {
            objTest(errors, val);
        } else if (null == val) {
            if (false === isOptional) {
                errors.append({
                    path: path,
                    msg: '{PATH} is a required field',
                    val: null
                });
            }
        } else {
            if (null != arrTest) {
                if (Array.isArray(val)) {
                    arrTest(errors, val);
                } else {
                    errors.append({
                        path: path,
                        msg: '{PATH} should be an array',
                        val: val
                    });
                }
            }

            if (null != fnTest) {
                fnTest(path, errors, val);
            }

            for (var i = 0, len = selectedValidators.length; i < len; i += 1) {
                test = selectedValidators[i];

                try {
                    if (true !== test.validator(val)) {
                        throw new Error();
                    }
                } catch (err) {
                    errors.append({
                        path: path,
                        msg: test.msg,
                        val: val
                    });
                }
            }
        }

        result = errors.finish();
        if (false === result) {
            return true;
        } else if (1 === Object.keys(result).length && null != result[path]) {
            return result[path].message;
        } else {
            return {
                message: 'Validation failed',
                name: 'ValidationError',
                errors: result
            };
        }
    };

    /**
     * Alternative access to the chainedValidators function. (Does not have ability to chain).
     *
     * @type {Function} the validation function.
     */
    chainedValidators.test = chainedValidators.bind();

    /**
     * Validate a value is not null or undefined.
     *
     * @param bool if false then it does not check, otherwise value is required. (undefined === true).
     * @returns {{validator: validator, msg: string}}
     */
    chainedValidators.isOptional = function (bool) {
        isOptional = null == bool || bool;
        return chainedValidators;
    };

    /**
     * Accessor to array validator.
     *
     * @returns {Function}
     */
    chainedValidators.every = function () {
        arrTest = runArr.apply(null, arguments);
        return chainedValidators;
    };

    /**
     * Accessor to function validator.
     *
     * @returns {Function}
     */
    chainedValidators.run = function () {
        fnTest = runFn.apply(null, arguments);
        return chainedValidators;
    };

    /**
     * Util to map a validator so that it adds itself to the current selectedValidators.
     *
     * @param validator the validator to map.
     *
     * @returns {Function}
     */
    var createChainValidator = function (validator) {
        return function () {
            selectedValidators.push(validator.apply(null, arguments));
            return chainedValidators;
        };
    };

    //Attach mapped validators to the chain.
    var chainValidator;
    for (var name in validators) {
        if (validators.hasOwnProperty(name) && !/test|every|run|isOptional/.test(name)) {
            chainValidator = createChainValidator(validators[name]);
            if (chainValidator) {
                chainedValidators[name] = chainValidator;
            }
        }
    }

    return chainedValidators;
};

/**
 * Function (attached to prove) that accepts more validators to merge onto itself.
 *
 * @param newValidators the object containing the validators to add.
 */
prove.extend = function (newValidators) {
    for (var name in newValidators) {
        if (newValidators.hasOwnProperty(name)) {
            validators[name] = newValidators[name];
        }
    }
};

prove.validators = validators;

module.exports = prove;

// Require test runners.
runObj = require('./runner/object.js');
runArr = require('./runner/array.js');
runFn = require('./runner/function.js');

// Require default validators.
require('./default/validatorjs.js');
require('./default/index.js');