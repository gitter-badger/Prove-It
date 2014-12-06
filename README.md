![Prove It](https://raw.githubusercontent.com/DylanPiercey/Prove-It/master/prove-logo.jpg)

###[See the list of default validators](https://github.com/DylanPiercey/Prove-It/blob/master/Validators.md)

    Create composable, re-usable validators with in-depth, client-friendly error messages.

#Installation

###Server-side

```Console
npm install prove-it
```

```JavaScript
var prove = require('prove-it');
```

###Client-side [Download](https://raw.githubusercontent.com/DylanPiercey/Prove-It/master/bin/prove-it.min.js) and access with:

```HTML
<script type="text/javascript" src="prove-it.min.js"></script>
```

```JavaScript
window.prove;
```

#Goals

* Chainable validations that could be composed and extended easily.
* Validate all of the fields of an object (even deep ones).
* Validate entire arrays and collections.
* An error message structure that is both friendly and usable; for clients and developers.

#Example

```JavaScript
var doc = {
    name: {
        first: 'hello',
        last: 'world'
    },
    dates: {
        start: new Date(),
        end: new Date()
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

var passed = prove(contactValidation, /**Merge other validations here!*/).test(doc);

if (true === passed) {
    // Success!
} else {
    console.log(passed);
    // Would output all of the errors!
    /**
    {
        "message": "Validation failed",
        "name": "ValidationError",
        "errors": {
            "name.last": {
                "message": [
                    "Last Name should be more than 6 characters long"
                ],
                "value": "world"
            },
            "dates.start": {
                "message": [
                    "Start date should be before Sat, 06 Dec 2014 17:04:51 GMT"
                ],
                "value": "Sat, 06 Dec 2014 17:04:51 GMT"
            },
            "dates.end": {
                "message": [
                    "End date should be after Sat, 06 Dec 2014 17:04:51 GMT"
                ],
                "value": "Sat, 06 Dec 2014 17:04:51 GMT"
            },
            "phones.0.label": {
                "message": [
                    "Phone Label is a required field"
                ]
            },
            "phones.1.number": {
                "message": [
                    "Phone Number should be a string",
                    "Phone Number should be a phone number"
                ],
                "value": 1
            },
            "phones.1.invalidField": {
                "message": [
                    "invalidField is not an allowed field"
                ],
                "value": "hacks"
            }
        }
    }
    */

```

##Creating A Validator
1) Create an object and give it a key with the validator name.

```JavaScript
    {
        myValidator: ...
    }
```

2) The validator must point to a function that can take in some optional initial arguments.

```JavaScript
myValidator: function(args) {...}
```

3) The function must also return an object with keys: { validator, msg }

```JavaScript
myValidator: function(args) {
    return {
        validator: function(val) {
            //Do the true/false validation here (has access to args).
        },
        msg: '{PATH} should work with myValidator:' + args //The error message for the validator
        //{VALUE} = The value passed into the validator function.
        //{PATH} = Either the schema path or the path passed into the prove(PATH) chain.
    }
}
```

##Extending The Validator

Prove-It has an attached 'extend' which can take in an object containing validators.

```JavaScript
prove.extend({/**Validators Here*/})
```

Eg.

```JavaScript
prove.extend({
    isEqualTo: function(compare) {
        return {
            validator: function(val){
                return val === compare;
            },
            msg: '{PATH} should equal ' + compare + ' but got {VALUE}'
        };
    }
})
```

##Running Field Validators

1) Invoke the Prove-It function with a string or null to begin chaining,
    this string will replace {PATH} in the error messages.

```JavaScript
prove(/**Optional {PATH} name*/)
```

2) Call any number of validators, and finally call 'test' with a value.

```JavaScript
prove('Email Field').isString().isDomain().test('facebook.com') // returns true
prove('Email Field').isString().isDomain().test('facebook') // returns array of error messages based on tests.
```

##Object Validator

#####(Note: Passing in multiple objects will merge the objects)

1) Invoke Prove-It with an object(s) containing tests to have it validate the fields of a given object.

```JavaScript
var myObjectValidator = prove({
    field1: prove('My first field').isString(),
    field2: prove({
        subfield: prove('Subfield of field2').isString()
    })
}); // Creates a test that validates that an object has only field1 and it is a string.
```

2) Call test the same as a regular field validator to evaluate all the fields

```JavaScript
myObjectValidator.test({
    field1: 1,
    field2: {
        subfield: 2
    }
});
```

Returns an object such as:

```JavaScript
{ message: 'Validation failed',
  name: 'ValidationError',
  errors:
   { 'field1': { message: ['My first field should have been a string'], value: 1 },
   { 'field2.subfield': { message: ['Subfield of field2 should have been a string'], value: 2 } }
```

##Array Validator

#####(Using an object inside of an array will run the Object validator on every item in the array.)
#####(Note: Multiple tests within the array will be composed similar to the object validator.)

1) Invoke Prove-It with an array, the first element in the array will be the test that is ran on the array.


```JavaScript
var mySimpleArrayValidator = prove([
    prove('Array Item').isString()
]); // Would run isString on all of the array elements.

var myCollectionValidator = prove([{
    field1: prove('My field').isString()
}]); // Validates all items in the array against the given object.
```

##Function Validator
Invoking Prove-It with a function will pass the function the current sub-document as a value.
The returned value will be passed through Prove-It again and tested with the value.

Eg.

```JavaScript
var myFunctionValidator = prove(function (val) {
    // ... Do stuff with val.
    if (val === something) {
        return prove('This value').isString();
    } else {
        return prove('This value').isNumeric();
    }
});
```

---

###Contributions

* Use .jshintrc file as the coding standards.
* Use grunt to run tests.

Please feel free to recommend more default validators and/or submit a PR!