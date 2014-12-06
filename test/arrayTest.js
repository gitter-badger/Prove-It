'use strict';

var prove = require('../lib/index.js');
var should = require('should');

describe('Array Validator', function () {
    it('should validate a simple array', function () {
        var doc = ['555555', 1];

        var test = [prove('Phone Number').isString().isPhoneNumber()];

        prove(test)(doc).errors.should.eql({
            '1': {
                message: [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                value: 1
            }
        });
    });

    it('should compose validators on simple array', function () {
        var doc = ['5555555', '5555555555', 'hello world'];

        var test = [
            prove('Phone Number').isPhoneNumber(),
            prove('Phone Number').isLength(8)
        ];

        prove(test)(doc).errors.should.eql({
            '0': {
                message: [ 'Phone Number should be more than 8 characters long' ],
                value: '5555555'
            },
            '2': {
                message: [ 'Phone Number should be a phone number' ],
                value: 'hello world'
            }
        });
    });

    it('should validate an array within an object', function () {
        var doc = {
            phones: ['555555', 1]
        };

        var test = {
            phones: prove([
                prove('Phone Number').isString().isPhoneNumber()
            ])
        };

        prove(test)(doc).errors.should.eql({
            'phones.1': {
                message: [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                value: 1
            }
        });
    });

    it('should validate an array of objects', function () {
        var doc = {
            phones: [
                {
                    number: '5555555',
                    label: 'home'
                },
                {
                    number: 1
                }
            ]
        };

        var test = {
            phones: prove([{
                number: prove('Phone Number').isString().isPhoneNumber(),
                label: prove('Phone Label').isRequired().isString()
            }])
        };

        prove(test)(doc).errors.should.eql({
            'phones.1.number': {
                message: [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                value: 1
            },
            'phones.1.label': {
                message: ['Phone Label is a required field' ],
                value: undefined
            }
        });
    });

    it('should compose validators an array of objects', function () {
        var doc = {
            phones: [
                {
                    number: '5555555',
                    label: 'home'
                },
                {
                    number: 1
                }
            ]
        };

        var test = {
            phones: prove([{
                number: prove('Phone Number').isString().isPhoneNumber()
            }, {
                label: prove('Phone Label').isRequired().isString()
            }])
        };

        prove(test)(doc).errors.should.eql({
            'phones.1.number': {
                message: [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                value: 1
            },
            'phones.1.label': {
                message: ['Phone Label is a required field' ],
                value: undefined
            }
        });
    });

    it('should validate a extra fields in a collection', function () {
        var doc = {
            phones: [
                {
                    number: '5555555',
                    label: 'home',
                    invalidField: 'hi'
                }
            ]
        };

        var test = {
            phones: prove([{
                number: prove('Phone Number').isString().isPhoneNumber(),
                label: prove('Phone Label').isRequired().isString()
            }])
        };

        prove(test)(doc).errors.should.eql({
            'phones.0.invalidField': {
                message: [ 'invalidField is not an allowed field' ],
                value: 'hi'
            }
        });
    });

    it('should validate a required fields in a collection', function () {
        var doc = {
            phones: [
                {
                    number: '5555555'
                }
            ]
        };

        var test = {
            phones: prove([{
                number: prove('Phone Number').isString().isPhoneNumber(),
                label: prove('Phone Label').isRequired().isString()
            }])
        };

        prove(test)(doc).errors.should.eql({
            'phones.0.label': {
                message: [ 'Phone Label is a required field' ],
                value: undefined
            }
        });
    });
});