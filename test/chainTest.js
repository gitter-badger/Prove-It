'use strict';

var should = require('should');
var prove = require('../lib/index.js');

describe('Chain Validator', function () {

    it('should provide an "isRequired" method', function () {
        prove().should.have.property('isRequired');
    });

    it('should accept null or undefined for all tests', function () {
        var validators = prove();
        for (var name in validators) {
            if (validators.hasOwnProperty(name) && !/end|test|isRequired/.test(name)) {
                prove()[name]().test(undefined).should.equal(true);
                prove()[name]().test(null).should.equal(true);
            }
        }
    });

    it('should evaluate all chained validators', function () {
        prove().isInt().isDivisibleBy(5).test(10).should.equal(true);
        var result = prove('myNumber').isInt().isDivisibleBy(5).test('hi');
        result.should.have.a.lengthOf(2);

        result[0].should.equal('myNumber should be an integer');
        result[1].should.equal('myNumber should be divisible by 5');
    });
});