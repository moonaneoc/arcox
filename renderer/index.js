const MarkdownIt = require("markdown-it");
const { isObject } = require("../utils");
const { render, getHtml } = require("./renderer-api.js");

function EsRenderer(el) {
    if (!(this instanceof EsRenderer)) {
        return new EsRenderer(el);
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
     *  store the render result
     */
    this.html = "";
}

EsRenderer.prototype.defaultConfig = require("./config.json");
EsRenderer.prototype.render = render;
EsRenderer.prototype.getHtml = getHtml;

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

// module.exports = EsRenderer;
export default EsRenderer;