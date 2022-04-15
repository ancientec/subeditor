## Events

Typical event object contains three parts,  
- event : name of the event
- target : a set of limitation or triggering elements
- callback: a triggering function

```js
    {
        event : "eventName",
        target : ["some_limit"],
        callback : (editor :SubEditor, cmd : string, some_args...) {

        }
    }
```


### onCommand
   
*method: non-static*   
*params: (key : string, fn : Function)*  

onCommand events are primarily used to be triggered from toolbar. The following example will register the undo command.  
- event: name of event
- target: the list of command names   
- callback:  

```js
    {
        event : "onCommand",
        target : ["undo"],
        callback : (editor : SubEditor, cmd : string, value : any) => {
            editor.handleChange(editor.history.Undo());
        }
    }

//clicking undo icon will have the same effect as running this code.
var subeditor = new SubEditor(elm, options);
subeditor.command("undo",[]);

```

### registerSvg
   
*method: non-static*   
*params: (key : string, fn : Function)*  

onCommand events are primarily used to be triggered from toolbar. The following example will register the undo icon for later use. The svg icon will be available for all instances initialized after this point.     
- event: name of event
- target: the list of command names   
- callback: 

```js
    {
        event : "registerSvg",
        target : [],
        callback : () : {[key: string]: string} => {
            return {"mynewicon" : '<svg viewBox="0 0 24 24">...</svg>'};
        }
    }

console.log(SubEditor.svgList['mynewicon']);
//<svg viewBox="0 0 24 24">...</svg>

```

### registerCss

The callback of registerCss should return a string key and a string value. Registering using same string key will replace previous.   

- event: name of event
- target: []   
- callback: return {[key: string]: string}

```js
    [{
        event : "registerCss",
        target : [],
        callback : () : {[key: string]: string} => {
            return {"image" : ".se-button{border-color:red;}"};
        }
    },
    {
        //this will replace above
        event : "registerCss",
        target : [],
        callback : () : {[key: string]: string} => {
            return {"image" : ".se-button{border-color:blue;}"};
        }
    },
    {
        //this will be a new one
        event : "registerCss",
        target : [],
        callback : () : {[key: string]: string} => {
            return {"image_button_width" : ".se-button{border-width:2px;}"};
        }
    }]
```

### registerLanguage

Plugin can define new language string or add new languages to SubEditor using this method. The callback of registerLanguage should return {language_name_key:{[key: string]: string}}.    

- event: registerLanguage
- target: []   
- callback: return {[key: string]:{[key: string]: string}}

```js
    {
        event : "registerLanguage",
        target : [],
        callback : () : {[key: string]:{[key: string]: string}} => {
            return {
                "en" : {
                    "upload" : "upload"
                },
                "fr" : 
                {
                    "upload" : "télécharger"
                },
                "pt" : 
                {
                    "upload" : "recobrar"
                }
            };
        }
    }
```

### registerToolbarItem

ToolbarItem creates an icon to be shown on toolbar and further define the action interacting with the icon. ToolbarItem created with this method will replace default ToolbarItem of the same name, but will be replaced by SubEditor.presetToolbarItem.    

```js
// interface of ToolbarItem
export interface ToolbarItem {
  command : string;
  svg : string;
  dropdowncontent? : string;
  tips? : string;
  onRender? : Function;
}

```

- event: registerToolbarItem
- target: []   
- callback: return {[key: string]: ToolbarItem}


### onKeyDown

This KeyDown event fires when any of the key combinations set in target is detected.

- event: onKeyDown
- target: ["key_combination"]   
- callback: (editor :SubEditor, e : KeyboardEvent)

```js
    //undo as an example:
    {
    event : "onKeyDown",
    target : ["mod+z"],
    callback : (editor :SubEditor, e : KeyboardEvent) => {
        if(!hotkey.isUndoHotKey(e)) return;
        e.preventDefault();
        e.stopPropagation();
        editor.handleChange(editor.history.Undo());
        return false;
    }
```

### onKeyUp


This KeyUp event fires when any of the key combinations set in target is detected.

- event: onKeyUp
- target: ["key_combination"]   
- callback: (editor :SubEditor, e : KeyboardEvent)

### onClick


This click event fires when clicking inside content is detected.

- event: onClick
- target: []   
- callback: (editor :SubEditor, e : MouseEvent)

### onMouseUp

This mouseup event fires when mouseup inside content is detected.

- event: onMouseUp
- target: []   
- callback: (editor :SubEditor, e : MouseEvent)

### onBlur


This blur event fires when content lose focus.

- event: onBlur
- target: []   
- callback: (editor :SubEditor, e : FocusEvent)


### onPaste

This is an event design specifically for clean up pasted html code. It should only be implemented once.   

- event: onPaste
- target: []   
- callback: (editor :SubEditor, e : ClipboardEvent)

### onFeatureChange

Feature is the parsed object representation of current focus element in node, node names can optionally be set in target to subscribe only assigned elements. 

- event: onFeatureChange
- target: []
- target: ["LI", "OL","UL"]   
- target: ["IMG"]   
- target: ["TABLE", "TD", "TH"]   
- callback: (editor :SubEditor, feature : Feature)

### onSelectionChange

This event usually fired after onFeatureChange but it will trigger even when moving cursor in the same element. Returned selection is serialized and this event is useful for implementing collaborate editing.   

- event: onFeatureChange
- target: []
- callback: (editor : SubEditor, selection : SelectionSlim)


### registerUI

This event fires after the new instance and UI are created. This is useful to apply some UI alternations   

- event: registerUI
- target: []
- callback: (editor : SubEditor)


### onBeforeChange

This event fires on every change of content, before the changed value is applied to textarea and before onChange callback.   

- event: onBeforeChange
- target: []
- callback: (editor : SubEditor)
