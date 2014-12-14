'use strict';

module.exports = function (errors) {
    errors = errors || {};
    var append = function (path, message, value) {
        var error = errors[path] = errors[path] || {
            message: []
        };
        if (typeof message === 'string' || message instanceof String) {
            error.message.push(message.replace(/\{VALUE\}/g, value).replace(/\{PATH\}/g, path));
        } else if (Array.isArray(message)) {
            error.message.push.apply(error.message, message);
        }
        error.value = value;
    };

    return {
        add: function (path, message, value) {

            var error;
            if (true !== message) {
                if (null != message.errors) {
                    for (var prop in message.errors) {
                        if (message.errors.hasOwnProperty(prop)) {
                            error = message.errors[prop];
                            append([path, prop].join('.'), error.message, error.value);
                        }
                    }
                } else {
                    append(path, message, value);
                }
            }
        },
        get: function () {
            if (0 === Object.keys(errors).length) {
                return false;
            } else {
                return errors;
            }
        }
    };
};