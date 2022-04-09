import hotkey from '../hotkey';
import SubEditor from '../subeditor';
import { SubEditorEvent } from "../event";

export default [
    {
        event : "onCommand",
        target : ["undo"],
        callback : (editor :SubEditor, cmd : string, value : any) => {
            editor.handleChange(editor.history.Undo());
        }
    },
    {
    event : "onKeyDown",
    target : ["mod+z"],
    callback : (editor :SubEditor, e : KeyboardEvent) => {
        if(!hotkey.isUndoHotKey(e)) return;
        e.preventDefault();
        e.stopPropagation();
        editor.handleChange(editor.history.Undo());
        return false;
    }
}] as SubEditorEvent[];
