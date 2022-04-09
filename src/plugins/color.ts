import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [
{
    event : "onCommand",
    target : ["color", "backgroundcolor"],
    callback : (editor :SubEditor, cmd : string, value : any) => {
        const attr = cmd === "color" ? "color" : "background-color";
        
        const {range} = editor.getSelectionRange();

        const nodes = editor.dom.selectDeepNodesInRange(range);
        if(nodes[0].collapsed && nodes[0].node.parentElement) {
            if(nodes[0].node === editor.refContent) {
                const placeholder = document.createElement('span');
                placeholder.setAttribute("style", attr+":"+value);
                placeholder.appendChild(document.createElement("br"));
                editor.refContent.appendChild(placeholder);
                range.selectNode(placeholder);
                range.collapse(true);
            }
            else if(editor.dom.nodeIsTextOrVoid(nodes[0].node) && (nodes[0].node.parentElement === editor.refContent || nodes[0].node.parentElement.nodeName === "DIV" || nodes[0].node.parentElement.childNodes.length > 1)) {
                const placeholder = document.createElement('span');
                placeholder.setAttribute("style", attr+":"+value);
                editor.dom.wrapNode(nodes[0].node,placeholder);
                editor.dom.setCaretAt(nodes[0].node,nodes[0].startOffset);
            }
            else if(!editor.dom.nodeIsTextOrVoid(nodes[0].node)){
                //change existing color
                editor.dom.nodeReplaceAttrStyle(nodes[0].node as HTMLElement, attr, value);
            }
            else{
                //change existing color
                editor.dom.nodeReplaceAttrStyle(nodes[0].node.parentElement, attr, value);
            }
            editor.triggerChange();
            return;
        }
        nodes.forEach( (node) => {
            if(node.isVoid) {
                if(node === nodes[nodes.length - 1]) {
                    editor.dom.setCaretAt(node.node, 1);
                }
                return;
            }

            if(node.partial) {
                //extract the string to be colored
                const str = node.node.textContent!.substring(node.startOffset!,node.endOffset);
                const span = document.createElement('span');
                span.appendChild(document.createTextNode(str));
                span.setAttribute("style", attr+":"+value);
                if(nodes.length === 1) {
                    //string in middle
                    range.deleteContents();
                    range.insertNode(span);
                    editor.dom.setCaretAt(span.childNodes[0], span.childNodes[0].textContent?.length);
                }
                else if(node === nodes[0]) {
                    //append to start
                    editor.dom.nodesInsertAfter([span], node.node);
                    node.node.textContent = node.node.textContent!.substring(0, node.startOffset);
                } else {
                    //insert before end
                    node.node.parentElement?.insertBefore(span, node.node);
                    node.node.textContent = node.node.textContent!.substring(node.endOffset!);
                    editor.dom.setCaretAt(nodes[nodes.length - 1].node, nodes[nodes.length - 1].endOffset);
                }
            } else {
                editor.dom.nodeReplaceAttrStyle(node.node.parentElement!, attr, value);
                //put caret at the beginning of next
                if(node === nodes[nodes.length - 1]) {
                    editor.dom.setCaretAt(range.endContainer, range.endOffset);
                }
            }
        });
        editor.dom.mergeTags(range.commonAncestorContainer as HTMLElement, "span");
        editor.triggerChange(); 
    }
    
}] as SubEditorEvent[];


