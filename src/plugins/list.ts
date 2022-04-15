import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";


const usableParent = (node : Node, editor : SubEditor) => {
    const path : Node[] = [];
    do {
        path.push(node);
        node = node.parentNode as Node;
    }while(editor.dom.nodeIsTextInlineOrVoid(node));

    return path;
}

export default [
    {
        event : "onKeyDown",
        target : ["enter"],
        callback : (editor :SubEditor) => {
            //enter+enter on last li will exit the list with a new div, which is not prefered, convert it to p or unwrap
            if(!editor.feature!.path.includes("LI")) return;

            const {range} = editor.getSelectionRange();
            const nodes = editor.dom.selectDeepNodesInRange(range);
            if(nodes.length === 0) return;

            const firstNode = nodes[0].node;
            const pFirstNode = editor.dom.nodeParent(firstNode, "LI");
            const listNode = pFirstNode?.parentElement!;
            //skip if NOT enter+enter, and skip if has upper level list
            if(!pFirstNode || pFirstNode.textContent !== "" || editor.dom.nodeParent(pFirstNode.parentElement!, "LI")) return;
            
            setTimeout(() => {
                const div = listNode.nextElementSibling!;
                if(div.nodeName === "DIV") {
                    if(div.textContent === "") {
                        if(listNode.previousElementSibling && listNode.previousElementSibling.nodeName === "P") {
                            const p = document.createElement("P");
                            p.appendChild(document.createElement("BR"));
                            div.replaceWith(p);
                            editor.dom.setCaretAt(p.firstChild!,0);
                        } else {
                            const br = document.createElement("br");
                            div.replaceWith(br);
                            editor.dom.setCaretAt(br,0);
                        }
                        
                        editor.triggerChange();
                        return;
                    }
                }
            },1);

            
        }
    },
    {
        event : "onKeyDown",
        target : ["backspace"],
        callback : (editor :SubEditor, e : KeyboardEvent) => {
            if(!editor.feature!.path.includes("LI")) return;

            const {range} = editor.getSelectionRange();
            if(range.startOffset !== 0) return;
            const nodes = editor.dom.selectDeepNodesInRange(range);
            if(nodes.length === 0) return;

            const firstNode = nodes[0].node;
            const pFirstNode = editor.dom.nodeParent(firstNode, "LI");
            //skip in case if the node is somewhere in middle of li, or not the first li of list
            if(!pFirstNode || pFirstNode.textContent?.indexOf(firstNode.textContent!) !== 0 || pFirstNode !== pFirstNode.parentElement!.firstElementChild) return;
            //check if there's an upper level list:
            const upperListLi = editor.dom.nodeParent(pFirstNode.parentElement!, "LI");
            if(!upperListLi) return;

            e.preventDefault();
            e.stopPropagation();
            //move current list into upper
            const listDelete = pFirstNode.parentElement!;
            const lis : Node[] = [];
            Array.from(pFirstNode.parentElement!.childNodes).forEach(n => {
                if(n.textContent !== "") lis.push(n);
            });
            editor.dom.nodesInsertAfter(lis, upperListLi);
            listDelete.remove();
            
            
        }
    },
    {
        event : "onKeyDown",
        target : ["tab"],
        callback : (editor :SubEditor, e : KeyboardEvent) => {
            //tab: create a sub list
            if(!editor.feature!.path.includes("LI")) return;

            const {range} = editor.getSelectionRange();
            if(range.startOffset !== 0) return;
            
            const nodes = editor.dom.selectDeepNodesInRange(range);
            if(nodes.length === 0) return;

            const firstNode = nodes[0].node;
            const pFirstNode = editor.dom.nodeParent(firstNode, "LI")!;
            //skip in case if the node is somewhere in middle of li,or is first li
            if(!pFirstNode || pFirstNode.textContent?.indexOf(firstNode.textContent!) !== 0 || pFirstNode === pFirstNode.parentElement!.firstElementChild) return;
            e.preventDefault();
            e.stopPropagation();
            //turn content of li to new ul
            const li = document.createElement("LI");

            Array.from(pFirstNode.childNodes).forEach(n => li.appendChild(n));
            const ul = document.createElement("UL");
            ul.appendChild(li);
            (pFirstNode as HTMLElement).previousElementSibling!.appendChild(ul);
            
            nodes.forEach(n => {
                if(n.node === firstNode) return;
                const pNode = editor.dom.nodeParent(n.node, "LI")!;
                ul.appendChild(pNode);
            });
            pFirstNode.parentElement!.removeChild(pFirstNode);
            range.selectNode(ul.firstElementChild!);
            range.collapse(true);
            
        }
    },
    {
    event : "onCommand",
    target : ["list", "ol", "ul"],
    callback : (editor :SubEditor, type : string, cmd : any) => {
        if(editor.feature?.path.includes("CODE")) return;

        if(type === "ol" || type === "ul") cmd = type;

        //type=list,cmd=ol,ul,remove
        const {range} = editor.getSelectionRange();
        const swap = cmd === "ol" ? "UL" : "OL", rangeEl = range.endContainer, rangeOffset = range.endOffset;
        const nodes = editor.dom.selectDeepNodesInRange(range);
        range.collapse(false);
        const focusNode = () => editor.dom.setCaretAt(rangeEl, rangeOffset);
        
        if(nodes.length === 0) return;
        if(nodes[0].node === editor.refContent && editor.refContent.textContent === "") {
            editor.refContent.appendChild(document.createElement(cmd));
            editor.refContent.firstChild?.appendChild(document.createElement("li"));
            range.selectNode(editor.refContent.firstChild!.firstChild!);
            range.collapse(true);
            editor.handleFeature();
            editor.triggerChange();
            return;
        }
        const firstNode = nodes[0].node, firstPath = editor.dom.nodeParentUntil(firstNode, editor.refContent);
        if(firstPath.find(el => el.nodeName === "CODE")) return;
        //replace
        if(firstPath.find(el => el.nodeName === "LI")?.parentElement?.nodeName === swap) {
            nodes.forEach(n => {
                const list = editor.dom.nodeParent(n.node, "LI", editor.refContent)?.parentElement;
                if(list && list.nodeName !== cmd) {
                    const el = document.createElement(cmd);
                    Array.from(list.childNodes).forEach((element : Node) => el.appendChild(element));
                    list.parentElement!.insertBefore(el,list);
                    list.parentElement!.removeChild(list);
                }
            });
            focusNode();
            editor.handleFeature();
            editor.triggerChange();
            return;
        }
        //unwrap
        if(nodes.find(n => editor.dom.nodeParentUntil(n.node, editor.refContent).find(el => el.nodeName === "LI"))) {
            const ols : HTMLElement[] = [];
            nodes.forEach(n => {
                const li = editor.dom.nodeParent(n.node, "LI", editor.refContent);
                ols.push(li?.parentElement!);
                if(li) {
                    if(li !== li.parentElement!.lastChild) {
                        li?.appendChild(document.createElement("br"));
                    }
                    editor.dom.unwrapNode(li, editor.refContent);
                }
            });
            ols.forEach(ol => {
                if(ol.querySelectorAll("li").length === 0) {
                    editor.dom.unwrapNode(ol, editor.refContent);
                    return;
                }
                let placeholder : HTMLElement | null = null;
                for(let i = ol.childNodes.length-1; i >= 0;i--) {
                    if(ol.childNodes[i].nodeName !== "LI") {
                        editor.dom.nodesInsertAfter([ol.childNodes[i]], ol);
                        placeholder = null;
                    }
                    else{
                        if(placeholder) {
                            placeholder.insertBefore(ol.childNodes[i], placeholder.childNodes[0]);
                        } else {
                            placeholder = document.createElement(ol.nodeName);
                            placeholder.appendChild(ol.childNodes[i]);
                            editor.dom.nodesInsertAfter([placeholder], ol);
                        }
                    }
                }
                if(ol.querySelectorAll("li").length === 0) {
                    editor.dom.unwrapNode(ol, editor.refContent);
                }
            });
            focusNode();
            editor.handleFeature();
            editor.triggerChange();
            return;
        }

        let lastPlaceholder : HTMLElement | null = null;
        nodes.forEach(n => {
            const paths = usableParent(n.node,editor), el = paths[paths.length-1];
            if(!lastPlaceholder || (el as HTMLElement).previousElementSibling !== lastPlaceholder ) {
                lastPlaceholder = document.createElement(cmd);
                if(el === editor.refContent) {
                    editor.refContent.appendChild(lastPlaceholder!);
                } else {
                    el.parentElement?.insertBefore(lastPlaceholder!,el);
                }
                
            }
            editor.dom.wrapNode(el, document.createElement("li"));
            lastPlaceholder?.appendChild(el.parentElement!);

        });
        editor.dom.setCaretAt(lastPlaceholder!.lastChild!.lastChild!,0);
        editor.handleFeature();
        editor.triggerChange();
    }
}] as SubEditorEvent[];
