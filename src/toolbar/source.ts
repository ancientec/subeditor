import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      source : {
        command : "source",
        svg : SubEditor.svgList["view_source"],
        tips : "view source",
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.addEventListener('click', () => {
            
            //raise shadow:
            if(!_editor.toolbar?.hasShadow()) {
              _editor.toolbar!.enableShadow(["source", "fullscreen"]);
            } else {
              _editor.toolbar.disableShadow();
            }
            const cmd = el.getAttribute("data-command") as string;
            _editor.command(cmd,[]);
          });
        }
      }
    }
}