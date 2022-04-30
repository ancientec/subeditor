## ToolbarItem

ToolbarItem has three variants:
- simple button with command action
- dropdown sub-menu
- dropdown custom content

```js

interface ToolbarItem {
  command : string;
  svg : string;
  dropdowncontent? : string;
  tips? : string;
  onRender? : Function;
}

```


### Simple Button Command

Rendering a svg button, trigger onCommand action when clicking the button.   

- command: defined by plugins
- svg: use default icon or provide your own svg as string
- tips: the text to display when hover on icon, it will automatically find matching translation.   

```js

    {
        command : "bold",
        svg : SubEditor.svgList["b"],
        tips : "bold"
    }

```

The following example produce same result as above, action clicking on item button is defined specifically in onRender().    

```js
    {
        command : "bold",
        svg : SubEditor.svgList["b"],
        tips : "bold",
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.addEventListener('click', (e) => {
            const cmd = el.getAttribute("data-command") as string;
            _editor.command(cmd,[]);
          });
        }
    }
```

Result html markups:
```html
<span class="se-button se-ToolbarItem" data-command="bold" data-tips="bold">
    <span class="se-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5v14h7A3.6 3.6 0 0017 16A3.6 3.6 0 0015 12A3.6 3.6 0 0017 8.5A3.6 3.6 0 0014 5h-7ZM9 7h4.5A2.1 2.1 0 0114.5 9A2.1 2.1 0 0113.5 11h-4.5v-4ZM9 13h4.5A2.1 2.1 0 0114.5 15.5A2.1 2.1 0 0113.5 17h-4.5v-4Z"></path>
        </svg>
    </span>
</span>

```

### Dropdown Sub-Menu

Dropdown menu can be created by providing the necessary html markup in dropdowncontent. By adding "horizontal" to se-dropdown-content class will render the sub-menu horizontally. By default clicking on the subeditor.refToolbar.querySelector(".se-dropdown-trigger button") will automatically show sub-menu. The buttons in sub-menu will need to define in onRender().       

```js

{
        command : "align",
        svg : SubEditor.svgList["align_left"],
        tips : "align",
        dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="align"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">'+SubEditor.svgList["align_left"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="align" data-value="left" data-tips="align left"><span class="se-icon">'+SubEditor.svgList["align_left"]+'</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="center" data-tips="align center"><span class="se-icon">'+SubEditor.svgList["align_center"]+'</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="right" data-tips="align right"><span class="se-icon">'+SubEditor.svgList["align_right"]+'</span></span><span class="se-button ToolbarItem" data-command="align" data-value="justify" data-tips="align justify"><span class="se-icon">'+SubEditor.svgList["align_justify"]+'</span></span></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
            //look for each button in sub-menu and 
          el.querySelectorAll('.se-button[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              _editor.command("align",[btn.getAttribute("data-value") as string]);
              return false;
            });
          });
          //subscribe to onFeatureChange event to highlight the button if the current content at cursor has matching style
          _editor.event.register([{ event : "onFeatureChange", target : [], callback : () => {
            el.querySelectorAll('.se-button').forEach(btn => {
              btn.classList.remove('is-featured');
              if(btn.getAttribute("data-value") === _editor.feature?.align) {
                btn.classList.add('is-featured');
              }
            });
        
          }}]);
          //end of feature change
        }
      }

```

### Dropdown Custom Content

By capturing the onclick event in onRender(), custom content can be created base on different condition. For more detail example, please check out the source code at /src/toolbar/(image, link, table, color).   

```js

    {
        command : "table",
        svg : SubEditor.svgList["table"],
        tips : "table",
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.addEventListener('click', (e) => {

            //subscribe to onClick event:
            el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
                //determine if dropdown is open by checking is-active class
                if(el.querySelector('.se-dropdown-menu')!.classList.contains("is-active")) {

                    //your own code
                    //example: for table, if we are already in table, render submenu for table opertions such as merge/unmerge
                    // if we are not currently in table, render an UI allowing user to create a new table by choosing number of columns and rows

                }
            });

          });
        }
    }

```

### presetToolbarItem(name : string, item : Function)

This method takes a function that accepts an editor instance and returns a ToolbarItem. Item set by presetToolbarItem will have the highest priority, it shall replace the item set by plugin (registerToolbarItem) and default item with same name.   

```js

    //take advantage of _editor.ln() to provide localized language string when rendering content
    var newbold = function(_editor) {
        return {
        command : "bold",
        svg : SubEditor.svgList["b"],
        tips : "bold"
        }
    };
    //create a new ToolbarItem name newbold
    SubEditor.presetToolbarItem("newbold", newbold);

    //can be used now:
    var subeditor = new SubEditor(elem, {
        toolbarList : ["newbold"],
        pluginList : ["bold"] // bold plugin is required for onCommand("bold", []) to work
    });

```

### Runtime Registration

It is possible to pass the above function directly into toolbarList.   

```js

    var new SubEditor(elem, {
        toolbarList : [newbold],
        pluginList : ["bold"] // bold plugin is required for onCommand("bold", []) to work
    });

```
