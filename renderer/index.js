const MarkdownIt = require("markdown-it");
const { isObject, isString } = require("../utils");
const { render, getHtml, bind, unbind, emit, emitSync, on } = require("./renderer-api.js");

function Renderer(el) {
    if (!(this instanceof Renderer)) {
        return new Renderer(el);
    }

    this.config = extend.call(this, isObject(el) ? el : {});

    /**
     * the instance of MarkdownIt
     */
    this.md = new MarkdownIt();

    let elementId = this.config.el || el;
    if (!elementId || !isString(elementId)) throw new Error("Invalid element id");

    /**
     * the textarea element which the editor mounted.
     */
    this.el = document.getElementById(elementId.replace(/^#/, ""));

    /**
     * an Editor instance this bound.
     * using this.bind() or this.unbind() instead of setting the value directly
     */
    this.editor = null;

    /**
     *  store the render result
     */
    this.html = "";

    /**
     * bind context
     */
    onMouseEnter = onMouseEnter.bind(this);
    syncEditor = syncEditor.bind(this);

    this.el.addEventListener("mouseenter", onMouseEnter);
}

Renderer.prototype.defaultConfig = require("./config.json");
Renderer.prototype.render = render;
Renderer.prototype.getHtml = getHtml;
Renderer.prototype.bind = bind;
Renderer.prototype.unbind = unbind;
Renderer.prototype.emit = emit;
Renderer.prototype.emitSync = emitSync;
Renderer.prototype.on = on;

Renderer.prototype._removeScrollListener = function () {
    this.el.removeEventListener("scroll", syncEditor)
}

function onMouseEnter(e) {
    if (this.editor) {
        this.el.addEventListener("scroll", syncEditor);
        this.editor._removeScrollListener();
    }
}

function syncEditor() {
    if (this.editor) {
        let ratio = this.el.scrollTop / (this.el.scrollHeight - this.el.clientHeight);
        this.editor.el.scrollTop = (this.editor.el.scrollHeight - this.editor.el.clientHeight) * ratio;
    }
}

/**
 * merge config
 */
function extend(userConfig) {
    let options = Object.keys(this.defaultConfig);
    options.forEach(key => {
        userConfig[key] = userConfig[key] || this.defaultConfig[key];
    })
    return userConfig;
}

module.exports = Renderer;