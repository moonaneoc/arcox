const MAX = 100;

let index = 0;
let history = [{
    value: "",
    startIndex: 0,
    endIndex: 0
}];
let flag = true;

function undo() {
    if (index > 0) {
        flag = false;
        index -= 1;
        this.setContent(history[index].value);
        this.setSelection(history[index].startIndex, history[index].endIndex);
    }
    this.focus();
}
function redo() {
    if (index < history.length - 1) {
        flag = false;
        index += 1;
        this.setContent(history[index].value);
        this.setSelection(history[index].startIndex, history[index].endIndex);
    }
    this.focus();
}
module.exports = function (editor) {
    editor.undo = undo.bind(editor);
    editor.redo = redo.bind(editor);

    editor.on("change", function (value) {
        if (flag) {
            let { startIndex, endIndex } = editor.getSelection();
            history = MAX > index + 1 ? history.slice(0, index + 1) : history.slice(1, index + 1);
            history.push({
                value,
                startIndex,
                endIndex
            });
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