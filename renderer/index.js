const MarkdownIt = require("markdown-it");
const hljs = require('highlight.js');
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
    this.md = new MarkdownIt({
        highlight: (str, lang) => {
            if (!lang && this.config.lang) lang = this.config.lang;
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' + hljs.highlight(lang, str).value + '</code></pre>';
                } catch (__) { }
            }

            return '<pre class="hljs"><code>' + this.md.utils.escapeHtml(str) + '</code></pre>';
        }
    });

    let elementId = this.config.el || el;
    if (!elementId || !isString(elementId)) throw new Error("Invalid element id");

    /**
     * the textarea element which the editor mounted.
     */
    this.el = document.getElementById(elementId.replace(/^#/, ""));

    /**
     * add class
     */
    this.el.className += this.el.className ? " arcox-renderer" : "arcox-renderer";

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

Renderer.prototype._defaultConfig = require("./config.json");
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
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    let options = Object.keys(this._defaultConfig);
    options.forEach(key => {
        if (isObject(this._defaultConfig[key]) && hasOwnProperty.call(userConfig, key)) {
            if (!isObject(userConfig[key])) throw new Error(`Invalid config.'${key}' must be an object.`);
            Object.keys(this._defaultConfig[key]).forEach(k => {
                if (!hasOwnProperty.call(userConfig[key], k)) userConfig[key][k] = this._defaultConfig[key][k];
            });
        } else {
            userConfig[key] = hasOwnProperty.call(userConfig, key) ? userConfig[key] : this._defaultConfig[key];
        }
    })
    return userConfig;
}

module.exports = Renderer;