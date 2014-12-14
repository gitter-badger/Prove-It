'use strict';

var should = require('should');
var prove = require('../lib/index.js');
var common = require('../lib/commonValues.js');

var test = function (options) {
    if (!options.check) {
        throw new Error('No validator specified for test');
    }

    if (options.valid) {
        options.valid.forEach(function (value) {
            var validator = prove('[ ' + options.check + ' ]')[options.check].apply({}, options.args || []);
            var message = validator(value);
            if (true !== message) {
                throw new Error((message.errors || message).toString());
            }
        });
    }
    if (options.invalid) {
        options.invalid.forEach(function (value) {
            var validator = prove()[options.check].apply({}, options.args || []);
            var message = validator(value);
            if (true === message) {
                throw new Error('[ ' + options.check + ' ]' + ' should have failed!');
            }
        });
    }
};

//TESTS
describe('Default Validators', function () {
    it('"error" should always add an error message', function () {
        test({
            check: 'error',
            valid: [
                common.valueNull
            ],
            invalid: [
                common.integerNumber,
                common.floatNumber,
                common.numericExponentNumber,
                common.booleanTrue,
                common.booleanFalse,
                common.booleanInt0,
                common.booleanInt1,
                common.asciiString,
                common.asciiStringWithApostrophe,
                common.slavicString,
                common.russianString,
                common.kanjiString,
                common.hiraganaString,
                common.aftricanString,
                common.arabicString,
                common.newLineNString,
                common.newLineNRString,
                common.presentationalHtml,
                common.scriptHtml,
                common.otherHtml,
                common.valueEmptyString,
                common.numericStringNumber,
                common.booleanString0,
                common.booleanString1,
                common.typeEmailAddress,
                common.typeMongoIdString
            ]
        });
    });
    
    it('"isString" should confirm value is a string', function () {
        test({
            check: 'isString',
            valid: [
                common.asciiString,
                common.asciiStringWithApostrophe,
                common.slavicString,
                common.russianString,
                common.kanjiString,
                common.hiraganaString,
                common.aftricanString,
                common.arabicString,
                common.newLineNString,
                common.newLineNRString,
                common.presentationalHtml,
                common.scriptHtml,
                common.otherHtml,
                common.valueEmptyString,
                common.numericStringNumber,
                common.booleanString0,
                common.booleanString1,
                common.typeEmailAddress,
                common.typeMongoIdString,
                common.valueNull
            ],
            invalid: [
                common.integerNumber,
                common.floatNumber,
                common.numericExponentNumber,
                common.booleanTrue,
                common.booleanFalse,
                common.booleanInt0,
                common.booleanInt1
            ]
        });
    });

    it('"isBoolean" should confirm value is a boolean', function () {
        test({
            check: 'isBoolean',
            valid: [
                common.booleanString0,
                common.booleanString1,
                common.booleanInt0,
                common.booleanInt1,
                common.booleanFalse,
                common.booleanTrue,
                common.valueNull
            ],
            invalid: [
                common.asciiString,
                common.asciiStringWithApostrophe,
                common.slavicString,
                common.russianString,
                common.kanjiString,
                common.hiraganaString,
                common.aftricanString,
                common.arabicString,
                common.newLineNString,
                common.newLineNRString,
                common.presentationalHtml,
                common.scriptHtml,
                common.otherHtml,
                common.valueEmptyString,
                common.numericStringNumber,
                common.integerNumber,
                common.floatNumber,
                common.numericExponentNumber,
                common.typeEmailAddress,
                common.typeMongoIdString
            ]
        });
    });

    it('"isNotEmpty" should confirm value is not empty', function () {
        test({
            check: 'isNotEmpty',
            valid: [
                common.asciiString,
                common.asciiStringWithApostrophe,
                common.slavicString,
                common.russianString,
                common.kanjiString,
                common.hiraganaString,
                common.aftricanString,
                common.arabicString,
                common.newLineNString,
                common.newLineNRString,
                common.presentationalHtml,
                common.scriptHtml,
                common.otherHtml,
                common.numericStringNumber,
                common.booleanString0,
                common.booleanString1,
                common.typeEmailAddress,
                common.typeMongoIdString,
                common.arrayIndexedIntegers,
                common.arrayIndexedStrings,
                common.valueNull
            ],
            invalid: [
                common.integerNumber,
                common.floatNumber,
                common.numericExponentNumber,
                common.booleanTrue,
                common.booleanFalse,
                common.booleanInt0,
                common.booleanInt1,
                common.arrayEmpty,
                common.valueEmptyString
            ]
        });
    });

    it('"isLt" should confirm value is an less than a provided number', function () {
        test({
            check: 'isLt',
            args: [1],
            valid: [0, -1, -2],
            invalid: [1, 2, 3]
        });
    });

    it('"isLte" should confirm value is an less or equal to a provided number', function () {
        test({
            check: 'isLte',
            args: [1],
            valid: [1, 0, -1],
            invalid: [2, 3, 4]
        });
    });

    it('"isGt" should confirm value is an greater than a provided number', function () {
        test({
            check: 'isGt',
            args: [1],
            valid: [2, 3, 4],
            invalid: [-1, 0, 1]
        });
    });

    it('"isGte" should confirm value is an greater or equal to a provided number', function () {
        test({
            check: 'isGte',
            args: [1],
            valid: [1, 2, 3],
            invalid: [-2, -1, 0]
        });
    });
    
    
    it('"isPhoneNumber" should validate phone numbers', function () {
        test({
            check: 'isPhoneNumber',
            valid: [
                '9634',
                '-9634',
                '266 1234',
                '266-1234',
                '636 48018',
                '(089) / 636-48018',
                '403 266 1234',
                '(403) 266-1234',
                '1 403 266 1234',
                '+1-403-266-1234',
                '49 89 636 48018',
                '+49-89-636-48018',
                '191 403 266 1234',
                '+191-403-266-1234'
            ],
            invalid: [
                '*555-555-5555',
                '55S-555-5555',
                '+191-403-266-1234-867-5309'
            ]
        });
    });

    it('"isPostalCode" should confirm string is a postal/zip code', function () {
        test({
            check: 'isPostalCode',
            valid: [
                '90210',
                'K1A-0A6',
                common.valueNull
            ],
            invalid: [
                common.valueEmptyString
            ]
        });
    });
});