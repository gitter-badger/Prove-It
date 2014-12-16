'use strict';

var isEmpty = function (obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};

module.exports = function (errors) {
    errors = errors || {};
    var merge = function (path, message, value) {
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
        append: function (options) {
            var path = options.path;
            var message = options.msg;
            var value = options.val;
            var error;
            if (true !== message) {

                if (Array.isArray(path)) {
                    path = path.join('.');
                }

                if (null == path) {
                    path = '';
                }

                if ('.' === path[0]) {
                    path = path.slice(1);
                }

                if (null != message.errors) {
                    for (var prop in message.errors) {
                        if (message.errors.hasOwnProperty(prop)) {
                            error = message.errors[prop];
                            if ('' !== path && null !== path) {
                                merge([path, prop].join('.'), error.message, error.value);
                            } else {
                                merge(prop, error.message, error.value);
                            }
                        }
                    }
                } else {
                    merge(path, message, value);
                }
            }
        },
        finish: function () {
            return isEmpty(errors) ? false : errors;
        }
    };
};