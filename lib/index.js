'use strict';

var chainValidator;
var objectValidator;
var arrayValidator;

var validators = {};

/**
 * Main entry into api.
 *
 * @param options
 *
 * @returns Boolean|Array|Object
 * * Boolean: True if all tests pass.
 * * Array: List of error messages from chained validator.
 * * Object: An object with 'errors' with paths as keys and a list of error messages for values.
 */
var prove = function ValidatorOptions(options) {
    if (typeof options === 'string' || options instanceof String || null == options) {
        return chainValidator(options);
    } else if (true === options) {
        return true;
    } else if (options.test) {
        return options;
    } else if (typeof options === 'function') {
        return function (val) {
            return prove(options.call(null, val)).test(val);
        };
    } else if (Array.isArray(options)) {
        return arrayValidator.apply(null, arguments);
    } else if (Object(options) === options) {
        return objectValidator.apply(null, arguments);
    }
};

/**
 * Function (attached to prove) that accepts more validators to merge into the list of validators.
 *
 * @param extensions the object containing the validators to add.
 */
prove.extend = function (extensions) {
    for (var name in extensions) {
        if (extensions.hasOwnProperty(name)) {
            validators[name] = extensions[name];
        }
    }
};

/**
 * Accessor to raw validators.
 *
 * @type {{}}
 */
prove.validators = validators;

module.exports = prove;

if (true === process.browser) {
    global.prove = prove;
}

// Require utilities.
chainValidator = require('./util/chainValidator.js');
objectValidator = require('./util/objectValidator.js');
arrayValidator = require('./util/arrayValidator.js');

// Require default validators.
require('./default/validatorjs.js');
require('./default/index.js');