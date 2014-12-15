'use strict';

var prove = require('../index.js');
var objectValidator = require('./objectValidator.js');
var arrayValidator = require('./arrayValidator.js');

var createErrorHandler = require('../errorHandler.js');

module.exports = function ChainedValidatorOptions(/**Path, Objs...*/) {
    var arrayValidations = null;
    var objectValidations = null;
    var path = [].shift.call(arguments) || '';

    if (typeof path !== 'string' && null != path) {
        [].unshift.call(arguments, path);
    }

    if (0 !== arguments.length) {
        objectValidations = objectValidator.apply(null, arguments);
    }

    //The current list of validators to execute.
    var selectedValidators = [];
    var isRequired = false;

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

        if (null != objectValidations) {
            objectValidations(errors, val);
        }

        if (null != arrayValidations) {
            arrayValidations(errors, val);
        }

        if (null == val) {
            if (false !== isRequired) {
                errors.append(path, '{PATH} is a required field', null);
            }
        } else {
            for (var i = 0, len = selectedValidators.length; i < len; i += 1) {
                test = selectedValidators[i];

                try {
                    if (true !== test.validator(val)) {
                        throw new Error();
                    }
                } catch (err) {
                    errors.append(path, test.msg, val);
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
     * Validate a value is not null or undefined.
     *
     * @param bool if false then it does not check, otherwise value is required. (undefined === true).
     * @returns {{validator: validator, msg: string}}
     */
    chainedValidators.isRequired = function (bool) {
        isRequired = null == bool || bool;
        return chainedValidators;
    };

    /**
     * Accessor to array validator.
     *
     * @returns {Function}
     */
    chainedValidators.every = function () {
        arrayValidations = arrayValidator.apply(null, arguments);
        return chainedValidators;
    };

    /**
     * Alternative access to the chainedValidators function. (Does not have ability to chain).
     *
     * @type {Function} the validation function.
     */
    chainedValidators.test = chainedValidators.bind();

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
    for (var name in prove.validators) {
        if (prove.validators.hasOwnProperty(name) && !/test|every|isRequired/.test(name)) {
            chainValidator = createChainValidator(prove.validators[name]);
            if (chainValidator) {
                chainedValidators[name] = chainValidator;
            }
        }
    }

    return chainedValidators;
};