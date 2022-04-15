import SubEditor from "../subeditor";

const ev = [{ event : "onFeatureChange", target : [], callback : function(_editor : SubEditor) {
  _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-command="ol"],.se-ToolbarItem[data-command="ul"]').forEach(btn => {
    btn.classList.remove('is-featured');
    const cmd = btn.getAttribute("data-command") as string;
    
    if(_editor.feature?.path.includes(cmd.toUpperCase())) {
      btn.classList.add('is-featured');
    }
  });
}}];

export default function(editor : SubEditor) {
    return {
      ol : {
        command : "ol",
        svg : SubEditor.svgList["ol"],
        tips : "ordered list",
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.addEventListener('click', (e) => {
            const cmd = el.getAttribute("data-command") as string;
            _editor.command(cmd,[]);
          });
          _editor.event.register(ev);
          //end of feature change
        }
      },
      ul : {
        command : "ul",
        svg : SubEditor.svgList["ul"],
        tips : "unordered list",
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.addEventListener('click', (e) => {
            const cmd = el.getAttribute("data-command") as string;
            _editor.command(cmd,[]);
          });
          _editor.event.register(ev);
          //end of feature change
        }
      }
    }
}