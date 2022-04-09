import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

export default [{
    event : "onCommand",
    target : ["hr"],
    callback : (editor :SubEditor, cmd : string, value : any) => {
        const {range} = editor.getSelectionRange();
        
        const node = document.createElement("hr");
        //not allow hr,table,list in code
        if(range.endContainer.parentElement!.nodeName === "CODE") {
            let el = range.endContainer.parentElement as HTMLElement;
            if(el.parentElement!.nodeName === "PRE") el = el.parentElement as HTMLElement;
            editor.dom.nodesInsertAfter([node],el);
            editor.triggerChange();
            return;
        }
        range.deleteContents();
        range.insertNode(node);
        
        
        //clean up empty text node
        if(node.parentElement!.childNodes.length > 1 && node === node.parentElement!.childNodes[node.parentElement!.childNodes.length-2] && node.nextSibling?.nodeType === Node.TEXT_NODE && node.nextSibling?.textContent === "") {
            node.nextSibling.remove();
        }
        const usableParent = (node : Node) => {
            const path : Node[] = [];
            path.push(node);
            while(editor.dom.nodeIsTextInlineOrVoid(node) && node !== editor.refContent && ["DIV","TD","TH","LI"].indexOf(node.nodeName) === -1) {
                node = node.parentNode as Node;
                path.push(node);
            }
            return path;
        }
        const nodePath = usableParent(node);
       
        //break paragraph
        const pNode = nodePath.find(n => n.nodeName === "P");
        if(pNode) {
            if(node.parentElement?.nodeName !== "P") {
                editor.dom.nodeBreak(pNode, node);
            }
            const hrs = Array.from(node.parentElement!.querySelectorAll("hr"));
            let i = hrs.length-1;
            if(!hrs[i].nextSibling) {
                editor.dom.nodesInsertAfter([hrs[i]], node.parentElement!);
                i--;
            }
            for(; i >= 0; i--) {
                const p = document.createElement("p");
                let n = hrs[i].nextSibling, children : Node[] = [];
                while(n) {
                    children.push(n);
                    n = n.nextSibling;
                }
                children.forEach(c => p.appendChild(c));
                editor.dom.nodesInsertAfter([hrs[i],p], node.parentElement!);
                
            }
        }
        
        range.setEndAfter(node);
        range.collapse(false);

        if(editor.refContent.lastChild === node) {
            if(editor.refContent.lastElementChild?.previousElementSibling?.nodeName === "P") {
                //create a new paragraph
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
                range.setEndBefore(p.childNodes[0]);
                range.collapse(false);
            } else {
                editor.refContent.appendChild(document.createElement("br"));
                range.setEndAfter(editor.refContent.lastChild);
                range.collapse(false);
            }
            
        } 

        editor.triggerChange();
    }
}] as SubEditorEvent[];
