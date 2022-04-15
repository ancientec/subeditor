import SubEditor, { ToolbarItem } from "../subeditor";

const ev = [{ event : "onFeatureChange", target : [], callback : function(_editor : SubEditor) {

  _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-tips="align left"],.se-ToolbarItem[data-tips="align right"],.se-ToolbarItem[data-tips="align center"],.se-ToolbarItem[data-tips="align justify"]').forEach(btn => {
    btn.classList.remove('is-featured');
    if(btn.getAttribute("data-value") === _editor.feature!.align) {
      btn.classList.add('is-featured');
    }
  });

  _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-tips="align"] .se-button[data-command]').forEach(btn => {
    btn.classList.remove('is-featured');
    if(btn.getAttribute("data-value") === _editor.feature!.align) {
      btn.classList.add('is-featured');
    }
  });
}}];
export default function(editor : SubEditor) {
    const o : {[key: string]: ToolbarItem} =   {
      align : {
        command : "align",
        svg : SubEditor.svgList["align_left"],
        tips : "align",
        dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="align"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">'+SubEditor.svgList["align_left"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="align" data-value="left" data-tips="align left"><span class="se-icon">'+SubEditor.svgList["align_left"]+'</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="center" data-tips="align center"><span class="se-icon">'+SubEditor.svgList["align_center"]+'</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="right" data-tips="align right"><span class="se-icon">'+SubEditor.svgList["align_right"]+'</span></span><span class="se-button ToolbarItem" data-command="align" data-value="justify" data-tips="align justify"><span class="se-icon">'+SubEditor.svgList["align_justify"]+'</span></span></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.querySelectorAll('.se-button[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              _editor.command("align",[btn.getAttribute("data-value") as string]);
              return false;
            });
          });
  
          _editor.event.register(ev);
          //end of feature change
        }
      }
    };
    ["align_right","align_left","align_center","align_justify"].forEach(cmd => {
      const values = cmd.split("_");
      o[cmd] = {
        command : cmd, svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="'+cmd+'" data-value="'+values[1]+'" data-tips="'+cmd.replace("_", " ")+'"><span class="se-icon">'+(SubEditor.svgList[cmd])+'</span></span>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {

          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            _editor.command("align", [values[1]]);
            return false;
          });

          _editor.event.register(ev);
        }
      };
    });
    return o;

}