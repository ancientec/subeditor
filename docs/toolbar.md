## Toolbar

Toobar is the collection of [ToolbarItem](/toolbaritem.html) to interact with SubEditor.

```js

var subeditor = new SubEditor(elm, {
    toolbarList : ["undo","redo","seperator","text","format","link","remove_format","nextline","indent","outdent","spacer","color","backgroundcolor","|","align","ol","ul","image", "library","table","hr","source","fullscreen"]
});

//dom element of toolbar:
console.log(subeditor.refToolbar);

//toolbar class for features and methods:
console.log(subeditor.toolbar);
```


### refToolbar

ToolbarItem rendered in the same order as declared in toolbarList.

```html
<div class="SubEditorToolbar"></div>

```

### Toolbar methods

#### addItem(item : ToolbarItem | string | Function)

Add an item into toolbar during runtime. If a function is provide, it should return a ToolbarItem object.


#### enableShadow(allowCmds : string[])

Overlay a shadow on toolbar and only show items that are allowed. For example, in source code mode, only source code icon is enabled.


#### disableShadow()

Hide the shadow.

#### hasShadow()

return true if the shadow is visible.


#### hideDropdown()

Hide the dropdown content.


#### insertCloseButton(itemEl : HTMLElement)
Insert close button on top right corner to the toobar item dropdown content.

#### removeCloseButton(itemEl : HTMLElement)
Remove the inserted close button.

#### adjustContentPosition(content : HTMLElement)

If the toobar item has custom dropdown content enabled. This function will center the dropdown content to the toobar icon.

