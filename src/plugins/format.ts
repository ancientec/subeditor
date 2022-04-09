import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

const clonePath = (paths : Node[], content : string | null = null) : Node => {
    if(paths[paths.length-1].nodeType === Node.TEXT_NODE) {
        return document.createTextNode(content ? content : paths[paths.length-1].textContent!) as Node;
    }
    const el = document.createElement(paths[paths.length-1].nodeName);
    for(let i = paths.length-2; i >= 0; i--) {
        if(paths[i].nodeType === Node.TEXT_NODE) {
            el.appendChild(document.createTextNode(content ? content : paths[paths.length-1].textContent!));
        }else el.appendChild(document.createElement(paths[i].nodeName))
    }
    return el as Node;
}
const replaceNode = (node : HTMLElement, tag : string) => {
    const n = document.createElement(tag);
    Array.from(node.childNodes).forEach(c => n.appendChild(c));
    node.replaceWith(n);
}
const usableParent = (node : Node, editor : SubEditor) => {
    const path : Node[] = [];
    do {
        path.push(node);
        node = node.parentNode as Node;
    }while(editor.dom.nodeIsTextInlineOrVoid(node) && node.nodeName !== "SPAN");

    return path;
}
const formatAction = (n : Node, matchNodeName : string) => {
    const path : string[] = [], path_nodes : Node[] = [], stopTags = ["TD","P","DIV","LI","CODE"];
    let path_node = n;
    while(path_node && stopTags.indexOf(path_node.nodeName) === -1) {
        path.push(path_node.nodeName);
        path_nodes.push(path_node);
        path_node = path_node.parentElement as Node;
    }
    let action = "wrap";
    if(path.indexOf(matchNodeName) !== -1) {
        action = "unwrap";
        path_node = path_nodes[path.indexOf(matchNodeName)];
    }
    else if(path.indexOf(matchNodeName) === -1){
        for(var i = 0, j = path.length;i < j; i++) {
            if(['H1','H2','H3','H4','H5','H6'].indexOf(path[i]) !== -1) {
                action = 'replace';
                path_node = path_nodes[i];
                break;
            }
        }
    }
    return {action : action, node : action ===  'wrap' ? null : path_node};
}
export default [
    {
        event : "onKeyDown",
        target : ["enter"],
        callback : (editor :SubEditor, e : KeyboardEvent) => {
            //allow code to have multi line
            if(!editor.feature?.path.includes("BLOCKQUOTE")) return;

            const {range} = editor.getSelectionRange();
            range.deleteContents();
            range.collapse(false);
            const nodes =  editor.dom.selectDeepNodesInRange(range);
            const end = nodes[0].node.textContent!.substring(nodes[0].startOffset!);
            const start = nodes[0].node.textContent?.substring(0,nodes[0].startOffset);
            if(end) {
                editor.dom.nodesInsertAfter(
                    [document.createElement("br"),document.createTextNode(end)],
                    nodes[0].node);
                editor.dom.setCaretAt(nodes[0].node.nextSibling!.nextSibling!,0);
            } else {
                editor.dom.nodesInsertAfter([document.createElement("br")],nodes[0].node);
                range.selectNode(nodes[0].node.nextSibling!);
                range.collapse(false);
            }
            if(start) {
                nodes[0].node.textContent = start;
            } else {
                nodes[0].node.parentElement?.removeChild(nodes[0].node);
            }
            
            e.preventDefault();
            e.stopPropagation();
            editor.triggerChange();
        }
    },
    {
        event : "onCommand",
        target : ['blockquote'],
        callback : (editor : SubEditor) => {
            const {range} = editor.getSelectionRange();
            const nodes = editor.dom.selectDeepNodesInRange(range);

            //determine if we want to replace tag or insert:
            //replace with text: selected text range
            //insert at the end: collapsed, caret at end of p,h1-h6,etc

            if(nodes[0].collapsed) {
                if(nodes[0].node === editor.refContent) {
                    const placeholder = document.createElement("blockquote");
                    placeholder.appendChild(document.createElement("br"));
                    editor.refContent.appendChild(placeholder);
                    //append a final paragraph if its end of content
                    const endP = document.createElement("P");
                    endP.appendChild(document.createElement("BR"));
                    editor.refContent.appendChild(endP);
                    editor.dom.setCaretAt(placeholder,0); 
                    return;
                }
                const paths = usableParent(nodes[0].node, editor);
                const pEL = paths[paths.length - 1].parentElement!;

                const endOfEl = nodes[0].collapsed && ["P","CODE","BLOCKQUOTE","H1","H2","H3","H4","H5","H6","DIV"].indexOf(pEL.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && nodes[0].node.textContent?.length === nodes[0].endOffset && pEL.lastChild === paths[paths.length-1];
                
                if(endOfEl) {
                    const el = document.createElement("blockquote");
                    el.appendChild(document.createElement("br"));
                    if(pEL === editor.refContent) {
                        pEL.appendChild(el);
                    }else if (pEL.nodeName === "CODE" && pEL.parentElement?.nodeName === "PRE") {
                        pEL.parentElement.parentElement!.appendChild(el);
                    }
                      else {
                        pEL.parentElement!.appendChild(el);
                        
                    }
                    if(el === editor.refContent.lastChild) {
                        if(el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                            const p = document.createElement("p");
                            p.appendChild(document.createElement("br"));
                            editor.refContent.appendChild(p);
                        } else {
                            editor.refContent.appendChild(document.createElement("br"));
                        }
                        
                    }
                    editor.dom.setCaretAt(el.firstChild!,0);
                    editor.triggerChange();
                    return;
                }
                //replace if only child
                if(paths[paths.length-1].nodeType === Node.TEXT_NODE && pEL.childNodes.length === 1 && paths[0].childNodes.length <= 1) {//TEXT_NODE.childNodes===0
                    if(pEL.nodeName === "BLOCKQUOTE") return;
                    const el = document.createElement("blockquote");
                    if(pEL === editor.refContent) {
                        pEL.insertBefore(el, paths[paths.length-1]);
                        el.appendChild(document.createTextNode(paths[paths.length-1].textContent || ""));
                    } else if(pEL.nodeName === "CODE" && pEL.parentElement?.nodeName === "PRE") {
                        el.appendChild(paths[paths.length-1]);
                        pEL.parentElement.replaceWith(el);
                    } else {
                        el.appendChild(paths[paths.length-1]);
                        pEL.replaceWith(el);
                    }
                    if(el === editor.refContent.lastChild) {
                        if(el.previousElementSibling &&  el.previousElementSibling.nodeName === "P") {
                            const p = document.createElement("p");
                            p.appendChild(document.createElement("br"));
                            editor.refContent.appendChild(p);
                        } else {
                            editor.refContent.appendChild(document.createElement("br"));
                        }
                        
                    }
                    editor.triggerChange();
                    return;
                }
            }
            let lastPlaceholdler : HTMLElement | null = null;
            let lastParent : HTMLElement | null = null;
            const breakableParent = (name : string) => ["P","CODE","H1","H2","H3","H4","H5","H6"].includes(name);
            nodes.forEach(n => {

                const paths = usableParent(n.node, editor);
                if(paths[paths.length-1].parentElement!.nodeName === "BLOCKQUOTE") return;

                const isCodePre = paths[paths.length-1].parentElement!.nodeName === "CODE" && paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE";

                if(!n.collapsed && n.partial) {
                    const str = n.node.textContent!.substring(n.startOffset!,n.endOffset);
                    const strBegin = n.node.textContent!.substring(0,n.startOffset);
                    const strEnd = n.node.textContent!.substring(n.endOffset!);
                    
                    lastPlaceholdler = document.createElement("blockquote");
                    lastPlaceholdler.appendChild(document.createTextNode(str));
                    
                    if(strEnd) {
                        if(breakableParent(paths[paths.length-1].parentElement!.nodeName)) {
                            if(isCodePre) {
                                const endEl = document.createElement("PRE");
                                endEl.appendChild(document.createElement("CODE"));
                                endEl.firstChild!.appendChild(clonePath(paths, strEnd));
                                editor.dom.nodesInsertAfter([lastPlaceholdler,endEl],paths[paths.length-1].parentElement!.parentElement!);
                            } else {
                                const endEl = document.createElement(paths[paths.length-1].parentElement!.nodeName);
                                endEl.appendChild(clonePath(paths, strEnd));
                                editor.dom.nodesInsertAfter([lastPlaceholdler,endEl],paths[paths.length-1].parentElement!);
                            }
                            
                        } else {
                            editor.dom.nodesInsertAfter([lastPlaceholdler,clonePath(paths, strEnd)],paths[paths.length-1]);
                        }
                    } else {
                        if(isCodePre) {
                            editor.dom.nodesInsertAfter([lastPlaceholdler],paths[paths.length-1].parentElement!.parentElement!);
                        } else {
                            editor.dom.nodesInsertAfter([lastPlaceholdler],breakableParent(paths[paths.length-1].parentElement!.nodeName)? paths[paths.length-1].parentElement! : paths[paths.length-1]);
                        }
                        
                    }
                    if(strBegin) {
                        paths[0].textContent = strBegin;
                    } else {
                        paths[paths.length-1].parentElement!.removeChild(paths[paths.length-1]);

                    }
                    editor.dom.setCaretAt(lastPlaceholdler.firstChild!,lastPlaceholdler.firstChild!.textContent?.length);
                    return;
                }
                const pEL = paths[paths.length-1].parentElement!;
                //remove blank
                if(paths[0].textContent === "" && pEL.childNodes.length === 0) {
                    pEL.remove();
                    return;
                }
                if(lastPlaceholdler && lastParent && lastParent === pEL) {
                    lastPlaceholdler.appendChild(paths[paths.length-1]);
                } else {
                    lastPlaceholdler = document.createElement("blockquote");
                    lastParent = pEL;
                    if(isCodePre) {
                        if(pEL.firstChild !== paths[paths.length-1]) {
                            const cloneEl = document.createElement("PRE");
                            cloneEl.appendChild(document.createElement("CODE"));
                            cloneEl.firstChild!.appendChild(paths[paths.length-1].previousSibling!);
                            while(paths[paths.length-1].previousSibling) {
                                cloneEl.firstChild!.insertBefore(paths[paths.length-1].previousSibling!, cloneEl.firstChild!.firstChild);
                            }
                            pEL.parentElement!.parentElement!.insertBefore(cloneEl, pEL.parentElement);
                        }
                        pEL.parentElement!.parentElement!.insertBefore(lastPlaceholdler, pEL.parentElement);
                    } else if(breakableParent(pEL.nodeName)){
                        if(pEL.firstChild !== paths[paths.length-1]) {
                            const cloneEl = document.createElement(pEL.nodeName);
                            cloneEl.appendChild(paths[paths.length-1].previousSibling!);
                            while(paths[paths.length-1].previousSibling) {
                                cloneEl.insertBefore(paths[paths.length-1].previousSibling!, cloneEl.firstChild);
                            }
                            pEL.parentElement!.insertBefore(cloneEl, pEL);
                        }
                        pEL.parentElement!.insertBefore(lastPlaceholdler, pEL);
                    } else {
                        pEL.insertBefore(lastPlaceholdler, paths[paths.length-1]);
                    }
                    lastPlaceholdler?.appendChild(paths[paths.length-1]);                    
                }
                
                if(pEL.childNodes.length === 0) {
                    if(isCodePre) {
                        pEL.parentElement?.remove();
                    } else {
                        pEL.remove();
                    }
                }
                    
                if(n === nodes[nodes.length-1]) {
                    editor.dom.setCaretAt(n.node,n.endOffset);
                    if(lastPlaceholdler && lastPlaceholdler === editor.refContent.lastChild) {
                        if(lastPlaceholdler.parentElement!.nodeName === "P") {
                            const p = document.createElement("p");
                            p.appendChild(document.createElement("br"));
                            editor.refContent.appendChild(p);
                        } else {
                            editor.refContent.appendChild(document.createElement("br"));
                        }
                        
                    }
                }
            });
            editor.triggerChange();
        }
    },
    {
        event : "onKeyDown",
        target : ["backspace"],
        callback : (editor :SubEditor, e : KeyboardEvent) => {
            //prevent backspace on beginning will remove code
            if(!editor.feature!.path.includes("CODE")) return;

            const {range} = editor.getSelectionRange();
            if(!range.collapsed || range.startOffset !== 0 && !(range.startOffset === 1 && (range.startContainer.textContent === " " || range.startContainer.textContent === "\n"))) return;

            const el = editor.feature!.pathNode[editor.feature!.path.indexOf("PRE")] || editor.feature!.pathNode[editor.feature!.path.indexOf("CODE")];
            const prevEl = el.previousSibling;

            if(range.startContainer.textContent === "" || range.startContainer.textContent === "\n") {
                //delete code
                el.remove();
                
            }
            if(prevEl){
                //move caret to prevEl instead
                range.selectNode(prevEl);
                const nodes = editor.dom.selectDeepNodesInRange(range);
                editor.dom.setCaretAt(nodes[nodes.length-1].node, nodes[nodes.length-1].node.textContent!.length);
            }
            e.preventDefault();
            e.stopPropagation();
            editor.triggerChange();
        }
    },
    {
        event : "onKeyDown",
        target : ["enter"],
        callback : (editor :SubEditor, e : KeyboardEvent) => {
            //allow code to have multi line
            if(!editor.feature?.path.includes("CODE")) return;

            const {range} = editor.getSelectionRange();
            range.deleteContents();
            range.collapse(false);
            const nodes =  editor.dom.selectDeepNodesInRange(range);
            nodes[0].node.textContent = nodes[0].node.textContent?.substring(0,nodes[0].startOffset) + "\n" + nodes[0].node.textContent?.substring(nodes[0].startOffset!);
            editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset!+1);
            e.preventDefault();
            e.stopPropagation();
            editor.triggerChange();
        }
    },
    {
        event : "onCommand",
        target : ['code'],
        callback : (editor :SubEditor) => {
            const {range} = editor.getSelectionRange();
            const nodes = editor.dom.selectDeepNodesInRange(range);

            //determine if we want to replace tag or insert:
            //replace with text: selected text range
            //insert at the end: collapsed, caret at end of p,h1-h6,etc

            if(nodes[0].collapsed) {
                if(nodes[0].node === editor.refContent) {
                    const placeholder = document.createElement("pre");
                    placeholder.appendChild(document.createElement("code"));
                    placeholder.firstChild!.appendChild(document.createTextNode("\n"));
                    editor.refContent.appendChild(placeholder);
                    //append a final paragraph if its end of content
                    const endP = document.createElement("P");
                    endP.appendChild(document.createElement("BR"));
                    editor.refContent.appendChild(endP);
                    editor.dom.setCaretAt(placeholder,0); 
                    return;
                }
                const paths = usableParent(nodes[0].node, editor);
                const pEL = paths[paths.length-1].parentElement!;
                const endOfEl = ["P","CODE","BLOCKQUOTE","H1","H2","H3","H4","H5","H6","DIV"].indexOf(pEL.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && nodes[0].node.textContent?.length === nodes[0].endOffset && pEL.lastChild === paths[paths.length-1];
                
                if(endOfEl) {
                    const el = document.createElement("pre");
                    el.appendChild(document.createElement("code"));
                    el.childNodes[0].appendChild(document.createTextNode("\n"))
                    if(pEL.nodeName === "CODE" && pEL.parentElement!.nodeName === "PRE") {
                        pEL.parentElement!.parentElement!.appendChild(el);
                    } else if(pEL === editor.refContent) {
                        pEL.appendChild(el);
                    }  else {
                        pEL.parentElement!.appendChild(el);
                        
                    }
                    editor.dom.setCaretAt(el.childNodes[0].childNodes[0],0);
                    if(el === editor.refContent.lastChild) {
                        if(el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                            const p = document.createElement("p");
                            p.appendChild(document.createElement("br"));
                            editor.refContent.appendChild(p);
                        } else {
                            editor.refContent.appendChild(document.createElement("br"));
                        }
                        
                    }
                    editor.triggerChange();
                    return;
                }
                //replace if only child
                if(paths[paths.length-1].nodeType === Node.TEXT_NODE && pEL.childNodes.length === 1 && paths[0].childNodes.length <= 1) {//TEXT_NODE.childNodes===0
                    if(pEL.nodeName === "CODE") return;
                    const el = document.createElement("pre");
                    el.appendChild(document.createElement("code"));
                    if(pEL === editor.refContent) {
                        pEL.insertBefore(el, paths[paths.length-1]);
                        el.childNodes[0].appendChild(document.createTextNode(paths[paths.length-1].textContent || ""));
                    } else {
                        el.childNodes[0].appendChild(paths[paths.length-1]);
                        pEL.replaceWith(el);
                    }
                    if(el === editor.refContent.lastChild) {
                        if(el.previousElementSibling &&  el.previousElementSibling.nodeName === "P") {
                            const p = document.createElement("p");
                            p.appendChild(document.createElement("br"));
                            editor.refContent.appendChild(p);
                        } else {
                            editor.refContent.appendChild(document.createElement("br"));
                        }
                        
                    }
                    editor.triggerChange();
                    return;
                }
            }
            let lastPlaceholdler : HTMLElement | null = null;
            const breakableParent = (name : string) => ["P","BLOCKQUOTE","H1","H2","H3","H4","H5","H6"].includes(name);
            nodes.forEach(n => {
                if(n.isVoid) return;
                const paths = usableParent(n.node, editor);
                if(paths[paths.length-1].parentElement!.nodeName === "CODE") return;

                if(!n.collapsed && n.partial) {
                    const str = n.node.textContent!.substring(n.startOffset!,n.endOffset);
                    const strBegin = n.node.textContent!.substring(0,n.startOffset);
                    const strEnd = n.node.textContent!.substring(n.endOffset!);
                    
                    lastPlaceholdler = document.createElement("pre");
                    lastPlaceholdler.appendChild(document.createElement("code"));
                    lastPlaceholdler.querySelector("code")?.appendChild(document.createTextNode(str));
                    if(strEnd) {
                        if(breakableParent(paths[paths.length-1].parentElement!.nodeName)) {
                            const endEl = document.createElement(paths[paths.length-1].parentElement!.nodeName);
                            endEl.appendChild(clonePath(paths, strEnd));
                            //add a break before:
                            editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler,endEl],paths[paths.length-1].parentElement!);

                        } else {
                            editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler,clonePath(paths, strEnd)],paths[paths.length-1]);
                        }
                    } else {
                        editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler],breakableParent(paths[paths.length-1].parentElement!.nodeName)? paths[paths.length-1].parentElement! : paths[paths.length-1]);
                    }
                    if(strBegin) {
                        paths[0].textContent = strBegin;
                    } else {
                        paths[paths.length-1].parentElement!.removeChild(paths[paths.length-1]);
                    }
                    editor.dom.setCaretAt(lastPlaceholdler.firstChild?.firstChild!,lastPlaceholdler.firstChild?.firstChild!.textContent?.length);
                    return;
                }
                //unwrap
                if(paths.length > 1) {
                    for(var i = 1, j = paths.length; i < j; i++) {
                        editor.dom.unwrapNode(paths[i]);
                    }
                }
                const pEL = paths[0].parentElement!;
                //remove blank
                if(paths[0].textContent === "" && pEL.childNodes.length === 0) {
                    pEL.remove();
                    return;
                }
                if(lastPlaceholdler && lastPlaceholdler === paths[0].previousSibling) {
                    lastPlaceholdler.firstChild!.appendChild(paths[0]);
                    if(pEL.childNodes.length === 0) {
                        pEL.remove();
                    }
                }else {
                    lastPlaceholdler = document.createElement("pre");
                    lastPlaceholdler.appendChild(document.createElement("code"));
                    lastPlaceholdler.firstChild?.appendChild(document.createTextNode(paths[0].textContent || ""));
                    if(breakableParent(pEL.nodeName)) {
                        if(pEL.firstChild !== paths[0]) {
                            const cloneEl = document.createElement(pEL.nodeName);
                            cloneEl.appendChild(paths[0].previousSibling!);
                            while(paths[0].previousSibling) {
                                cloneEl.insertBefore(paths[0].previousSibling, cloneEl.firstChild);
                            }
                            pEL.parentElement!.insertBefore(cloneEl, pEL);
                        }
                        pEL.parentElement!.insertBefore(lastPlaceholdler, pEL);
                    } else {
                        pEL.insertBefore(lastPlaceholdler, paths[0]);
                    }
                    if(pEL.childNodes.length === 1) {
                        pEL.remove();
                    } else {
                        pEL.removeChild(paths[0]);
                    }
                    if(n === nodes[nodes.length-1]) {
                        editor.dom.setCaretAt(lastPlaceholdler.firstChild?.firstChild!,n.endOffset);
                        if(lastPlaceholdler === editor.refContent.lastChild) {
                            if(lastPlaceholdler.parentElement!.nodeName === "P") {
                                const p = document.createElement("p");
                                p.appendChild(document.createElement("br"));
                                editor.refContent.appendChild(p);
                            } else {
                                editor.refContent.appendChild(document.createElement("br"));
                            }
                            
                        }
                    }
                }
                
            });
            editor.triggerChange();
        }
    },
    {
        event : "onCommand",
        target : ['p'],
        callback : (editor :SubEditor) => {
            const {range} = editor.getSelectionRange();
            const nodes = editor.dom.selectDeepNodesInRange(range);
            if(nodes.length === 1) {
                const n = nodes[0];
                //special cases:
                if(nodes[0].node === editor.refContent && nodes[0].collapsed) {
                    const placeholder = document.createElement("P");
                    placeholder.appendChild(document.createElement("BR"));
                    editor.refContent.appendChild(placeholder);
                    editor.dom.setCaretAt(placeholder,0); 
                    return;
                }
                //append new p, if we are at the end of p,h, code, blockquote
                const paths = usableParent(nodes[0].node, editor);
                const endOfEl = nodes[0].collapsed && ["P","CODE","BLOCKQUOTE","H1","H2","H3","H4","H5","H6"].indexOf(paths[paths.length-1].parentElement!.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && nodes[0].node.textContent?.length === nodes[0].endOffset && paths[paths.length-1].parentElement!.lastChild === paths[paths.length-1];
                if( n.node.nodeName === "HR" || endOfEl) {
                    const p = document.createElement("p");
                    p.appendChild(document.createElement("br"));
                    if(paths[paths.length-1].parentElement!.nodeName === "CODE" && paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE") {
                        paths[paths.length-1].parentElement!.parentElement!.parentElement!.appendChild(p);
                    } else if(paths[paths.length - 1].parentElement === editor.refContent) {
                        paths[paths.length - 1].parentElement!.appendChild(p);
                    }  else {
                        paths[paths.length-1].parentElement!.parentElement!.appendChild(p);
                        
                    }
                    editor.dom.setCaretAt(p.childNodes[0],0);
                    editor.triggerChange();
                    return;
                }
                if(n.collapsed || n.isVoid) {
                    if(paths[paths.length-1].parentElement === editor.refContent) {
                        editor.dom.wrapNode(paths[paths.length-1], document.createElement("p"));
                    } else if(paths[paths.length-1].parentElement!.nodeName === 'CODE') {
                        if(paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE") editor.dom.unwrapNode(paths[paths.length-1].parentElement!.parentElement!);
                        replaceNode(paths[paths.length-1].parentElement!, "P");
                    } else if (["H1","H2","H3","H4","H5","H6"].indexOf(paths[paths.length-1].parentElement!.nodeName) !== -1) {
                        replaceNode(paths[paths.length-1].parentElement!, "P");
                    } else {
                        editor.dom.wrapNode(paths[paths.length-1], document.createElement("p"));
                    }
                } else {
                    const str = n.node.textContent!.substring(n.startOffset!,n.endOffset);
                    const strBegin = n.node.textContent!.substring(0,n.startOffset);
                    const strEnd = n.node.textContent!.substring(n.endOffset!);
                    n.node.textContent = strBegin;
                    const pMiddle = document.createElement("p");
                    pMiddle.appendChild(clonePath(paths,str));
                    if(paths[paths.length-1].parentElement!.nodeName === "CODE") {
                        const pEnd = document.createElement(paths[paths.length-1].parentElement!.nodeName);
                        pEnd.appendChild(clonePath(paths,strEnd));
                        if(paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE") {
                            editor.dom.nodesInsertAfter([pMiddle,pEnd],paths[paths.length-1].parentElement!.parentElement!);
                            editor.dom.wrapNode(pEnd, document.createElement("PRE"));
                        } else {
                            editor.dom.nodesInsertAfter([pMiddle,pEnd],paths[paths.length-1].parentElement!);
                        }
                        
                    }
                    else if (["P","H1","H2","H3","H4","H5","H6"].indexOf(paths[paths.length-1].parentElement!.nodeName) !== -1) {
                        const pEnd = document.createElement(paths[paths.length-1].parentElement!.nodeName);
                        pEnd.appendChild(clonePath(paths,strEnd));
                        editor.dom.nodesInsertAfter([pMiddle,pEnd],paths[paths.length-1].parentElement!);
                    } else {
                        editor.dom.nodesInsertAfter([pMiddle,clonePath(paths,strEnd)],paths[paths.length-1]);
                    }
                    if(!strBegin) {
                        paths[paths.length-1].parentElement!.removeChild(paths[paths.length-1]);
                    }
                }
                editor.triggerChange();
                return;
            }
            let lastPlaceholdler : HTMLParagraphElement | null = null;
            nodes.forEach(n => {
                if(n.node.nodeName === "HR") return;
                const paths = usableParent(n.node, editor);
                if(paths[paths.length-1].parentElement!.nodeName === "P") return;

                if(!n.collapsed && n.partial) {
                    const str = n.node.textContent!.substring(n.startOffset!,n.endOffset);
                    const strBegin = n.node.textContent!.substring(0,n.startOffset);
                    const strEnd = n.node.textContent!.substring(n.endOffset!);
                    
                    lastPlaceholdler = document.createElement("p");
                    lastPlaceholdler.appendChild(document.createTextNode(str));
                    if (paths[paths.length-1].parentElement!.nodeName === "CODE" && paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE") {
                        if(strEnd) {
                            const endEl =  document.createElement("pre");
                            endEl.appendChild(document.createElement("code"));
                            endEl.querySelector("code")!.appendChild(clonePath(paths, strEnd));
                            editor.dom.nodesInsertAfter([lastPlaceholdler,endEl],paths[paths.length-1].parentElement!.parentElement!);
                        } else {
                            editor.dom.nodesInsertAfter([lastPlaceholdler],paths[paths.length-1].parentElement!.parentElement!);
                        }
                        if(strBegin) {
                            paths[0].textContent = strBegin;
                        } else {
                            paths[paths.length-1].parentElement!.parentElement!.removeChild(paths[paths.length-1].parentElement!);
                        }

                    }else if (["H1","H2","H3","H4","H5","H6","CODE"].indexOf(paths[paths.length-1].parentElement!.nodeName) !== -1) {
                        if(strEnd) {
                            const endEl = document.createElement(paths[paths.length-1].parentElement!.nodeName);
                            endEl.appendChild(clonePath(paths, strEnd));
                            editor.dom.nodesInsertAfter([lastPlaceholdler,endEl],paths[paths.length-1].parentElement!);
                        } else {
                            editor.dom.nodesInsertAfter([lastPlaceholdler],paths[paths.length-1].parentElement!);
                        }
                        if(strBegin) {
                            paths[0].textContent = strBegin;
                        } else {
                            paths[paths.length-1].parentElement!.parentElement!.removeChild(paths[paths.length-1].parentElement!);
                        }
                    } else {
                        if(strEnd) {
                            editor.dom.nodesInsertAfter([lastPlaceholdler,clonePath(paths, strEnd)],paths[paths.length-1]);
                        } else {
                            editor.dom.nodesInsertAfter([lastPlaceholdler],paths[paths.length-1]);
                        }
                        if(strBegin) {
                            paths[0].textContent = strBegin;
                        } else {
                            paths[paths.length-1].parentElement!.removeChild(paths[paths.length-1]);
                        }
                    }
                    return;
                }

                if (["H1","H2","H3","H4","H5","H6"].indexOf(paths[paths.length-1].parentElement!.nodeName) !== -1) {
                    replaceNode(paths[paths.length-1].parentElement as HTMLElement, "P");
                } else if(paths[paths.length-1].parentElement!.nodeName === "CODE") {
                    if(paths[paths.length-1].parentElement!.parentElement!.nodeName === "PRE") editor.dom.unwrapNode(paths[paths.length-1].parentElement!.parentElement!);
                    replaceNode(paths[paths.length-1].parentElement as HTMLElement, "P");
                }else if(lastPlaceholdler && lastPlaceholdler === paths[paths.length-1].previousSibling) {
                    lastPlaceholdler?.appendChild(paths[paths.length-1]);
                } else {
                    lastPlaceholdler = document.createElement("P") as HTMLParagraphElement;
                    editor.dom.wrapNode(paths[paths.length-1],lastPlaceholdler);
                }

            });
            editor.triggerChange();
        }
    },
    {
    event : "onCommand",
    target : ['h1','h2','h3','h4','h5','h6'],
    callback : (editor :SubEditor, cmd : string) => {

        const {range} = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        const tag = cmd.toUpperCase();
        //determine if we are wrapping or unwrap:
        const firstTextNode = nodes.find(n => n.node.nodeType === Node.TEXT_NODE);
        const action = formatAction(firstTextNode?.node as Node, tag);

        if(nodes[0].node === editor.refContent && nodes[0].collapsed) {
            const placeholder = document.createElement(cmd);
            placeholder.appendChild(document.createElement("br"));
            editor.refContent.appendChild(placeholder);
            //append a final paragraph if its end of content
            const endP = document.createElement("P");
            endP.appendChild(document.createElement("BR"));
            editor.refContent.appendChild(endP);
            editor.dom.setCaretAt(placeholder,0); 
            return;
        }
        
        nodes.forEach(n => {
            const parent = usableParent(n.node, editor);
            const node_action = formatAction(n.node, tag);

            if(action.action === "unwrap" && node_action.action !== "wrap") {
                editor.dom.unwrapNode(node_action.node as HTMLElement, editor.refContent);
                return;
            }
            if(n.isVoid) {
                return;
            }
            if(node_action.action === "wrap") {
                //break paragraph
                const cachedParent = parent[parent.length-1].parentElement!;
                const el = document.createElement(tag);
                if(cachedParent.nodeName === "P") {
                    if(n.collapsed && cachedParent.childNodes.length === 1) {
                        return replaceNode(cachedParent, tag);
                    }
                    const p = document.createElement("P");
                    let x = parent[parent.length-1];
                    const pnodes = Array.from(x.parentElement!.childNodes), idx = pnodes.indexOf(x as ChildNode);
                    for (let i = idx + 1, j = pnodes.length; i < j; i++) {
                        p.appendChild(pnodes[i]);
                    }
                    
                    if(!n.collapsed && n.partial) {
                        //extract partial text
                        el.appendChild(document.createTextNode(n.node.textContent!.substring(n.startOffset!,n.endOffset)));
                        const partBeginning = n.node.textContent!.substring(0, n.startOffset) || "", partEnding = n.node.textContent!.substring(n.endOffset!) || "";
                        if (partBeginning !== "") {
                            n.node.textContent = partBeginning;
                        } else {
                            n.node.parentNode!.removeChild(n.node);
                        }
                        if(partEnding !== "") {
                            if (p.childNodes.length > 0) {
                                p.insertBefore(document.createTextNode(partEnding), p.childNodes[0]);
                            } else {
                                p.appendChild(document.createTextNode(partEnding));
                            }
                        }
                    } else {
                        el.appendChild(parent[parent.length-1]);
                    }
                    
                    editor.dom.nodesInsertAfter([el,p],cachedParent);
                    if(cachedParent.innerHTML === "") {
                        cachedParent.remove();
                    }
                    if(p.childNodes.length === 0) {
                        p.remove();
                    }

                    if(n === nodes[nodes.length-1] && el === editor.refContent.childNodes[editor.refContent.childNodes.length-1]) {
                        //append a final paragraph if its end of content
                        const endP = document.createElement("P");
                        endP.appendChild(document.createElement("BR"));
                        editor.refContent.appendChild(endP);
                    }

                } else {
                    if(!n.collapsed && n.partial) {
                        //extract partial text
                        el.appendChild(document.createTextNode(n.node.textContent!.substring(n.startOffset!,n.endOffset)));
                        const partBeginning = n.node.textContent!.substring(0, n.startOffset) || "", partEnding = n.node.textContent!.substring(n.endOffset!) || "";
                        editor.dom.nodesInsertAfter([el],n.node);
                        if (partBeginning !== "") {
                            n.node.textContent = partBeginning;
                        } else {
                            n.node.parentNode!.removeChild(n.node);
                        }
                        if(partEnding !== "") {
                            editor.dom.nodesInsertAfter([document.createTextNode(partEnding)],el);

                        }
                    } else {
                        editor.dom.wrapNode(parent[parent.length-1], el);
                    }
                    if(n === nodes[nodes.length-1] && el === editor.refContent.childNodes[editor.refContent.childNodes.length-1]) {
                        //append a break if its end of content
                        editor.refContent.appendChild(document.createElement("BR"));
                    }
                    
                }
                
            } else if (node_action.action === "replace") {
                replaceNode(node_action.node as HTMLElement, tag);
            }
        });
        if(nodes[nodes.length - 1].isVoid) {
            //next of this element
            editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
        } else {
            editor.dom.setCaretAt(range.endContainer, range.endOffset);
        }
        
        editor.triggerChange();
    }
}] as SubEditorEvent[];
