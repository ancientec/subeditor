import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [{
    event : "onCommand",
    target : ["fullscreen"],
    callback : (editor :SubEditor, type : string, value : any) => {
        if(value) {
            //backup style:
            editor.refEditor.setAttribute("data-backupstyle", editor.refEditor.getAttribute("style") || "");
            editor.refEditor.setAttribute("style", "position:fixed;z-index:100500;height:100%;width:100%;top:0;left:0;");
        }
        else {
            editor.refEditor.setAttribute("style", editor.refEditor.getAttribute("data-backupstyle") || "");
        }

        editor.event.trigger("onFullscreenChange","",[editor, value]);
        return false;
    }
}] as SubEditorEvent[];
