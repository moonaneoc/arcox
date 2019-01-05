/**
 * insert '\t' into the editor when 'tab' is pressed
 */
module.exports = function (editor) {
    editor.on("keydown", function (e) {
        if (e.code === 9) {
            e.preventDefault();
            e.stopPropagation();
            // editor.setContent(editor.el.value + "\t");
            let { startIndex, endIndex } = editor.getSelection();
            console.log(startIndex, endIndex)
        }
    })
}