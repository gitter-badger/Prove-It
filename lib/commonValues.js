/**
 * Created by dylan on 06/10/14.
 */
module.exports = {
    asciiString: 'Abc 123',
    asciiStringWithApostrophe: 'Paddy O\'Furniture',
    slavicString: 'Živa, Żywia',
    russianString: 'Адриан',
    kanjiString: '愛子',
    hiraganaString: 'あいこ',
    aftricanString: '!Xõó',
    arabicString: 'حسن',
    newLineNString: 'First line and\nsecond line',
    newLineNRString: 'First line and\n\rsecond line',
    presentationalHtml: '<strong>Strong</strong>',
    scriptHtml: '<script>alert("XSS")</script>',
    otherHtml: '<video></video>',
    valueNull: null,
    valueEmptyString: '',
    integerNumber: 123,
    floatNumber: 123.45,
    numericStringNumber: '42',
    numericExponentNumber: 123.45e6,
    numericHexadecimalNumber: 0xf4c3b00c,
    numericBinaryNumber: '0b10100111001',
    numericOctalNumber: '0777',
    booleanFalse: false,
    booleanTrue: true,
    booleanString1: '1',
    booleanString0: '0',
    booleanInt1: 1,
    booleanInt0: 0,
    arrayEmpty: [],
    arrayIndexedStrings: ['a', 'b', 'c'],
    arrayIndexedIntegers: [1, 2, 3],
    objectStrings: {
        a: 'aa',
        b: 'bb',
        c: 'cc'
    },
    objectIntegers: {
        a: 1,
        b: 2,
        c: 3
    },
    typeEmailAddress: 'valid@emailaddress.com',
    typeMongoIdString: '51dc52fec0d988a9547b5201'
};