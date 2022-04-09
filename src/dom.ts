import table from "./table";

function domFragment(html : string, returnHTML = false) : any {
    //console.log("domFragment html", html);
    let parser = new DOMParser();
    let doc = parser.parseFromString('<html><head><meta charset="utf-8"></head><body>'+ html+'</body></html>', "text/html");

    const node = doc.querySelector("body");
    if (!node ) return null;
    //console.log("domFragment", node, node.innerHTML);
    if(returnHTML) return node.innerHTML;
    return node.childNodes;
}
function appendString2Node(html : string, target : HTMLElement | Node) {
    Array.from(domFragment(html)).forEach(n => target.appendChild(n as Node));
}
function rangeCompareNode(range : any, node : any) {
    //console.log(range, node);
    //potential error: Failed to execute 'compareBoundaryPoints' on 'Range': The source range is in a different document than this range
    if (!node || !node.ownerDocument || !range) {
        //console.log("rangeCompareNode", range, node);
        return 4;//something wrong
    }
    var nodeRange = node.ownerDocument.createRange();
    try {
      nodeRange.selectNode(node);
    }
    catch (e) {
      nodeRange.selectNodeContents(node);
    }
    const range_START_TO_START = range.compareBoundaryPoints(Range.START_TO_START, nodeRange);
    const range_END_TO_END = range.compareBoundaryPoints(Range.END_TO_END, nodeRange);
    const range_START_TO_END = range.compareBoundaryPoints(Range.START_TO_END, nodeRange);
    const range_END_TO_START = range.compareBoundaryPoints(Range.END_TO_START, nodeRange);

    const nodeStartsAfterRangeEnd = range_START_TO_END === -1;//-1 range end is before node start
    const nodeEndsBeforeRangeStart = range_END_TO_START === 1;//1 : range start is after node end

    const nodeStartsAfterRangeStart = range_START_TO_START !== 1;// range start is before or equal node start
    const nodeEndsBeforeRangeEnd = range_END_TO_END !== -1;//range end is after or equal node end

    if (nodeStartsAfterRangeEnd || nodeEndsBeforeRangeStart) return -1;//no intersact
    if (nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd) return 3;//range contains node

    if (!nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd) return 2;//node contains range

    if (!nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd) return 0;//partial overlap, node starts before range
    if (nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd) return 1;//partial overlap, range starts before node 

    return 4;//shouldn't happen
}
function rangeContainsNode(range : any, node : any, includePartial = true) {
    //console.log("comparing", node, this.rangeCompareNode(range, node));
    if (includePartial ) return [0,1,3].indexOf(rangeCompareNode(range, node)) !== -1
    return rangeCompareNode(range, node) === 3
}
export interface RangeNode {
    node : Node,
    startOffset? : number, 
    endOffset? : number,
    isVoid : boolean,
    partial? : boolean,
    collapsed? : boolean
}
function selectNodesBetweenRange(range : Range) : Node[] {
    
    const nodes : Node[] = [], start = range.startContainer,end = range.endContainer;
    let started = false;
    for(let i = 0, j = range.commonAncestorContainer.childNodes.length; i < j; i++) {
        if(range.commonAncestorContainer.childNodes.item(i).contains(end)) break;
        if(started) {
            nodes.push(range.commonAncestorContainer.childNodes.item(i) as Node);
        }
        if(range.commonAncestorContainer.childNodes.item(i).contains(start)) started = true;
    }
    return nodes;
}
function selectDeepNodesInRange(range : Range) : RangeNode[] {
    /**
     * startOffset = inclusive
     * if endContainer === Node.TEXT_NODE, range = 0-endOffset but not include endOffset
     * if endContainer is Element, range ends before endContainer[endOffset]
     */
    const commonAncestor = range.commonAncestorContainer;
    let start = range.startContainer,startOffset = range.startOffset, end = range.endContainer, endOffset = range.endOffset;

    if(range.startContainer.childNodes.length && range.startContainer.childNodes[range.startOffset]) {
        start = range.startContainer.childNodes[range.startOffset];
        startOffset = 0;
    }
    if(end.nodeType !== Node.TEXT_NODE) {
        end = range.endContainer.childNodes[range.endOffset];
        endOffset = 0;//end is ignored
    }

    let begin = false, finish = false, nodes : RangeNode[] = [];
    if(range.collapsed) {
        nodes.push({
            node : start,
            startOffset : startOffset,
            endOffset : endOffset,
            isVoid : nodeIsVoid(start),
            partial : false,
            collapsed : true,
        });
        return nodes;
    }
    const recursive = function(node : Node) {
        if (finish) return;
        if (!commonAncestor.contains(node)) return;
        if (node === start){
            begin = true;
        } else if (node === end){
            finish = true;
        }

        if (begin && !node.childNodes.length) {
            //normalized node:
            //start node
            if(node === start) {
                let partial = startOffset !== 0;
                if (startOffset === 0 && end === start && end.nodeType === Node.TEXT_NODE) {
                    partial = endOffset !== end.textContent?.length;
                }
                nodes.push({
                    node : node,
                    startOffset : startOffset,
                    endOffset : end === start ? endOffset : start.textContent?.length,
                    isVoid : nodeIsVoid(node),
                    partial : partial,
                    collapsed : range.collapsed,
                });
            } 
            //end node is string, and if partial end string is selected
            else if(node === end && node !== start && end.nodeType === Node.TEXT_NODE && endOffset !== 0) {
                nodes.push({
                    node : node,
                    startOffset : 0,
                    endOffset : endOffset,
                    isVoid : nodeIsVoid(node),
                    partial : endOffset < end.textContent!.length
                });

            } else if(node !== end){
                //middle nodes
                nodes.push({
                    node : node,
                    isVoid : nodeIsVoid(node),
                    partial : false
                });
            }
            
            
        }
        else if (node.childNodes.length) {
            Array.from(node.childNodes).forEach(n => recursive(n));
        }
    }
    recursive(commonAncestor);
    return nodes;
}
function nodeReplaceWith(node : any, replaceNodes : any[]) {
    if (replaceNodes.length === 0) return;
    const parent = node.parentNode;
    if(!parent) return;
    //console.log("nodeReplaceWith parent", parent,node, replaceNodes);
    replaceNodes.forEach ( (replaceNode : any) => {
        parent.insertBefore(replaceNode, node);
    });
    parent.removeChild(node);
}

function nodeTextMerge(nodes : Node[]) {
    //merge list of text nodes:
    if(nodes.length === 0) return;
    for (let i = nodes.length - 1; i >= 0; i--) {
        let current = nodes[i];
        if (!current || current.nodeType !== Node.TEXT_NODE) continue;
        let previous = current.previousSibling;
        if (current && previous && previous.nodeType === Node.TEXT_NODE ) {
            previous.textContent += current.textContent || "";
            current.parentNode!.removeChild(current);
        }
    }
}

function nodeTextMergeAll(parent : HTMLElement) {
    if (!parent) return;
    
    let textNodes : any[] = [];
    let recursor = (container : HTMLElement) => {
        for (var i = 0; i < container.childNodes.length; i++) {
            var child = container.childNodes[i];
            if(child.nodeType !== Node.TEXT_NODE && child.childNodes){
                recursor(child as HTMLElement);
            }else{
                textNodes.push(child);
            }
        }
    }
    Array.from(parent.childNodes).forEach( ( node : Node) => {
        if(node.nodeType ===  Node.TEXT_NODE) textNodes.push(node);
        else if(node.childNodes) recursor(node as HTMLElement);
    });
    nodeTextMerge(textNodes);
}
function wrapNode(node : Node, placeholder : HTMLElement) {
    if (!node) return;
    node.parentElement?.insertBefore(placeholder, node);
    placeholder.appendChild(node);
}
function unwrapNode(node : Node, container : HTMLElement | undefined = undefined) {
    if (!node) return;
    const parent = node.parentNode;
    if(!parent || node === container) return;
    // move all children out of the element
    //console.log("unwrapNode", node);
    while (node.firstChild) parent.insertBefore(node.firstChild, node);

    // remove the empty element
    parent.removeChild(node);
}
function unwrapNodes(nodes : any[], tag : string | string[], container : any, range : any) {
    let unwrapnodes : any[] = [];
    if(nodes.length === 0) return;
    const tagMatch = (el : any, _tag : string | string[]) => typeof _tag === "string" ? el.tagName.toLowerCase() === _tag : _tag.indexOf(el.tagName.toLowerCase()) !== -1;
    const rangeMatch = (_range : any, el : any) => !_range || rangeContainsNode(_range, el, false);
    const tagQuerySelector = typeof tag === "string" ? tag : tag.join(",");
    //console.log("tagQuerySelector",tagQuerySelector, nodes);
    //unwrap:
    nodes.forEach((node : any ) => {
        //console.log(node);
        if (node.nodeType === 3) return;
        //console.log(node);
        Array.prototype.forEach.call(node.children, (el : any) => {
 
            el.querySelectorAll(tagQuerySelector).forEach((el2 : any) => {
                if (tagMatch(el2, tag) && rangeMatch(range, el2))  {unwrapnodes.push(el2);}
            });
            if (tagMatch(el, tag) && rangeMatch(range, el)) {unwrapnodes.push(el);}
        });
        if (tagMatch(node, tag) && rangeMatch(range, node)) {unwrapnodes.push(node);}
    });
    unwrapnodes.forEach(node => unwrapNode(node, container));
}
function AttributeCompare(a : Object | any, b :  Object | any) {
    if (a === b) return true;
    const a_keys = Object.keys(a), b_keys = Object.keys(b);
    a_keys.sort();
    b_keys.sort();
    if (a_keys.join("_") !== b_keys.join("_")) return false;

    const a_value = Object.values(a), b_value = Object.values(b);
    a_value.sort();
    b_value.sort();
    if (a_value.join("_") !== b_value.join("_")) return false;

    return true;
}
function mergeTags(container : HTMLElement, tag : string) {

    if (!container || container.nodeType === 3) return;
    let nodes = container.querySelectorAll(tag);
    let length = nodes.length;
    if (!nodes || length === 0) return;
    for(let i = length - 1; i  >= 0; i--) {
      let cur = nodes[i], prev = cur.previousElementSibling;
      if (!cur.hasChildNodes() && cur.textContent === "") {
        cur.parentNode?.removeChild(cur);
        continue;
      }
      //is text or span
      if (prev && prev.nodeName.toLowerCase() === tag) {
          if (prev.nodeType === 3) {
            prev.textContent += cur.textContent || "";
            cur.parentNode?.removeChild(cur);
          } else if (AttributeCompare(nodeAttrStyle(prev as HTMLElement), nodeAttrStyle(cur as HTMLElement))) {
              //is element, and same tag and same style
              nodeChildInsertInto(prev, cur);
              cur.parentNode?.removeChild(cur);
          } 
      }
    }

    nodes = container.querySelectorAll(tag + " > " + tag);
    length = nodes.length;
    if (!nodes || length === 0) return;
    for(let i = length - 1; i  >= 0; i--) {
        if (nodes[i].parentElement && nodes[i].parentElement?.nodeName.toLowerCase() === tag && 
        AttributeCompare(nodeAttrStyle(nodes[i].parentElement!), nodeAttrStyle(nodes[i] as HTMLElement))) {
            //unwrap:
            for(let x = 0, n = nodes[i].childNodes.length; x < n; x++) {
                nodes[i].parentElement?.insertBefore(nodes[i].childNodes[x], nodes[i]);
            }
            nodes[i].parentNode?.removeChild(nodes[i]);
        }
    }

}

function nodeAttrStyle(el : HTMLElement, tag? : string) {
    let styles : any = {};
    if (!el || !el.style) return styles;
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim()) return;
        const idx = pair.indexOf(":");
        if (idx === -1) return;
        let p = [pair.substring(0, idx).trim(),(pair.substring(idx+1) || "").trim()];
        styles[p[0]] = p[1];
        if (p[0] === "background" && p[1].indexOf('url(') === 0) {
            styles[p[0]] = el.style.background;
        }
    });
    if (tag) return styles[tag] || "";
    return styles;
}
function nodeReplaceAttrStyle(el : HTMLElement, tag : string, value : string) {
    let styles = "";
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim()) return;
        let p = pair.split(":"), prop = p[0].trim();
        if (prop !== tag) {//skip the one being replaced
            styles += prop + ":" + p[1].trim() + ";";
        }
        
    });
    if (value) {//add to last
        styles += tag + ":"+ value + ";";
    }
    if(styles) el.setAttribute("style", styles);
    else el.removeAttribute("style");
}
function nodeChildRemoveAttrStyle(el : HTMLElement, tag : string, value : string) {
    let unwraps : any[] = [];
    Array.from(el.querySelectorAll("*")).forEach( (node : any) => {
        if (node.nodeType === 3) return;
        let styles = "";
        const s = (node.getAttribute("style") || "").split(';');
        s.forEach((pair : string) => {
            if (!pair.trim()) return;
            let p = pair.split(":"), prop = p[0].trim(), val = p[1].trim();
            if (prop !== tag && value !== val) styles += prop + ":" + val + ";";
        });
        if (styles === "" && node.nodeName.toLowerCase() === "span") {
            //unwrap:
            unwraps.push(node);
            return;
        }
        node.setAttribute("style", styles);
    });

    if (unwraps.length === 0) return;

    unwraps.forEach(node => {
        unwrapNode(node);
    });
    
}
function nodeBreak(container : Node, midNode : Node) {
    if(container === midNode || !container.contains(midNode)) return;
    let grandparent : ParentNode | null = null;
    for (let parent = midNode.parentNode!; container != parent; parent = grandparent) {
        let right = document.createElement(parent.nodeName);
        while (midNode.nextSibling)
            right.appendChild(midNode.nextSibling);
        grandparent = parent.parentNode!;
        grandparent.insertBefore(right, parent.nextSibling);
        grandparent.insertBefore(midNode, right);
    }
}
function nodesAreTextInlineOrVoid(nodes : (Node | ChildNode)[]) {
    let test = true;
    nodes.forEach( (n) => {
        if (!nodeIsTextOrVoid(n) && !nodeIsInlineFormat(n)) {
            test = false;
        }
    });
    return test;
}
function nodesAreTextOrVoid(nodes : (Node | ChildNode)[]) {
    let test = true;
    nodes.forEach( (n) => {
        if (!nodeIsTextOrVoid(n)) {
            test = false;
        }
    });
    return test;
}
function nodeIsTextInlineOrVoid(n : Node | ChildNode) {
    return nodeIsTextOrVoid(n) || nodeIsInlineFormat(n);
}
function nodeIsTextOrVoid(n : Node | ChildNode) {
    return (n && n.nodeType === Node.TEXT_NODE) || nodeIsVoid(n);
}
function nodeIsText(n : Node | ChildNode) {
    return (n && n.nodeType === Node.TEXT_NODE);
}
function nodeIsVoid(n : Node | ChildNode) {
    return n && ["EMBED","COL","BASE","AREA","IMG", "BR", "HR", "LINK", "META", "PARAM", "SOURCE",
    "TRACK", "WBR"].indexOf(n.nodeName) !== -1
}
function nodeIsInlineFormat(n : Node | ChildNode) {
    return n && ["STRONG","U","EM","I","STRIKE","SUB", "SUP","SPAN"].indexOf(n.nodeName) !== -1
}
function nodeChildFirst(n : Node) {
    let last = n;
    while(last && last.childNodes) {
        if (!last.childNodes || last.childNodes.length === 0) break;
        last = last.childNodes[0];
    }
    return last;
}
function nodeChildLast(n : Node) {
    let last = n;
    while(last && last.childNodes) {
        if (!last.childNodes || last.childNodes.length === 0 || (last.childNodes.length === 1 && nodeIsVoid(last.childNodes[0]))) break;
        last = last.childNodes[last.childNodes.length - 1];
    }
    return last;
}
function nodeChildInsertInto(target : Node, node : Node) {
    if (!target || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target)) return;
    Array.from(node.childNodes).forEach(el => target.appendChild(el));
}
function nodeChildInsertBefore(target : Node, beforeNode : Node, node : Node) {
    //insert node.childNodes into target
    if (!target || !beforeNode || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target)) return;
    let idx = nodePosition(beforeNode);
    if (idx === -1) return;

    for (let i = node.childNodes.length - 1; i >= 0; i--) {
        if(node.childNodes[i]) target.insertBefore(node.childNodes[i],target.childNodes[idx]);
    }
}
function nodesInsertAfter(nodes : Node[], dest : Node) {
    if(!nodes || !dest) return;
    let idx = nodePosition(dest);
    if (idx === -1) return;
    if (idx === dest.parentNode!.childNodes.length - 1) {
        for (let i = 0, n = nodes.length; i < n; i++) {
            dest.parentNode!.appendChild(nodes[i]);
        }
    }
    else {
        const beforeNode = dest.parentNode!.childNodes[idx+1];
        nodes.forEach(n => dest.parentNode!.insertBefore(n, beforeNode));
    }
}
function nodePosition(n : any) {
    if (!n.parentNode || !n.parentNode.childNodes) return -1;
    for (let i = 0, nx = n.parentNode.childNodes.length; i < nx; i++) {
        if (n.parentNode.childNodes[i] === n) {
            return i;
        }
    }
    return -1;
}
function nodePrev(n : any, container : any) {
    let prev = n;
    if(prev !== container) {
        if (prev.previousSibling) {
            prev = prev.previousSibling;
        } else if (prev.parentNode && prev.parentNode === container ) {
            prev = container;
        } else if(prev.parentNode){
            prev = prev.parentNode;
            while(prev !== container && !prev.previousSibling) {
                prev = prev.parentNode;
            }
        }
    }
    return prev;
}
function nodeParentUntil( node : Node, until : HTMLElement) {
    const path : Node[] = [];
    while(node && node !== until){
        path.push(node);
        node = node.parentNode as Node;
    }
    return path;

}
function nodeParent(n : Node, tag? : string | any, container? : HTMLElement) {
    if(!n) return null;
    if (!tag) {
        if (n.parentNode) return n.parentNode;
        else return null;
    } else if (tag && nodeNameCompare(n, tag)) return n;
    let x = n;
    while ( !nodeNameCompare(x, tag) && (!container || x !== container) ) {
        if(!x.parentNode) return null;
        x = x.parentNode;
    }
    
    if (nodeNameCompare(x,tag)) return x;
    return null;
}
function nodeNext(n : any, container : any) {
    let next = n;
    if(next !== container) {
        if (next.nextSibling) {
            next = next.nextSibling;
        } else if (next.parentNode && next.parentNode === container ) {
            next = container;
        } else if(next.parentNode) {
            next = next.parentNode;
            while(next !== container && !next.nextSibling) {
                if(!next.parentNode) break;
                next = next.parentNode;
            }
        }
    }
    return next;
}
function getRangeFocus(container : HTMLElement) {
    let selection = getSelection();
    if (!selection || selection.rangeCount === 0) {
        container.focus();
        selection = getSelection();
    }
    if(!selection) {
        resetSelection(container);
        selection = getSelection();
    }
    if (selection && selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return false;
}
function getRange() {
    const selection = getSelection();
    if (selection && selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return false;
}
function getSelection() {
    return window.getSelection();
}
function setCaretAt(node : Node, startOffset = 0) {
    const selection = getSelection();
    selection!.removeAllRanges();
    const range = document.createRange();
    if(node.nodeType === Node.TEXT_NODE && (node.textContent || "").length < startOffset + 1) {
        //set end instead:
        range.setEnd(node, node.textContent!.length);
        range.collapse(false);

    } else if(node.nodeType !== Node.TEXT_NODE && node.childNodes.length < startOffset + 1) {
        //set end instead:
        range.setEnd(node.parentNode!, Math.min(nodePosition(node)+1, node.parentNode!.childNodes.length));
        range.collapse(false);

    }else {
        range.setStart(node, startOffset);
        range.collapse(true);
    }
    
    selection!.addRange(range);
}
function resetSelection(node : any, startOffset = -1, endOffset = -1) {
    //console.log("begin resetSelection", node, node.textContent, startOffset, endOffset, node.textContent.length);
    let selection = getSelection();
    if (!selection) return;
    let range : any = getRange();
    selection.removeAllRanges();
    if (!node && !range.endContainer) return;

    if (!node.parentNode) {
        //possible a node that has been moved
        node = range.endContainer;
    }

    //default put it to end
    if (startOffset === -1 && node.nodeType === 3) startOffset = node.textContent.length - 1;
    if (startOffset === -1 && node.nodeType !== 3 ) startOffset = node.childNodes.length - 1;

    if (node.nodeType === 3) {
        //text node:
        selection.collapse(node, Math.min(Math.max(startOffset, endOffset, 0), node.textContent.length));
    } else if(nodeNameCompare(node, "br")){
        selection.collapse(node);
    } else {
        selection.collapse(node, Math.min(Math.max(startOffset, endOffset, 0), node.childNodes.length));
    }
    
    if (startOffset === -1) {
        selection.selectAllChildren(node);
        selection.collapseToEnd();
    }
    if (!selection.rangeCount) {
        range = document.createRange();
        range.setStart(node, Math.min(Math.max(startOffset, 0), node.textContent.length));
        range.setEnd(node, Math.min(Math.max(startOffset, endOffset, 0), node.textContent.length));
        // @ts-ignore
        window.getSelection().addRange(range);
        selection = window.getSelection();
        //console.log("resetSelection createRange", node,startOffset,endOffset,  range, selection);
        return;
    } 
    
    range = selection.getRangeAt(0);

    if (startOffset === -1) {
        //end:
        selection.collapseToEnd()
    } else {
        if (startOffset === 0) range.setStart(node, startOffset);
        else {
            range.setStart(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, startOffset));
        }
        if (endOffset < startOffset) endOffset = startOffset;
        range.setEnd(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, endOffset));
    }
    return selection;
}
function nodeNameCompareIndex(n : any, name : string | string[]) : number {
    let index = -1;
    if (!n || ! n.nodeName) return index;
    if(typeof name === "string") return n && n.nodeName && n.nodeName.toString() === name.toUpperCase() ? 0 : -1;
    return name.indexOf(n.nodeName.toString());
}
function nodeNameCompare(n : any, name : string | string[]) : boolean {
    if(typeof name === "string") return n && n.nodeName && n.nodeName.toString()=== name.toUpperCase();
    return n && name.indexOf(n.nodeName.toString()) !== -1;
}

const exp = {
    domFragment : domFragment,
    appendString2Node : appendString2Node,
    rangeCompareNode : rangeCompareNode,
    rangeContainsNode : rangeContainsNode,
    selectDeepNodesInRange : selectDeepNodesInRange,
    nodeReplaceWith : nodeReplaceWith,
    nodeTextMerge : nodeTextMerge,
    nodeTextMergeAll : nodeTextMergeAll,
    wrapNode : wrapNode,
    unwrapNode : unwrapNode,
    unwrapNodes : unwrapNodes,
    mergeTags : mergeTags,
    nodeAttrStyle : nodeAttrStyle,
    nodeReplaceAttrStyle : nodeReplaceAttrStyle,
    nodeChildRemoveAttrStyle : nodeChildRemoveAttrStyle,
    nodeIsVoid : nodeIsVoid,
    nodeIsText : nodeIsText,
    nodeIsTextOrVoid : nodeIsTextOrVoid,
    selectNodesBetweenRange : selectNodesBetweenRange,
    nodeIsTextInlineOrVoid : nodeIsTextInlineOrVoid,
    nodesAreTextOrVoid : nodesAreTextOrVoid,
    getSelection : getSelection,
    getRange : getRange,
    getRangeFocus : getRangeFocus,
    resetSelection : resetSelection,
    nodeIsInlineFormat : nodeIsInlineFormat,
    nodesAreTextInlineOrVoid : nodesAreTextInlineOrVoid,
    nodeNext : nodeNext,
    nodeChildFirst : nodeChildFirst,
    nodeChildLast : nodeChildLast,
    nodePrev : nodePrev,
    nodeNameCompare : nodeNameCompare,
    nodeNameCompareIndex : nodeNameCompareIndex,
    nodeParentUntil : nodeParentUntil,
    nodeParent : nodeParent,
    nodeChildInsertBefore : nodeChildInsertBefore,
    nodeChildInsertInto : nodeChildInsertInto,
    nodePosition : nodePosition,
    nodesInsertAfter : nodesInsertAfter,
    setCaretAt : setCaretAt,
    nodeBreak : nodeBreak,
    table : table

};
export default exp;