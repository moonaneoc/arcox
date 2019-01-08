function isNonnegativeInt(num) {
    return parseInt(num) === num && num >= 0;
}
function isString(str) {
    return typeof str === "string";
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function isFunction(fun) {
    return typeof fun === "function";
}

function debounce(method, context) {
    if (method.__debounce__timer) clearTimeout(method.__debounce__timer)
    method.__debounce__timer = setTimeout(method.bind(context), 100);
}

module.exports = {
    isNonnegativeInt,
    isString,
    isObject,
    isFunction,
    debounce
}