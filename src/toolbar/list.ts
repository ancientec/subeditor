import SubEditor from "../subeditor";


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
          _editor.event.register([{ event : "onFeatureChange", target : [], callback : () => {
            el.querySelectorAll('.se-button').forEach(btn => {
              btn.classList.remove('is-featured');
              if(_editor.feature?.path.includes("OL")) {
                btn.classList.add('is-featured');
              }
            });
        
          }}]);
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
          _editor.event.register([{ event : "onFeatureChange", target : [], callback : () => {
            el.querySelectorAll('.se-button').forEach(btn => {
              btn.classList.remove('is-featured');
              if(_editor.feature?.path.includes("UL")) {
                btn.classList.add('is-featured');
              }
            });
        
          }}]);
          //end of feature change
        }
      }
    }
}