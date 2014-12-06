'use strict';

var prove = require('../lib/index.js');
var should = require('should');

describe('Array Validator', function () {
    it('should run the example', function () {
        var date = (new Date()).toUTCString();

        var doc = {
            name: {
                first: 'hello',
                last: 'world'
            },
            dates: {
                start: date,
                end: date
            },
            phones: [
                {
                    number: '5555555'
                },
                {
                    number: 1,
                    label: 'home',
                    invalidField: 'hacks'
                }
            ]
        };

        var contactValidation = {
            name: prove({ // Prove nested objects.
                first: prove('First Name').isString().isLength(4),
                last: prove('Last Name').isString().isLength(6)
            }),
            dates: prove(function (date) {
                if (null != date) {
                    return prove({
                        start: prove('Start date').isDate().isBefore(date.end),
                        end: prove('End date').isDate().isAfter(date.start)
                    });
                } else {
                    return prove('Date').isRequired();
                }
            }),
            phones: prove([ // Prove an entire array.
                {
                    number: prove('Phone Number').isString().isPhoneNumber(),
                    label: prove('Phone Label').isRequired().isString()
                }
            ])
        };

        prove(contactValidation).test(doc).errors.should.containDeep({
            'name.last': {
                'message': [
                    'Last Name should be more than 6 characters long'
                ],
                'value': 'world'
            },
            'dates.end': {
                'message': [
                    'End date should be after ' + date
                ],
                'value': date
            },
            'phones.0.label': {
                'message': [
                    'Phone Label is a required field'
                ]
            },
            'phones.1.number': {
                'message': [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                'value': 1
            },
            'phones.1.invalidField': {
                'message': [
                    'invalidField is not an allowed field'
                ],
                'value': 'hacks'
            }
        });
    });

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