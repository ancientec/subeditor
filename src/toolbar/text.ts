import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      text : {
        command : "text",
        svg : SubEditor.svgList["text"],
        tips : "text",
        dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="text"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">'+SubEditor.svgList["text"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="bold" data-tips="bold"><span class="se-icon">'+SubEditor.svgList["b"]+'</span></span><span class="se-button se-ToolbarItem" data-command="italic" data-tips="italic"><span class="se-icon">'+SubEditor.svgList["i"]+'</span></span><span class="se-button se-ToolbarItem" data-command="underline" data-tips="underline"><span class="se-icon">'+SubEditor.svgList["u"]+'</span></span><span class="se-button se-ToolbarItem" data-command="strikethrough" data-tips="strikethrough"><span class="se-icon">'+SubEditor.svgList["strikethrough"]+'</span></span><span class="se-button se-ToolbarItem" data-command="superscript" data-tips="superscript"><span class="se-icon">'+SubEditor.svgList["superscript"]+'</span></span><span class="se-button se-ToolbarItem" data-command="subscript" data-tips="subscript"><span class="se-icon">'+SubEditor.svgList["subscript"]+'</span></span></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.querySelectorAll('.se-button[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();console.log("text",btn.getAttribute("data-command"));
              _editor.command(btn.getAttribute("data-command") as string);
              return false;
            });
          });
  
          _editor.event.register([{ event : "onFeatureChange", target : [], callback : () => {
            el.querySelectorAll('.se-button[data-command]').forEach(btn => {
              btn.classList.remove('is-featured');
              const cmd = btn.getAttribute("data-command") as string;
              
              if((_editor.feature as any)[cmd]) {
                btn.classList.add('is-featured');
              }
            });
        
          }}]);
          //end of feature change
        }
      }
    }
}