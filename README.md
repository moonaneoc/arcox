Arcox is an extensible markdown editor with plugin support.

It uses API-driven design and separates the editor from the renderer.You can use it anywhere and customize styles easily.

## Installation
```
$ npm install arcox --save
```

## Getting started
#### html
```html
<textarea id="editor"></textarea>
<div id="renderer"></div>
```
#### js
```js
import { Editor, Renderer } from "arcox";
import "arcox/css/arcox.css";
import "arcox/css/highlight.css";

let editor = new Editor("#editor");
let renderer = new Renderer("#renderer");

editor.bind(renderer);
```

### more configuration

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

## Editor

### props
|prop|type|description|
|-|-|-|
|el|Object|the textarea element|
|config|Object|editor's config|
|renderer|Object|binding renderer instance|

### methods
```js
let editor = new Editor("#editor");

/**
 * focus the editor
 */
editor.focus();

/**
 * set the value of editor.
 * 
 * value:String
 */
editor.setContent(value);

/**
 * get the value of editor.
 */
editor.getContent();

/**
 * set selection area.
 *
 * startIndex: nonnegative integer
 * endIndex:   nonnegative integer
 */
editor.setSelection(startIndex,endIndex);


/**
 * get selection area
 */
editor.getSelection();

/**
 * insert formatting string
 * 
 * key: "heading1" | "bold" | "italic" | "image" ...
 */
editor.format(key);

/**
 * use your custom plugin
 *
 * plugin: Function
 */
editor.use(plugin);

/**
 * emit an async event.
 *
 * event:String
 */
editor.emit(event);

/**
 * emit an sync event.
 *
 * event:String
 */
editor.emitSync(event);

/**
 * add an event listener.
 *
 * event: String
 * callback: Function
 */
editor.on(event, callback);

/**
 * bind a renderer.
 *
 * renderer: Renderer
 */
editor.bind(renderer);

/**
 * unbind with renderer.
 */
editor.unbind();
```
### events

```js
editor.on("change",function(val){
    console.log(val);
});

editor.on("keydown",function(e){
    // ctrl+z example
    if (e.code === 90 && (e.ctrl || e.meta) && !e.alt && !e.shift) {
        e.preventDefault();
        e.stopPropagation();
    }
});
```

### plugin example
```js
let editor = new Editor("#editor");

let plugin = function(editor){
    editor.setContent("custom plugin"); // do anything you want
}
editor.use(plugin);
```
### prefab plugins
if you want to disable any of them,configure it to false.

|name|description|
|-|-|
|undo|undo:ctrl+z; redo:ctrl+y|
|tab|press tab to insert one '\t'|

### formats
|key|name|prefix|subfix|
|-|-|-|-|
|heading1|heading1|# ||
|heading2|heading2|## ||
|heading3|heading3|### ||
|heading4|heading4|#### ||
|heading5|heading5|##### ||
|heading6|heading6|###### ||
|bold|bold|**|\**|
|italic|italic|*|\*|
|blockquote|blockquote|> ||
|strike|strike|~~|~~|
|link|link|[|\](url)|
|image|image|![|\](url)|
|table|col|\||\|col\|col\|\\n\|-\|-\|-\|\\n\|col\|col\|col\||
|codeblock|js|\`\`\`|\\n\`\`\`|
|inlinecode|code|\`|\`|

### custom formats
```js
// custom your own formats.
// prefix and subfix cannot be lacked at the same time
let editor = new Editor({
    el: "#editor",
    formats:{
        custom: {
            name: "format name",
            prefix: "prefix",
            subfix: "subfix"
        },
    }
});
```

## Renderer

### props

|prop|type|description|
|-|-|-|
|el|Object|dom element|
|config|Object|renderer's config|
|editor|Object|binding editor instance|
|md|Object|instance of markdown-it|
|html|String|render result|

### methods
```js
let renderer = new Renderer("#renderer");

/**
 * source: markdown text
 */
renderer.render(source);

/**
 * return current render result
 */
let html = renderer.getHtml();

/**
 * same as Editor
 */
renderer.emit(event);
renderer.emitSync(event);
renderer.on(event, callback);
renderer.bind(editor);
renderer.unbind();
```