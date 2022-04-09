## CSS Style

CSS Style will be injected into html head upon initialization. If the option skipCss is set to true, new instance will not replace the style created by previous instance. Default value for skipCss is false.

```html

<html>
    <head>
        <style title="SubEditorStyle" id="SubEditorStyle"></style>
    </head>
</html>
```

### presetCss(cssString: string)
   
*method: static*   
*params: (cssString: string)*  


Css will take the following order:
1. default css
2. plugin css via registerCss event
3. preset css 
4. option css   

Preset css styles will presist through all instances.

```js
//replace existing preset css string
SubEditor.presetCss(".SubEditorContent {border:1px solid red}");
//or if you already have some defined before but want to append more:
SubEditor.presetCss(SubEditor.presetCssString + ".SubEditorContent {border:1px solid red}");
```

### registerCss

The event registerCss will allow any plugin to create its own css. Using SubEditor.presetPlugin will register the css globally.

```js
    var cssEvents = [{
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
    }];

    //global:
    SubEditor.presetPlugin("mycss", cssEvents);

    //runtime: will be replace by later instance:
    var subeditor = new SubEditor(elm, { pluginList : [cssEvents] });
```

### Option css

Setting css in option during intialization will overwrite the styles created by previous instance.   

```js
    var subeditor = new SubEditor(elm, { css : ".se-button{border-color:red;}" });
```