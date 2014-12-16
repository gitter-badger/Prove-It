'use strict';

var prove = require('../lib/index.js');
var should = require('should');

describe('Function Validator', function () {
    it('should validate a simple array with a function', function () {
        var doc = ['555555', 1];

        var test = prove().run(function (/**val*/) {
            return prove().every(prove('Phone Number').isString().isPhoneNumber());
        });

        test(doc).errors.should.eql({
            '1': {
                message: [
                    'Phone Number should be a string',
                    'Phone Number should be a phone number'
                ],
                value: 1
            }
        });
    });

    it('should validate a simple object with an object', function () {
        var doc = {
            name: {
                first: 'hello',
                last: 'world'
            },
            phone: '555555'
        };


        var test = prove().run(function (/**val*/) {
            return prove({
                name: prove({
                    first: prove('First Name').isString().isLength(6),
                    last: prove('Last Name').isString().isLength(6)
                }),
                phone: prove().isPhoneNumber()
            });
        });

        test(doc).errors.should.eql({
            'name.first': {
                message: [ 'First Name should be more than 6 characters long' ],
                value: 'hello'
            },
            'name.last': {
                message: [ 'Last Name should be more than 6 characters long' ],
                value: 'world'
            }
        });
    });
});