'use strict';

var prove = require('../index.js');
var validator = require('./validator.min.js');
var fillRight = function(fn){
    var args = [].slice.call(arguments, 1);
    return function(){
        return fn.apply(this, [].slice.call(arguments, 0).concat(args));
    };
};

/**
 * Validator JS Documentation:
 * https://www.npmjs.org/package/validator
 */
prove.extend({
    equals: function(comparison){
        return {
            validator: fillRight(validator.equals, comparison),
            msg: '{PATH} should be ' + comparison
        };
    },

    contains: function(seed){
        return {
            validator: fillRight(validator.contains, seed),
            msg: '{PATH} should contain ' + seed
        };
    },

    matches: function(pattern, modifiers){
        return {
            validator: fillRight(validator.matches, pattern, modifiers),
            msg: '{PATH} should match ' + pattern
        };
    },

    isEmail: function(){
        return {
            validator: validator.isEmail,
            msg: '{PATH} should be an email'
        };
    },

    isURL: function(options){
        return {
            validator: fillRight(validator.isURL, options),
            msg: '{PATH} should be a URL'
        };
    },

    isFQDN: function(options){
        return {
            validator: fillRight(validator.isFQDN, options),
            msg: '{PATH} should be a fully qualified domain name'
        };
    },

    isIP: function(version){
        return {
            validator: fillRight(validator.isIP, version),
            msg: '{PATH} should be an ipv' + version + ' address'
        };
    },

    isAlpha: function(){
        return {
            validator: validator.isAlpha,
            msg: '{PATH} should only contain letters'
        };
    },

    isNumeric: function(){
        return {
            validator: validator.isNumeric,
            msg: '{PATH} should only contain numbers'
        };
    },

    isAlphanumeric: function(){
        return {
            validator: validator.isAlphanumeric,
            msg: '{PATH} should only contain letters and numbers'
        };
    },

    isBase64: function(){
        return {
            validator: validator.isBase64,
            msg: '{PATH} should be base64 encoded'
        };
    },

    isHexadecimal: function(){
        return {
            validator: validator.isHexadecimal,
            msg: '{PATH} should be hexadecimal'
        };
    },

    isHexColor: function(){
        return {
            validator: validator.isHexColor,
            msg: '{PATH} should be a hex color'
        };
    },

    isLowercase: function(){
        return {
            validator: validator.isLowercase,
            msg: '{PATH} should be lowercase'
        };
    },

    isUppercase: function(){
        return {
            validator: validator.isUppercase,
            msg: '{PATH} should be uppercase'
        };
    },

    isInt: function(){
        return {
            validator: validator.isInt,
            msg: '{PATH} should be an integer'
        };
    },

    isFloat: function(){
        return {
            validator: validator.isFloat,
            msg: '{PATH} should be a float'
        };
    },

    isDivisibleBy: function(num){
        return {
            validator: fillRight(validator.isDivisibleBy, num),
            msg: '{PATH} should be divisible by ' + num
        };
    },

    isNull: function(){
        return {
            validator: validator.isNull,
            msg: '{PATH} should be null'
        };
    },

    isLength: function(min, max){
        return {
            validator: fillRight(validator.isLength, min, max),
            msg: (max)?
                '{PATH} should be within ' + min + '-' + max + ' characters long':
                '{PATH} should be more than ' + min + ' characters long'
        };
    },

    isByteLength: function(min, max){
        return {
            validator: fillRight(validator.isByteLength, min, max),
            msg: (max)?
                '{PATH} should be within ' + min + '-' + max + ' bytes':
                '{PATH} should be more than ' + min + ' bytes'
        };
    },

    isUUID: function(version){
        return {
            validator: fillRight(validator.isUUID, version),
            msg: '{PATH} should be a UUID version ' + version
        };
    },

    isDate: function(){
        return {
            validator: validator.isDate,
            msg: '{PATH} should be a date'
        };
    },

    isAfter: function(date){
        return {
            validator: fillRight(validator.isAfter, date),
            msg: '{PATH} should be after ' + date
        };
    },

    isBefore: function(date){
        return {
            validator: fillRight(validator.isBefore, date),
            msg: '{PATH} should be before ' + date
        };
    },

    isIn: function(values){
        values = values || [];
        return {
            validator: fillRight(validator.isIn, values),
            msg: (Array.isArray(values))?
                '{PATH} should be ' + values.slice(0, values.length - 1).join(', ') + ' or ' + values[values.length - 1]
                : '{PATH} should be ' + values
        };
    },

    isCreditCard: function(){
        return {
            validator: validator.isCreditCard,
            msg: '{PATH} should be a credit card number'
        };
    },

    isISBN: function(version){
        return {
            validator: fillRight(validator.isISBN, version),
            msg: '{PATH} should be an ISBN'
        };
    },

    isJSON: function(){
        return {
            validator: validator.isJSON,
            msg: '{PATH} should be JSON'
        };
    },

    isMultibyte: function(){
        return {
            validator: validator.isMultibyte,
            msg: '{PATH} should contain one or more multibyte characters'
        };
    },

    isAscii: function(){
        return {
            validator: validator.isAscii,
            msg: '{PATH} should only contain ASCII characters'
        };
    },

    isFullWidth: function(){
        return {
            validator: validator.isFullWidth,
            msg: '{PATH} should contain fullwidth characters'
        };
    },

    isHalfWidth: function(){
        return {
            validator: validator.isHalfWidth,
            msg: '{PATH} should contain halfwidth characters'
        };
    },

    isVariableWidth: function(){
        return {
            validator: validator.isVariableWidth,
            msg: '{PATH} should contain a mixture of fullwidth and halfwidth characters'
        };
    },

    isSurrogatePair: function(){
        return {
            validator: validator.isSurrogatePair,
            msg: '{PATH} should contain surrogate pair characters'
        };
    }
});