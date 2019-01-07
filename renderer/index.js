const MarkdownIt = require("markdown-it");
const { isObject } = require("../utils");
const { render, getHtml, bind, unbind } = require("./renderer-api.js");

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

    /**
     * native event
     */
    this.el.addEventListener("scroll", (e) => {
        // if (this.editor) this.editor.el.scrollTop = this.editor.el.scrollHeight * (this.el.scrollTop / this.el.scrollHeight);
    });

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