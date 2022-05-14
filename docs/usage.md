## Usage

SubEditor can be used on textarea, or inject into div.  

#### 1. textarea
```html
    <form>
        <textarea id="editorTextarea" style="width:500px;height:300px"></textarea>
    </form>
```

##### full toobar example (with image url but no upload and library):
```js
var _subeditor = 
new SubEditor(document.querySelector('#editorTextarea'),  
    {
        onChange : function(changeValue) { 
            console.log(changeValue.key,changeValue.change, changeValue.content);
            );
        },
        
        pluginList : ["fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list", "table","image"],

        toolbarList : ["undo","redo","text","format","link","remove_format","indent","outdent","color","backgroundcolor","align","ol","ul","image","table","hr","source","fullscreen"],

    });
};
```

#### 2. Inject into div, with predefined width and height(auto grow)
```html
    <div id="editorDiv">

    </div>
```

##### full toobar example (with image url but no upload and library):
```js

var _subeditor = 
new SubEditor(document.querySelector('#editorDiv'),  
    {
        width : 450, 
        height: 250,
        value : '',
        autoGrow : true,
        onChange : function(changeValue) { 
            console.log(changeValue.key,changeValue.change, changeValue.content);
            );
        },
        
        pluginList : ["fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list", "table","image"],

        toolbarList : ["undo","redo","text","format","link","remove_format","indent","outdent","color","backgroundcolor","align","ol","ul","image","table","hr","source","fullscreen"],

    });
};
```

#### Value
```js
    _subeditor.value();
```

In the case of textarea, the value of textarea will automatically be sync as you type.  

##### Please note that image upload and library will require additional variables and server setup