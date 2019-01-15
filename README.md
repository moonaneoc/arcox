Arcox is an extensible markdown editor with plug-in support.

It uses API-driven design and separates the editor from the renderer.You can use it anywhere and customize styles easily.

## Installation
```
$ npm install arcox --save
```

## Getting started
```html
<textarea id="editor"></textarea>
<div id="renderer" class="arcox-renderer"></div>
```

```js
let { Editor, Renderer } = require("./arcox");

let editor = new Editor("#editor");
let renderer = new Renderer("#renderer");

editor.bind(renderer);
```
more configuration

```js
let editor = new Editor({
    el: "#editor", // the textarea element id
    plugins:{
        undo: true, // disable the undo plugin by setting to false
        tab: true // disable the tab plugin by setting to false
    },
    formats:{
        heading1: {
            name: "heading1",
            prefix: "# "
        },
        ...
    }
})
let renderer = new Renderer({
    el: "#renderer", // the element id the renderer mounted
    lang: "js" // default language for highlight.js
})
```