const MAX = 100;

let index = 0;
let history = [""];
let flag = true;

function undo() {
    if (index > 0) {
        flag = false;
        this.setContent(history[--index]);
    }
    this.el.focus();
}
function redo() {
    if (index < history.length - 1) {
        flag = false;
        this.setContent(history[++index]);
    }
    this.el.focus();
}
module.exports = function (editor) {
    editor.undo = undo.bind(editor);
    editor.redo = redo.bind(editor);

    editor.on("change", function (val, oldValue) {
        if (flag) {
            history = MAX > index + 1 ? history.slice(0, index + 1) : history.slice(1, index + 1);
            history.push(val);
            index = history.length - 1;
        } else {
            flag = true;
        }
    })
    editor.on("keydown", function (e) {
        if (e.ctrl && e.code === 90) {
            /**
             * ctrl+z
             */
            e.preventDefault();
            e.stopPropagation();
            editor.undo();
        } else if (e.ctrl && e.code === 89) {
            /**
             * ctrl+y
             */
            e.preventDefault();
            e.stopPropagation();
            editor.redo();
        }
    })

}