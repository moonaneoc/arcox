function render(source) {
    this.html = this.md.render(source);
    this.el.innerHTML = this.html;
}

function getHtml() {
    return this.html;
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
 * bind/unbind with a editor
 */
let { bind, unbind } = (() => {
    let Editor = null;
    function bind(editor, flag) {
        if (!Editor) Editor = require("../editor");

        if (!(editor instanceof Editor)) throw new Error("Invalid param.Required an instance of Editor.");
        if (this.editor) this.unbind();

        this.editor = editor;
        this.render(this.editor.el.value);
        
        /**
         * sync scrollTop
         */
        let ratio = this.editor.el.scrollTop / (this.editor.el.scrollHeight - this.editor.el.clientHeight);
        this.el.scrollTop = (this.el.scrollHeight - this.el.clientHeight) * ratio;

        if (!flag) this.editor.bind(this, true);
    }

    function unbind(flag) {
        if (!this.editor) return;

        if (!flag) this.editor.unbind(true);
        this.editor = null;
        this.html = "";
        this.el.innerHTML = "";
    }
    return { bind, unbind };
})();

module.exports = {
    render,
    getHtml,
    bind,
    unbind,
    emit,
    emitSync,
    on
}