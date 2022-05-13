import SubEditor, { ToolbarItem } from "../subeditor";

const ev = [{ event : "onFeatureChange", target : [], callback : function(_editor : SubEditor) {
  _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-tips="text"] .se-button[data-command]').forEach(btn => {
    btn.classList.remove('is-featured');
    const cmd = btn.getAttribute("data-command") as string;
    
    if((_editor.feature as any)[cmd]) {
      btn.classList.add('is-featured');
    }
  });
}}];


export default function(editor : SubEditor) {
    const o : {[key: string]: ToolbarItem} =  {
      text : {
        command : "text",
        svg : SubEditor.svgList["text"],
        tips : "text",
        dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="text"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">'+SubEditor.svgList["text"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="bold" data-tips="bold"><span class="se-icon">'+SubEditor.svgList["b"]+'</span></span><span class="se-button se-ToolbarItem" data-command="italic" data-tips="italic"><span class="se-icon">'+SubEditor.svgList["i"]+'</span></span><span class="se-button se-ToolbarItem" data-command="underline" data-tips="underline"><span class="se-icon">'+SubEditor.svgList["u"]+'</span></span><span class="se-button se-ToolbarItem" data-command="strikethrough" data-tips="strikethrough"><span class="se-icon">'+SubEditor.svgList["strikethrough"]+'</span></span><span class="se-button se-ToolbarItem" data-command="superscript" data-tips="superscript"><span class="se-icon">'+SubEditor.svgList["superscript"]+'</span></span><span class="se-button se-ToolbarItem" data-command="subscript" data-tips="subscript"><span class="se-icon">'+SubEditor.svgList["subscript"]+'</span></span></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.querySelectorAll('.se-button[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              _editor.command(btn.getAttribute("data-command") as string);
              return false;
            });
          });
          _editor.event.register(ev);
          //end of feature change
        }
      }
    };
    const x : {[key: string]: string} = {b : "bold", i : "italic",u : "underline",strikethrough : "strikethrough",subscript : "subscript", superscript : "superscript"};
    Object.keys(x).forEach(key => {
      const cmd = x[key];
      o[cmd] = {
        command : cmd, svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="'+cmd+'" data-tips="'+cmd+'"><span class="se-icon">'+(SubEditor.svgList[key])+'</span></span>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {

          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            _editor.command(el.getAttribute("data-command") as string);
            return false;
          });
        }
      };
    });
    
    return o;
}