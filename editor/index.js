const { isObject, debounce } = require("../utils");
const { focus, setContent, getContent, setSelection, getSelection, format, use, emit, emitSync, on, bind, unbind } = require("./editor-api.js");

function Editor(el) {
    if (!(this instanceof Editor)) {
        return new Editor(el);
    }

    this.config = extend.call(this, isObject(el) ? el : {});

    let elementId = this.config.el || el;
    if (!elementId || !elementId.replace) throw new Error("Invalid element id");

    /**
     * the textarea element which the editor mounted.
     */
    this.el = document.getElementById(elementId.replace(/^#/, ""));

    /**
     * a Renderer instance the editor bound.
     * using this.bind() or this.unbind() instead of setting the value directly
     */
    this.renderer = null;

    /**
     * store the value before change
     */
    this._oldValue = "";

    /**
     * native event
     */
    this.el.addEventListener("input", (e) => {
        if (this.renderer) this.renderer.render(this.el.value);
        debounce(onInput, this);
    });

    /**
     * native event
     */
    this.el.addEventListener("scroll", (e) => {
        if (this.renderer) this.renderer.el.scrollTop = this.renderer.el.scrollHeight * (this.el.scrollTop / this.el.scrollHeight);
    });

    /**
     * handle change event
     */
    this.on("change", (value) => {
        if (this.renderer) this.renderer.render(value);
    })

    /**
     * use prefab plugins if not disable
     */
    usePrefabPlugins.call(this);

    /**
     * listen native keyboard event
     */
    listenKeyboardEvent.call(this);
}

Editor.prototype.defaultConfig = require("./config.json");
Editor.prototype.focus = focus;
Editor.prototype.setContent = setContent;
Editor.prototype.getContent = getContent;
Editor.prototype.setSelection = setSelection;
Editor.prototype.getSelection = getSelection;
Editor.prototype.format = format;
Editor.prototype.use = use;
Editor.prototype.emit = emit;
Editor.prototype.emitSync = emitSync;
Editor.prototype.on = on;
Editor.prototype.bind = bind;
Editor.prototype.unbind = unbind;

/**
 * handle native input event
 */
function onInput() {
    if (this.el.value !== this._oldValue) {
        this.emit("change", this.el.value);
        this._oldValue = this.el.value;
    }
}

function usePrefabPlugins() {
    let plugins = Object.keys(this.config.plugins);
    plugins.forEach(plugin => {
        if (this.config.plugins[plugin] !== false) {
            this.use(require("./plugins/" + plugin))
        }
    })
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

/**
 * listen native keyboard event
 * emit event when the editor is focus
 */
function listenKeyboardEvent() {
    this.el.onkeydown = (e) => {
        e = window.event || e;
        this.emitSync("keydown", {
            ctrl: e.ctrlKey || e.metaKey,
            code: e.keyCode || e.which || e.charCode,
            preventDefault: function () {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            },
            stopPropagation: function () {
                if (e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
            }
        });
    }
}

module.exports = Editor;