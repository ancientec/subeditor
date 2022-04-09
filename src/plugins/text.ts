import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";
import { RangeNode } from "../dom";

const tags :  {[key: string]: string} ={"bold" : "strong", "italic" : "em","underline" : "u","strikethrough" : "strike","subscript" : "sub","superscript" : "sup"};
const tag_values = Object.values(tags);
tag_values.push("i");
const isText = (t : string) : boolean => tag_values.indexOf(t.toLowerCase()) !== -1;
const isInText = (n : Node, matchNodeName : string) : Node | boolean => {
    do {
        if (n.nodeName.toLowerCase() === matchNodeName || (matchNodeName === "em" && n.nodeName === "I")) {
          return n;
        }
        n = n.parentElement as Node;
    }while(n && isText(n.nodeName));
    return false;
}
export default [
{
    event : "onCommand",
    target : ["bold", "italic","underline","strikethrough","subscript","superscript"],
    callback : (editor :SubEditor, type : string) => {
        
        const tag = tags[type];
        const {range} = editor.getSelectionRange();
        let caretNode = range.endContainer, caretOffset = range.endOffset;

        const nodes = editor.dom.selectDeepNodesInRange(range);

        //determine if we are wrapping or unwrap:
        const firstTextNode = nodes.find(n => n.node.nodeType === Node.TEXT_NODE);
        const needWrap = !firstTextNode || !isInText(firstTextNode.node, tag);

        const formatNode = (n : RangeNode) => {
            const placeholder = document.createElement(tag);
            const parentNode = isInText(n.node, tag);
            if(needWrap && !parentNode) {
                editor.dom.wrapNode(n.node,placeholder);
            }
            else if(!needWrap && parentNode){
                //unwrap
                editor.dom.unwrapNode(parentNode as Node, editor.refContent);
            } 
        }

        caretNode = nodes[nodes.length - 1].node;
        caretOffset = nodes[nodes.length - 1].endOffset!;
        const resetCaret = () => {
            editor.dom.setCaretAt(caretNode, caretOffset);
            editor.triggerChange(); 
        }

        if(nodes[0].collapsed) {
            if(nodes[0].node === editor.refContent) {
                const placeholder = document.createElement(tag);
                editor.refContent.appendChild(placeholder);
                placeholder.appendChild(document.createElement("br"));
                range.selectNode(placeholder);
                range.collapse(true);
                editor.triggerChange();
                return;
            }
            //only handle text nodes
            if(nodes[0].node.nodeType === Node.TEXT_NODE && nodes[0].node.parentElement) formatNode(nodes[0]);
            //maybe insert into end of doc
            editor.dom.mergeTags(range.commonAncestorContainer as HTMLElement, tag);
            return resetCaret();
        }
        
        nodes.forEach( (node) => {
            if(node.isVoid) {
                return;
            }
            if(!node.partial)  {
                formatNode(node);
                return;
            }

            //handle beginng and
            const parentNode = isInText(node.node, tag);
            if(needWrap && !parentNode) {
                //extract the string to be styled
                const str = node.startOffset !== undefined && node.startOffset > -1 ? node.node.textContent!.substring(node.startOffset,node.endOffset) : node.node.textContent!;
                const span = document.createElement(tag);
                span.appendChild(document.createTextNode(str));
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
                } else if(node === nodes[nodes.length - 1]){
                    //insert before end
                    node.node.parentElement?.insertBefore(span, node.node);
                    node.node.textContent = node.node.textContent!.substring(node.endOffset!);
                }
            } else if(!needWrap && parentNode){
                //unwrap
                editor.dom.unwrapNode(parentNode as Node, editor.refContent);
            }
        });
        editor.dom.mergeTags(range.commonAncestorContainer as HTMLElement, tag);
        resetCaret();

    }
    
}] as SubEditorEvent[];