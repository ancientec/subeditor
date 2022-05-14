# `SubEditor` 

An alternative wysiwyg html editor designed to bridge the gap between modern and old javascript.

## Documentations

[subeditor.org](https://subeditor.org)

## Why SubEditor

This library was first written in 2020 for internal projects, recently rewrite into Typescript. The purpose of SubEditor is to enable old and modern javascript framworks to enbrace a full feature wysiwyg html editor specifically designed with the following features in mind:

- Drop in replacement for old wysiwyg library with minimum code migrations on both server and client side
- Stick to real html and dom
- Available for plain JS and for library like React
- Expected, customized and normalized behaviors down to every keystroke (by using plugins)
- Smaller and more clean html output

## Features

- Lightweight, one single bundled file for all scripts, plugins, css and svg (182kb minimized, 44kb minimized & gzipped)
- All logics and behaviors are written in plugins (inspired by Slatejs)
- Work with raw selection and range (no browser exeCommand)
- Full features text, format, table and images
- Written in Typescript and each plugin is individually tested for quality

## Available Plugins

Plugins are a group of event listeners design specifically for alternating contents. Please refer to [document plugin](https://subeditor.org/plugins.html) section for explaination of each plugin.

- align: left, right, center, and justify
- blockquote
- code
- color and background color
- format: h1, h2, h3, h4, h5, h6, paragaph
- fullscreen
- horizontal line
- images (url, upload, directly drop file to content and library) with server side examples
- indent and outdent
- url hyperlink
- ordered list and unordered list
- paste with clean html
- remove format
- table
- view and edit source
- text: bold, italic, underline, supscript, and subscript


## Install

```shell
> npm install subeditor
```
## React Wrapper

```shell
> npm install react-subeditor
```

```js
import SubEditorComponent,{ SubEditor, ChangeEntry, SubEditorEvent, ToolbarItem, SelectionSlimState, SubEditorHTMLElement, SubEditorOption } from 'react-subeditor';

```

## Develop & Unit Test

```shell
> git clone https://github.com/ancientec/subeditor
> cd subeditor
> npm install
> npm run build

//open subeditor/tests/index.htm to see all the tests
```

## Usage & Example

```html
<!--quick start in html, minified version is prebuild in dist folder:-->
<script src="dist/subeditor.min.js"></script>
<script>

//can be use on div or textarea
var targetElement = document.querySelector('div#editor');
//or var targetElement = document.querySelector('textarea#content');

//new SubEditor(targetElement, options);
var subeditor = new SubEditor(
      targetElement,  
      {
        onChange : function(change) { changeFn(change);},
        pluginList : ["fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list"],
        toolbarList : ["undo","redo","text","format","link","remove_format","indent","outdent","color","backgroundcolor","align","ol","ul","table","hr","source","fullscreen"] 
      });

</script>
```

## Plans

Although it's fairly stable to use this project, I do want to take more time to make it better before making it 1.0:   

- code and document clean up and more organized
- bug fixes
- more test coverages
- more universal or includes more common features


## License

MIT