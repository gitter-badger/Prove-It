/**
 * Created by dylan on 08/10/14.
 */
'use strict';

var prove = require('../index.js');

prove.extend({
    /**
     * Validate a value is less than a max.
     *
     * @param max the maximum value the validator will approve (exclusive)
     *
     * @returns {{validator: validator, msg: string}}
     */
    isLt: function (max) {
        return {
            validator: function (val) {
                return val < max;
            },
            msg: '{PATH} should be less than ' + max
        };
    },

    /**
     * Validate a value is less than or equal too a max.
     *
     * @param max the maximum value the validator will approve (inclusive)
     *
     * @returns {{validator: validator, msg: string}}
     */
    isLte: function (max) {
        return {
            validator: function (val) {
                return val <= max;
            },
            msg: '{PATH} should be less than or equal to ' + max
        };
    },

    /**
     * Validate a value is greater than a min.
     *
     * @param min the minimum value the validator will approve (exclusive)
     *
     * @returns {{validator: validator, msg: string}}
     */
    isGt: function (min) {
        return {
            validator: function (val) {
                return val > min;
            },
            msg: '{PATH} should be greater than ' + min
        };
    },

    /**
     * Validate a value is greater than or equal too a min.
     *
     * @param min the minimum value the validator will approve (inclusive)
     *
     * @returns {{validator: validator, msg: string}}
     */
    isGte: function (min) {
        return {
            validator: function (val) {
                return val >= min;
            },
            msg: '{PATH} should be greater than or equal to ' + min
        };
    },

    /**
     * Validate a value is a String type.
     *
     * @returns {{validator: validator, msg: string}}
     */
    isString: function () {
        return {
            validator: function (val) {
                return typeof val === 'string';
            },
            msg: '{PATH} should be a string'
        };
    },
    /**
     * Validate a value is a Boolean type.
     *
     * @returns {{validator: validator, msg: string}}
     */
    isBoolean: function () {
        return {
            validator: function (val) {
                switch (val) {
                    case '1':
                    case '0':
                    case 1:
                    case 0:
                    case true:
                    case false:
                        return true;
                    default:
                        return false;
                }
            },
            msg: '{PATH} should be -1, 0 or 1'
        };
    },

    /**
     * Validate that value exists and it's length is not 0.
     *
     * @returns {{validator: validator, msg: string}}
     */
    isNotEmpty: function () {
        return {
            validator: function (val) {
                return null != val && 0 < val.length;
            },
            msg: '{PATH} should be non-empty'
        };
    },

    /**
     * Validate that value:
     *      1) is not an empty string.
     *      2) does not contain any invalid postal code characters.
     *      3) is between 0, 16 characters long.
     *
     * @returns {{validator: validator, msg: string}}
     */
    isPostalCode: function () {
        return {
            validator: function (val) {
                return '' !== val &&
                    0 === val.replace(/[a-zA-Z0-9\- \.]/g, '').length &&
                    16 >= val.length;
            },
            msg: '{PATH} should be an be a postal code'
        };
    },

    /**
     * Validate that value:
     *      1) does not contain any non-phonenumber characters.
     *      2) has less than 14 characters (digits only).
     *
     * @returns {{validator: validator, msg: string}}
     */
    isPhoneNumber: function () {
        return {
            validator: function (val) {
                return val.replace(/[^0-9\-\.\(\) \+\/]/, '') === val &&
                    14 > val.replace(/[^0-9]/g, '').length;
            },
            msg: '{PATH} should be a phone number'
        };
    }
});