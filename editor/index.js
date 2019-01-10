const { isObject, isString, debounce } = require("../utils");
const { focus, setContent, getContent, setSelection, getSelection, format, use, emit, emitSync, on, bind, unbind } = require("./editor-api.js");

function Editor(el) {
    if (!(this instanceof Editor)) {
        return new Editor(el);
    }

    this.config = extend.call(this, isObject(el) ? el : {});

    let elementId = this.config.el || el;
    if (!elementId || !isString(elementId)) throw new Error("Invalid element id");

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
        contentChange.call(this);
        debounce(onInput, this);
    });

    /**
     * handle event
     */
    this.on("change", (value) => { contentChange.call(this) });

    /**
     * use prefab plugins if not disable
     */
    usePrefabPlugins.call(this);

    /**
     * listen native keyboard event
     */
    listenKeyboardEvent.call(this);

    /**
     * bind context
     */
    onMouseEnter = onMouseEnter.bind(this);
    syncRenderer = syncRenderer.bind(this);

    this.el.addEventListener("mouseenter", onMouseEnter);
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

Editor.prototype._removeScrollListener = function () {
    this.el.removeEventListener("scroll", syncRenderer)
}

function onMouseEnter() {
    if (this.renderer) {
        this.el.addEventListener("scroll", syncRenderer);
        this.renderer._removeScrollListener();
    }
}
function syncRenderer() {
    if (this.renderer) {
        let ratio = this.el.scrollTop / (this.el.scrollHeight - this.el.clientHeight);
        this.renderer.el.scrollTop = (this.renderer.el.scrollHeight - this.renderer.el.clientHeight) * ratio;
    }
}

function contentChange() {
    if ((this.el.scrollHeight - this.el.clientHeight) - this.el.scrollTop < 20) {
        this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
    }
    if (this.renderer) {
        this.renderer.render(this.el.value);
        syncRenderer();
    }
}

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
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    let options = Object.keys(this.defaultConfig);
    options.forEach(key => {
        if (isObject(this.defaultConfig[key]) && hasOwnProperty.call(userConfig, key)) {
            if (!isObject(userConfig[key])) throw new Error(`Invalid config.'${key}' must be an object.`);
            Object.keys(this.defaultConfig[key]).forEach(k => {
                if (!hasOwnProperty.call(userConfig[key], k)) userConfig[key][k] = this.defaultConfig[key][k];
            });
        } else {
            userConfig[key] = hasOwnProperty.call(userConfig, key) ? userConfig[key] : this.defaultConfig[key];
        }
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
            code: e.keyCode || e.which || e.charCode,
            ctrl: e.ctrlKey,
            meta: e.metaKey,
            alt: e.altKey,
            shift: e.shiftKey,
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