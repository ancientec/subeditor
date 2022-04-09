import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [
    {
        event : "onCommand",
        target : ["link"],
        callback : (editor :SubEditor, cmd : string, action : string | undefined, url : string | undefined, text : string | undefined, target : string | undefined) => {
    
            const {range} = editor.getSelectionRange();
            if(action === "remove" && editor.feature?.a.node) {
                editor.dom.unwrapNode(editor.feature?.a.node as Node);
                editor.triggerChange(); 
                return;
            } else if (action === "update" && editor.feature?.a.node) {
                const n = (editor.feature.a.node as HTMLAnchorElement), offset = range.endOffset;
                n.href = url || "";
                n.target = target || "";
                n.textContent = text || "";
                editor.dom.setCaretAt(n.firstChild!,Math.min(offset,text!.length));
                editor.triggerChange(); 
                return;
            }
            range.deleteContents();
            range.collapse(false);
            //do insert or update:
            let node = document.createElement("a");
            node.href = url || "";
            node.target = target || "";
            node.textContent = text || "";

            if(range.endContainer.parentElement!.nodeName === "CODE") {
                let el = range.endContainer.parentElement as HTMLElement;
                if(el.parentElement!.nodeName === "PRE") el = el.parentElement as HTMLElement;
                editor.dom.nodesInsertAfter([node],el);
            } else {
                range.insertNode(node);
            }
            editor.dom.setCaretAt(node.firstChild!,node.textContent.length);
 
            editor.triggerChange();
        }
        
    },
    {
        event : "onCommand",
        target : ["remove_link"],
        callback : (editor :SubEditor) => {
    
            const {selection} = editor.getSelectionRange();
            const c = editor.feature?.a.node?.childNodes[0];
            let offset = selection?.focusOffset || 0, el = selection?.focusNode;
            if(editor.feature?.a.node) {
                editor.dom.unwrapNode(editor.feature?.a.node as Node);

                if(c?.previousSibling?.nodeType === Node.TEXT_NODE) {
                    if(el === c) {
                        el = c.previousSibling;
                        offset = el.textContent!.length + offset;
                    }
                    c.previousSibling.textContent += c.textContent || "";
                    c.remove();
    
                }
                if(el) editor.dom.setCaretAt(el,offset);
                editor.triggerChange(); 
            }
            
        }
        
    }] as SubEditorEvent[];
    
    
    