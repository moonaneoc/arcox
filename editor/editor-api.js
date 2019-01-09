const { isNonnegativeInt, isString, isObject, isFunction } = require("../utils");

/**
 * focus the editor
 */
function focus() {
    this.el.focus();
}

/**
 * set the editor's content.
 */
function setContent(val) {
    if (!isString(val)) throw new Error("Type error. String is required.");

    if (val !== this.el.value) {
        this.el.value = val;
        this.emit("change", val);
    }
}

/**
 * get the editor's content.
 */
function getContent() {
    return this.el.value;
}

/**
 * set selection area
 */
function setSelection(startIndex, endIndex) {
    this.el.selectionStart = startIndex;
    this.el.selectionEnd = endIndex;
}

/**
 * get selection area
 */
function getSelection() {
    return {
        startIndex: this.el.selectionStart,
        endIndex: this.el.selectionEnd
    }
}

/**
 * insert formatting string
 */
function format(key) {
    let { prefix, subfix, name } = this.config.formats[key] ? this.config.formats[key] : {};
    if (typeof prefix !== "string" && typeof subfix !== "string") throw new Error(`Invalid format '${key}'`);

    name = name || "";
    prefix = prefix || "";
    subfix = subfix || "";
    let startIndex = this.el.selectionStart;
    let endIndex = this.el.selectionEnd;
    this.el.focus();

    if (startIndex === endIndex) {
        // no selection area
        this.setContent(`${this.el.value.substring(0, startIndex)}${prefix}${name}${subfix}${this.el.value.substring(endIndex)}`);
        this.setSelection(startIndex + prefix.length, startIndex + prefix.length + name.length);
    } else {
        // exists selection area
        if (this.el.value.substring(startIndex - prefix.length, startIndex) === prefix && this.el.value.substring(endIndex, endIndex + subfix.length) === subfix) {
            // remove prefix and subfix
            this.setContent(`${this.el.value.substring(0, startIndex - prefix.length)}${this.el.value.substring(startIndex, endIndex)}${this.el.value.substring(endIndex + subfix.length)}`);
            this.setSelection(startIndex - prefix.length, endIndex - prefix.length);
        } else {
            // add prefix and subfix
            this.setContent(`${this.el.value.substring(0, startIndex)}${prefix}${this.el.value.substring(startIndex, endIndex)}${subfix}${this.el.value.substring(endIndex)}`);
            this.setSelection(startIndex + prefix.length, endIndex + prefix.length);
        }
    }
}

/**
 * use plugin
 */
function use(plugin /*, params, ... */) {
    var args = [this].concat(Array.prototype.slice.call(arguments, 1));
    plugin.apply(plugin, args);
    return this;
}

/**
 * event module
 */
let { emit, emitSync, on } = (() => {
    let listener = {};
    function emit(event) {
        let args = Array.prototype.slice.call(arguments, 1);
        setTimeout(() => {
            if (listener[event]) {
                listener[event].forEach(cb => {
                    if (cb) cb.apply(this, args);
                })
            }
        }, 0);
        return this;
    }
    function emitSync(event) {
        let args = Array.prototype.slice.call(arguments, 1);
        if (listener[event]) {
            listener[event].forEach(cb => {
                if (cb) cb.apply(this, args);
            })
        }
        return this;
    }
    function on(event, callback) {
        if (!listener[event]) listener[event] = [];
        listener[event].push(callback);
        return this;
    }
    return { emit, emitSync, on };
})();

/**
 * bind renderer
 */
let { bind, unbind } = (() => {
    let Renderer = null;
    function bind(renderer, flag) {
        if (!Renderer) Renderer = require("../renderer");

        if (!(renderer instanceof Renderer)) throw new Error("Invalid param.Required an instance of Renderer.");
        if (this.renderer) this.unbind();

        this.renderer = renderer;
        if (!flag) this.renderer.bind(this, true);
    }

    function unbind(flag) {
        if (!this.renderer) return;

        if (!flag) this.renderer.unbind(true);
        this.renderer = null;
    }
    return { bind, unbind }
})();

module.exports = {
    focus,
    setContent,
    getContent,
    setSelection,
    getSelection,
    format,
    use,
    emit,
    emitSync,
    on,
    bind,
    unbind
}