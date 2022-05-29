import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [{
    event : "onCommand",
    target : ["fullscreen"],
    callback : (editor :SubEditor, type : string, value : any) => {
        if(value) {
            //backup style:
            editor.refEditor.classList.add("fullscreen");
        }
        else {
            editor.refEditor.classList.remove("fullscreen");
        }

        editor.event.trigger("onFullscreenChange","",[editor, value]);
        return false;
    }
}] as SubEditorEvent[];
