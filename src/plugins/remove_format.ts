import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [
{
    event : "onCommand",
    target : ["remove_format"],
    callback : (editor :SubEditor) => {

        const {range} = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);

        nodes.forEach( (node) => {
            let el = node.node.nodeType === Node.TEXT_NODE ? node.node.parentElement! : node.node as HTMLElement;
            while(["DIV","TD","LI"].indexOf(el.nodeName) === -1) {
                if(["H1","H2","H3","H4","H5","H6","CODE","B","STRONG","I","EM","U","PRE","BLOCKQUOTE","A","STRIKE","SUB","SUP","SPAN"].indexOf(el.nodeName) !== -1) {
                    const unwrap = el;
                    el = el.parentElement!;
                    editor.dom.unwrapNode(unwrap as Node);
                } else {
                    if(el.style.color) el.style.color = "";
                    if(el.style.backgroundColor) el.style.backgroundColor = "";
                    el = el.parentElement!;
                }
            }
            if(el.style.color) el.style.color = "";
            if(el.style.backgroundColor) el.style.backgroundColor = "";
            
        });
        editor.triggerChange(); 
    }
    
}] as SubEditorEvent[];


