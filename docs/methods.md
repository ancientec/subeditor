
## Variables

SubEditor will render itself in the following format:   

```html
<div class="SubEditor">
    <div class="SubEditorToolbar"></div>
    <div class="SubEditorContentContainer">
        <div class="SubEditorContent"></div>
    </div>
    <div class="SubEditorFooter"></div>
    <textarea class="SubEditorTextarea"></textarea>
</div>
```

### refEditor


dom element of SubEditor.    

```js
var subeditor = new SubEditor(elm, options);
console.log(document.querySelector(".SubEditor") === subeditor.refEditor);
//true
```

### refTextarea


The shadow textarea that contains the content for source editing, the value is updated as the editor content changes. If a textarea element is provide to initialize SubEditor, refTextarea will be same as the initialized element.   

```js
var subeditor = new SubEditor(elm, options);
console.log(document.querySelector(".SubEditorTextarea") === subeditor.refTextarea);
//true
if(elm.nodeName === "TEXTAREA") {
    console.log(elm === subeditor.refTextarea);
    //true
}
```

### refToolbar


dom element of toobar.   

```js
var subeditor = new SubEditor(elm, options);
console.log(document.querySelector(".SubEditorToolbar") === subeditor.refToolbar);
//true
```


### refContent


dom element of content.   

```js
var subeditor = new SubEditor(elm, options);
console.log(document.querySelector(".SubEditorContent") === subeditor.refContent);
//true
```

### refFooter


dom element of footer.   

```js
var subeditor = new SubEditor(elm, options);
console.log(document.querySelector(".SubEditorFooter") === subeditor.refFooter);
//true
```


### version

current version (static). In case of breaking changes, plugin developer can use version to determine behaviors base on different versions.    

```js
console.log(SubEditor.version);
//0.6.0
```

### svgList

list of svg icons for ui (static). Icons can be added or replaced by editing this value directly or using the method SubEditor.presetSvg. Changing this will affect all instances of SubEditor.      

```js
console.log(SubEditor.svgList);
// { i : "<svg></svg>" ....}
```

### langList

list of translation languages (static). Languages can be added or updated by editing this value directly or using the method SubEditor.presetLang. Changing this will affect all instances of SubEditor.      

```js
console.log(SubEditor.langList);
// { en : {"bold" : "bold",...} ....}
```

### presetToolbarItem( name : string, item : Function)

This method takes a function that accepts an editor instance and returns a ToolbarItem. Item set by presetToolbarItem will have the highest priority, it shall replace the item set by plugin (registerToolbarItem) and default item with same name.   

### presetPluginList

list of user defined plugins (static), available globally and shared across all instances. Using same name will overwrite the default plugin. Use the method SubEditor.presetPlugin(pluginName : string, plugin : SubEditorEvent[]).  


### presetCssString

user defined css in string format (static), available globally and shared across all instances. Use the method SubEditor.presetCss(cssString : string).   


### cfgList

Stores config variables for plugins.  


### cachedList

Stores temporary variables, to be passed between plugins or in UI flow.  


### selection

Serialized value of current selection, this is updated on every selection change.  
The serialized object uses [Selection Serializer](https://github.com/ancientec/selection-serializer).  


### feature

An analysed dom object representation at current cursor. Default null and will change upon selection change.    
```js
class Feature {
    path : string[] = [];
    pathNode : HTMLElement[] = [];
    node : HTMLElement | undefined = undefined;
    nodeName : string = "";
    formatEL : string = "";
    
    color : string = "";
    background : string = "";
    indent : string = "";
    align : string = "";

    bold = false;
    italic = false;
    underline = false;
    strikethrough = false;
    subscript = false;
    superscript = false;

    a : FeatureLink = {
        href : "",
        target : "",
        node : undefined,
    };
    img : FeatureImage = {
        src : "",
        width : "",
        height : "",
        node : undefined
    };
    video? : FeatureVideo = {
        controls : boolean,
        autoplay : boolean,
        width : "",
        height : "",
        node : HTMLElement | undefined,
        sources : FeatureSource[]
    };
    audio? : FeatureAudio = {
        controls : boolean,
        autoplay : boolean,
        width : "",
        height : "",
        node : HTMLElement | undefined,
        sources : FeatureSource[]
    };
    
}
```


## Methods

### command(cmd : string, value : any[] = [])
   
*method: non-static*   
*params: (type : string, value : any[] = [])*  


trigger plugin command.      

```js
var subeditor = new SubEditor(elm, options);
subeditor.command("hr",[]);
//add an hr into content
```

### destroy()
   
*method: non-static*   
*params: none*  


destroy and clean up current instance.      

```js
var subeditor = new SubEditor(elm, options);
subeditor.destroy();
```

### ln(key : string)
   
*method: non-static*   
*params: (key : string)*  


return the translated language value.      

```js
var subeditor = new SubEditor(elm, {lang : "zhCN"});
console.log(subeditor.ln("exit fullscreen"));
//退出全屏
```

### registerCallback(key : string, fn : Function)
   
*method: non-static*   
*params: (key : string, fn : Function)*  


register callback function for use later.

```js
var subeditor = new SubEditor(elm, options);
subeditor.registerCallback("logme", (str) => { console.log(str);});
```

### getCallback(key : string, args : any = undefined)
   
*method: non-static*   
*params: (key : string, args : any = undefined)*  


register callback function for use later.

```js
var subeditor = new SubEditor(elm, options);
subeditor.getCallback("logme", "output to console");
//output to console
```

### initPlugins(plugins : (SubEditorEvent[] | string)[])
   
*method: non-static*   
*params: (plugins : (SubEditorEvent[] | string)[])*  


add plugin to the editor after initialization, available only to current instance. Use string value to enable default preset, or include your own plugin code.   

```js
var subeditor = new SubEditor(elm, options);
//enable default redo plugin:
subeditor.initPlugins(["redo"]);

//or register a "redo" command with full code, please note that you should not register same event twice
editor.initPlugins([
    {
        event : "onCommand",
        target : ["redo"],
        callback : (editor :SubEditor, type : string, value : any) => {
            editor.handleChange(editor.history.Redo());
        }
    }]);
```

### presetPlugin(pluginName : string, plugin : SubEditorEvent[])
   
*method: static*   
*params: (pluginName : string, plugin : SubEditorEvent[])*  


pre-define a plugin available globally and share among all instances. Using the same name will replace default plugin. List of all default plugins are:     
"fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list", "table","image"



### handleFeature()
   
*method: non-static*   
*params: none*  


Parse the current selection state of editor content.   

```js
var subeditor = new SubEditor(elm, options);
subeditor.handleFeature();
console.log(subeditor.feature);
/* null or:
 Feature {
    path : string[] = [];
    pathNode : HTMLElement[] = [];
    node : HTMLElement | undefined = undefined;
    nodeName : string = "";
    formatEL : string = "";
    
    color : string = "";
    background : string = "";
    indent : string = "";
    align : string = "";

    bold = false;
    italic = false;
    underline = false;
    strikethrough = false;
    subscript = false;
    superscript = false;

    a : FeatureLink = {
        href : "",
        target : "",
        node : undefined,
    };
    img : FeatureImage = {
        src : "",
        width : "",
        height : "",
        node : undefined
    };
    video? : FeatureVideo = {
        controls : boolean,
        autoplay : boolean,
        width : "",
        height : "",
        node : HTMLElement | undefined,
        sources : FeatureSource[]
    };
    audio? : FeatureAudio = {
        controls : boolean,
        autoplay : boolean,
        width : "",
        height : "",
        node : HTMLElement | undefined,
        sources : FeatureSource[]
    };
    
}
*/
```

### restoreSelection(sel : SelectionSlimState | undefined = undefined)
   
*method: non-static*   
*params: (sel : SelectionSlimState | undefined = undefined)*  


restore the selection to the provided serialized selection state.   

```js
var subeditor = new SubEditor(elm, options);
subeditor.changeValue("<h1>title</h1>");
var cachedSelection = editor.selection;
//assuming cursor or focus has moved, reset it back to cached
subeditor.restoreSelection(cachedSelection);
```

### getSelectionRange()
   
*method: non-static*   
*params: none*  


return the selection and range.   

```js
var subeditor = new SubEditor(elm, options);
console.log(subeditor.getSelectionRange());
// {selection : object, range : object}
```

### setCache(key : string, value : any)
   
*method: non-static*   
*params: (key : string, value : any)*  


save variable for use later.  

```js
var subeditor = new SubEditor(elm, options);
subeditor.setCache("myVar", "test123");
```

### getCache(key : string)
   
*method: non-static*   
*params: (key : string)*  


get cached variable.  

```js
console.log(subeditor.getCache("myVar"));
//test123
```

### setCfg(key : string, value : any)
   
*method: non-static*   
*params: (key : string, value : any)*  


set or change config variable.

```js
var subeditor = new SubEditor(elm, options);
//limit the number of files to be handled in image upload
subeditor.setCfg("image.upload.accept.files", 1);
```

### getCfg(key : string)
   
*method: non-static*   
*params: (key : string)*  


get current cfg variable.  

```js
console.log(subeditor.getCache("image.upload.accept.files"));
//1
```


### enableFooter(height: number)
   
*method: non-static*   
*params: (height: number)*  


disable and hide footer  

```js
var subeditor = new SubEditor(elm, options);
subeditor.enableFooter(15);
//show a footer of height = 15
```


### disableFooter()
   
*method: non-static*   
*params: none*  


disable and hide footer  

```js
var subeditor = new SubEditor(elm, options);
subeditor.disableFooter();
```

### setAutoGrow(grow : boolean)
   
*method: non-static*   
*params: (grow : boolean)*  


enable or disable content height auto grow  

```js
var subeditor = new SubEditor(elm, options);
subeditor.setAutoGrow(true);

```

### presetLang(langList : {[key: string]:{[key: string]: string}})
   
*method: static*   
*params: (langList : {[key: string]:{[key: string]: string}})*  


add or change language, this will affect all instances.   

```js
SubEditor.presetLang({ 
    fr : {
        //some translations
        }
});
```

### presetSvg(_svg : {[key: string]: string})
   
*method: static*   
*params: (_svg : {[key: string]: string})*  


add or change svg icon, this will affect all instances.   

```js
SubEditor.presetSvg({ 
    italic : '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9l-2 10h2l2-10Zm0.75-3a1 1 0 001 1a1 1 0 10-1-1Z"></path></svg>'
});
```


### presetCss(cssString: string)
   
*method: static*   
*params: (cssString: string)*  


Css will inject into document head upon each initialization. Css will take the following order:
1. default css
2. plugin css via registerCss event
3. preset css
4. option css   

Styles are shared among all instances, initialization will refresh the style if it detect changes.   

```js
//replace existing preset css string
SubEditor.presetCss(".SubEditorContent {border:1px solid red}");
//or if you already have some defined before but want to append more:
SubEditor.presetCss(SubEditor.presetCssString + ".SubEditorContent {border:1px solid red}");
```

### lastCss()
   
*method: static*   
*params: none*  

Return the last computed css style in string format.   

### changeValue(str : string)
   
*method: non-static*   
*params: (str : string)*  


change the content.   

```js
var subeditor = new SubEditor(elm, options);
subeditor.changeValue("<h1>New Content</h1>");
console.log(subeditor.value());
//<h1>New Content</h1>
```

### triggerChange()
   
*method: non-static*   
*params: none*  


if content is modified in code, triggerChange will need to be called to create a changed copy.   

```js
var subeditor = new SubEditor(elm, {onChange : (changed) => {console.log("changed: ",changed);}});
subeditor.changeValue("<h1>New Content</h1>");
subeditor.triggerChange();
//changed: {key : 1, content : '<h1>New Content</h1>', change : {delta : array, selection : object}}
```


### value()
   
*method: non-static*   
*params: none*  


return the content value in string.   

```js
var subeditor = new SubEditor(elm, options);
console.log(subeditor.value());
```

