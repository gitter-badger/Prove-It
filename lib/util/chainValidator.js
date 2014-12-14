'use strict';

var prove = require('../index.js').validators;
var createErrorHandler = require('../errorHandler.js');

module.exports = function ChainedValidatorOptions(path) {
    path = path || '';

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

        if (null == val) {
            if (isRequired === false) {
                return true;
            } else {
                errors.add(path, '{PATH} is a required field', null);
            }
        } else {
            for (var i = 0, len = selectedValidators.length; i < len; i += 1) {
                test = selectedValidators[i];

                try {
                    if (true !== test.validator(val)) {
                        throw new Error();
                    }
                } catch (err) {
                    errors.add(path, test.msg, val);
                }
            }
        }

        errors = errors.get();
        return false === errors || errors[path].message;
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
    for (var name in prove) {
        if (prove.hasOwnProperty(name) && !/test|end|isRequired/.test(name)) {
            chainValidator = createChainValidator(prove[name]);
            if (chainValidator) {
                chainedValidators[name] = chainValidator;
            }
        }
    }

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


    return chainedValidators;
};