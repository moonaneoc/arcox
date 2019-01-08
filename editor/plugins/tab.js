/**
 * insert '\t' into the editor when 'tab' is pressed
 * shift+tab to cancel
 */
module.exports = function (editor) {
    editor.on("keydown", function (e) {
        if (e.code === 9 && !e.ctrl && !e.meta && !e.alt) {
            e.preventDefault();
            e.stopPropagation();
            let { startIndex, endIndex } = editor.getSelection();
            let content = editor.getContent();
            if (!e.shift) {
                editor.setContent(`${content.substring(0, startIndex)}\t${content.substring(endIndex)}`);
                editor.setSelection(startIndex + 1, startIndex + 1);
            } else if (startIndex > 0) {
                if (content[startIndex - 1] === "\t") {
                    editor.setContent(`${content.substring(0, startIndex - 1)}${content.substring(startIndex)}`);
                    editor.setSelection(startIndex - 1, endIndex - 1);
                }
            }
        }
    })
}