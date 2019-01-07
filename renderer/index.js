const MarkdownIt = require("markdown-it");
const { isObject } = require("../utils");
const { render, getHtml, bind, unbind, emit, emitSync, on } = require("./renderer-api.js");

function Renderer(el) {
    if (!(this instanceof Renderer)) {
        return new Renderer(el);
    }

    this.config = extend.call(this, isObject(el) ? el : {});

    /**
     * The instance of MarkdownIt
     */
    this.md = new MarkdownIt();

    let elementId = this.config.el || el;
    if (!elementId || !elementId.replace) throw new Error("Invalid element id");

    /**
     * The textarea element which the editor mounted.
     */
    this.el = document.getElementById(elementId.replace(/^#/, ""));

    /**
     * An Editor instance this bound.
     * Using this.bind() or this.unbind() instead of setting the value directly
     */
    this.editor = null;

    this._preventSyncScroll = false;
    /**
     * handle sync scroll event
     */
    this.on("__sync__scroll", syncScroll.bind(this));

    /**
     * native event
     */
    this.el.addEventListener("scroll", syncScroll.bind(this));

    /**
     *  store the render result
     */
    this.html = "";
}

Renderer.prototype.defaultConfig = require("./config.json");
Renderer.prototype.render = render;
Renderer.prototype.getHtml = getHtml;
Renderer.prototype.bind = bind;
Renderer.prototype.unbind = unbind;
Renderer.prototype.emit = emit;
Renderer.prototype.emitSync = emitSync;
Renderer.prototype.on = on;

function syncScroll(pos) {
    if (typeof pos === "number") {
        this._preventSyncScroll = true;
        this.el.scrollTop = this.el.scrollHeight * (this.editor.el.scrollTop / this.editor.el.scrollHeight);
    } else if (this._preventSyncScroll) {
        this._preventSyncScroll = false;
    } else if (this.editor) {
        if (this.el.scrollHeight - this.el.clientHeight - this.el.scrollTop < 30) this.el.scrollTop = this.el.scrollHeight;
        this.editor.emitSync("__sync__scroll", this.el.scrollTop);
        // this.editor.emit("__sync__scroll", this.el.scrollTop);
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