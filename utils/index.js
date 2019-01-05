function isString(str) {
    return typeof str === "string";
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function debounce(method, context) {
    if (method.__debounce__timer) clearTimeout(method.__debounce__timer)
    method.__debounce__timer = setTimeout(method.bind(context), 300);
}

module.exports = {
    isString,
    isObject,
    debounce
}