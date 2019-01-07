function render(source) {
    this.html = this.md.render(source);
    this.el.innerHTML = this.html;
}

function getHtml() {
    return this.html;
}

let { bind, unbind } = (() => {
    let Editor = null;
    function bind(editor, flag) {
        if (!Editor) Editor = require("../editor");

        if (!(editor instanceof Editor)) throw new Error("Invalid param.Required an instance of Editor.");
        if (this.editor) this.unbind();

        this.editor = editor;
        if (!flag) this.editor.bind(this, true);
    }

    function unbind(flag) {
        if (!this.editor) return;

        if (!flag) this.editor.unbind(true);
        this.editor = null;
    }
    return { bind, unbind };
})();

module.exports = {
    render,
    getHtml,
    bind,
    unbind
}