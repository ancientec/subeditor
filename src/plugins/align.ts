import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [{
    event : "onCommand",
    target : ["align"],
    callback : (editor :SubEditor, cmd : string, value : any) => {

        const attr = "text-align";
        const {range} = editor.getSelectionRange();

        const nodes = editor.dom.selectDeepNodesInRange(range);
        if(nodes[0].collapsed && nodes[0].node.parentElement) {
            if(nodes[0].node === editor.refContent) {
                const placeholder = document.createElement('p');
                placeholder.setAttribute("style", attr+":"+value);
                placeholder.appendChild(document.createElement("br"));
                editor.refContent.appendChild(placeholder);
                range.selectNode(placeholder);
                range.collapse(false);
            }
            else if(nodes[0].node.nodeType === Node.TEXT_NODE && nodes[0].node.parentElement === editor.refContent) {
                const placeholder = document.createElement('p');
                placeholder.setAttribute("style", attr+":"+value);
                editor.dom.wrapNode(nodes[0].node,placeholder);
                editor.dom.setCaretAt(nodes[0].node,nodes[0].startOffset); 
            }
            else{
                //change
                editor.dom.nodeReplaceAttrStyle(nodes[0].node.parentElement, attr, value);
            }
            editor.triggerChange(); 
            return;
        }
        let lastPlaceholdler : HTMLParagraphElement | null = null;
        nodes.forEach( (node) => {
            if(node.node.parentElement === editor.refContent) {
                if(lastPlaceholdler === null || lastPlaceholdler !== node.node.previousSibling) {
                    lastPlaceholdler = document.createElement('p');
                    lastPlaceholdler.setAttribute("style", attr+":"+value);
                    editor.dom.wrapNode(node.node,lastPlaceholdler);
                } else {
                    //reuse,merge into pervious
                    lastPlaceholdler.appendChild(node.node);
                }
                
            } else {
                editor.dom.nodeReplaceAttrStyle(node.node.parentElement!, attr, value);
            }
        });
        //in case if we miss anything
        //editor.dom.mergeTags(range.commonAncestorContainer as HTMLElement, "p");
        if(nodes[nodes.length - 1].isVoid) {
            //next of this element
            editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
        } else {
            editor.dom.setCaretAt(range.endContainer, range.endOffset);
        }
        editor.triggerChange();
    }
}] as SubEditorEvent[];
