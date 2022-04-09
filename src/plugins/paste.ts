import SubEditor from '../subeditor';
import { SubEditorEvent } from "../event";
import { cleanupHtml } from '../paste';

export default [
    {
        event : "onPaste",
        target : [],
        callback : (editor :SubEditor, e : ClipboardEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if(!e.clipboardData) return;
            const html = cleanupHtml(e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain"));
            const {range} = editor.getSelectionRange();
            range.deleteContents();
            if(editor.feature?.path.includes("CODE")) {
                //paste plain text
                if(range.endContainer.nodeType === Node.TEXT_NODE) {
                    const endOffset = range.endOffset, offset = endOffset + html.length;
                    range.endContainer.textContent = range.endContainer.textContent?.substring(0, endOffset) + html + range.endContainer.textContent?.substring(endOffset);
                    editor.dom.setCaretAt(range.endContainer, offset);
                }
            } else {
                //paste html
                const pholder = document.createElement("div");
                pholder.innerHTML = html;
                if(range.endContainer.nodeType === Node.TEXT_NODE) {
                    const end = document.createTextNode(range.endContainer.textContent!.substring(range.endOffset));
                    range.endContainer.textContent = range.endContainer.textContent!.substring(0, range.endOffset);
                    editor.dom.nodesInsertAfter([...Array.from(pholder.childNodes), end], range.endContainer);
                    editor.dom.setCaretAt(end, 0);
                } else {
                    range.insertNode(pholder);
                    if(pholder.nextSibling) editor.dom.setCaretAt(pholder.nextSibling,0);
                    else editor.dom.setCaretAt(pholder.lastChild!, pholder.lastChild?.childNodes.length || pholder.lastChild?.textContent?.length);
                    editor.dom.unwrapNode(pholder);
                }
            }

            editor.triggerChange();
            
        }
    },
    {
    event : "onKeyUp",
    target : ["ctrl+v","cmd+v"],
    callback : (editor : SubEditor, e : KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}] as SubEditorEvent[];
