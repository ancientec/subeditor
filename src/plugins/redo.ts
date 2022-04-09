import hotkey from '../hotkey';
import SubEditor from '../subeditor';
import { SubEditorEvent } from "../event";

export default [
    {
        event : "onCommand",
        target : ["redo"],
        callback : (editor :SubEditor, cmd : string, value : any) => {
            editor.handleChange(editor.history.Redo());
        }
    },
    {
    event : "onKeyDown",
    target : ["mod+y","cmd+shift+z"],
    callback : (editor :SubEditor, e : KeyboardEvent) => {
        if(!hotkey.isRedoHotKey(e)) return;
        e.preventDefault();
        e.stopPropagation();
        editor.handleChange(editor.history.Redo());
        return false;
    }
}] as SubEditorEvent[];
