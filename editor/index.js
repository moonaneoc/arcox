const { isObject, debounce } = require("../utils");
const { focus, setContent, getContent, setSelection, getSelection, format, use, emit, emitSync, on } = require("./editor-api.js");

function EsEditor(el) {
    if (!(this instanceof EsEditor)) {
        return new EsEditor(el);
    }

    this.config = extend.call(this, isObject(el) ? el : {});

    let elementId = this.config.el || el;
    if (!elementId || !elementId.replace) throw new Error("Invalid element id");

    /**
     * The textarea element which the editor mounted.
     */
    this.el = document.getElementById(elementId.replace(/^#/, ""));

    /**
     * store the value before change
     */
    this._oldValue = "";

    /**
     * native event
     */
    this.el.addEventListener("input", (e) => { debounce(onInput, this); });

    /**
     * use prefab plugins if not disable
     */
    usePrefabPlugins.call(this);

    /**
     * listen native keyboard event
     */
    listenKeyboardEvent.call(this);
}

EsEditor.prototype.defaultConfig = require("./config.json");
EsEditor.prototype.focus = focus;
EsEditor.prototype.setContent = setContent;
EsEditor.prototype.getContent = getContent;
EsEditor.prototype.setSelection = setSelection;
EsEditor.prototype.getSelection = getSelection;
EsEditor.prototype.format = format;
EsEditor.prototype.use = use;
EsEditor.prototype.emit = emit;
EsEditor.prototype.emitSync = emitSync;
EsEditor.prototype.on = on;

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

// module.exports = EsEditor;
export default EsEditor;