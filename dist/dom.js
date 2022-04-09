"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = __importDefault(require("./table"));
function domFragment(html, returnHTML = false) {
    //console.log("domFragment html", html);
    let parser = new DOMParser();
    let doc = parser.parseFromString('<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', "text/html");
    const node = doc.querySelector("body");
    if (!node)
        return null;
    //console.log("domFragment", node, node.innerHTML);
    if (returnHTML)
        return node.innerHTML;
    return node.childNodes;
}
function appendString2Node(html, target) {
    Array.from(domFragment(html)).forEach(n => target.appendChild(n));
}
function rangeCompareNode(range, node) {
    //console.log(range, node);
    //potential error: Failed to execute 'compareBoundaryPoints' on 'Range': The source range is in a different document than this range
    if (!node || !node.ownerDocument || !range) {
        //console.log("rangeCompareNode", range, node);
        return 4; //something wrong
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
    const nodeStartsAfterRangeEnd = range_START_TO_END === -1; //-1 range end is before node start
    const nodeEndsBeforeRangeStart = range_END_TO_START === 1; //1 : range start is after node end
    const nodeStartsAfterRangeStart = range_START_TO_START !== 1; // range start is before or equal node start
    const nodeEndsBeforeRangeEnd = range_END_TO_END !== -1; //range end is after or equal node end
    if (nodeStartsAfterRangeEnd || nodeEndsBeforeRangeStart)
        return -1; //no intersact
    if (nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd)
        return 3; //range contains node
    if (!nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd)
        return 2; //node contains range
    if (!nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd)
        return 0; //partial overlap, node starts before range
    if (nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd)
        return 1; //partial overlap, range starts before node 
    return 4; //shouldn't happen
}
function rangeContainsNode(range, node, includePartial = true) {
    //console.log("comparing", node, this.rangeCompareNode(range, node));
    if (includePartial)
        return [0, 1, 3].indexOf(rangeCompareNode(range, node)) !== -1;
    return rangeCompareNode(range, node) === 3;
}
function selectNodesBetweenRange(range) {
    const nodes = [], start = range.startContainer, end = range.endContainer;
    let started = false;
    for (let i = 0, j = range.commonAncestorContainer.childNodes.length; i < j; i++) {
        if (range.commonAncestorContainer.childNodes.item(i).contains(end))
            break;
        if (started) {
            nodes.push(range.commonAncestorContainer.childNodes.item(i));
        }
        if (range.commonAncestorContainer.childNodes.item(i).contains(start))
            started = true;
    }
    return nodes;
}
function selectDeepNodesInRange(range) {
    /**
     * startOffset = inclusive
     * if endContainer === Node.TEXT_NODE, range = 0-endOffset but not include endOffset
     * if endContainer is Element, range ends before endContainer[endOffset]
     */
    const commonAncestor = range.commonAncestorContainer;
    let start = range.startContainer, startOffset = range.startOffset, end = range.endContainer, endOffset = range.endOffset;
    if (range.startContainer.childNodes.length && range.startContainer.childNodes[range.startOffset]) {
        start = range.startContainer.childNodes[range.startOffset];
        startOffset = 0;
    }
    if (end.nodeType !== Node.TEXT_NODE) {
        end = range.endContainer.childNodes[range.endOffset];
        endOffset = 0; //end is ignored
    }
    let begin = false, finish = false, nodes = [];
    if (range.collapsed) {
        nodes.push({
            node: start,
            startOffset: startOffset,
            endOffset: endOffset,
            isVoid: nodeIsVoid(start),
            partial: false,
            collapsed: true,
        });
        return nodes;
    }
    const recursive = function (node) {
        var _a, _b;
        if (finish)
            return;
        if (!commonAncestor.contains(node))
            return;
        if (node === start) {
            begin = true;
        }
        else if (node === end) {
            finish = true;
        }
        if (begin && !node.childNodes.length) {
            //normalized node:
            //start node
            if (node === start) {
                let partial = startOffset !== 0;
                if (startOffset === 0 && end === start && end.nodeType === Node.TEXT_NODE) {
                    partial = endOffset !== ((_a = end.textContent) === null || _a === void 0 ? void 0 : _a.length);
                }
                nodes.push({
                    node: node,
                    startOffset: startOffset,
                    endOffset: end === start ? endOffset : (_b = start.textContent) === null || _b === void 0 ? void 0 : _b.length,
                    isVoid: nodeIsVoid(node),
                    partial: partial,
                    collapsed: range.collapsed,
                });
            }
            //end node is string, and if partial end string is selected
            else if (node === end && node !== start && end.nodeType === Node.TEXT_NODE && endOffset !== 0) {
                nodes.push({
                    node: node,
                    startOffset: 0,
                    endOffset: endOffset,
                    isVoid: nodeIsVoid(node),
                    partial: endOffset < end.textContent.length
                });
            }
            else if (node !== end) {
                //middle nodes
                nodes.push({
                    node: node,
                    isVoid: nodeIsVoid(node),
                    partial: false
                });
            }
        }
        else if (node.childNodes.length) {
            Array.from(node.childNodes).forEach(n => recursive(n));
        }
    };
    recursive(commonAncestor);
    return nodes;
}
function nodeReplaceWith(node, replaceNodes) {
    if (replaceNodes.length === 0)
        return;
    const parent = node.parentNode;
    if (!parent)
        return;
    //console.log("nodeReplaceWith parent", parent,node, replaceNodes);
    replaceNodes.forEach((replaceNode) => {
        parent.insertBefore(replaceNode, node);
    });
    parent.removeChild(node);
}
function nodeTextMerge(nodes) {
    //merge list of text nodes:
    if (nodes.length === 0)
        return;
    for (let i = nodes.length - 1; i >= 0; i--) {
        let current = nodes[i];
        if (!current || current.nodeType !== Node.TEXT_NODE)
            continue;
        let previous = current.previousSibling;
        if (current && previous && previous.nodeType === Node.TEXT_NODE) {
            previous.textContent += current.textContent || "";
            current.parentNode.removeChild(current);
        }
    }
}
function nodeTextMergeAll(parent) {
    if (!parent)
        return;
    let textNodes = [];
    let recursor = (container) => {
        for (var i = 0; i < container.childNodes.length; i++) {
            var child = container.childNodes[i];
            if (child.nodeType !== Node.TEXT_NODE && child.childNodes) {
                recursor(child);
            }
            else {
                textNodes.push(child);
            }
        }
    };
    Array.from(parent.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE)
            textNodes.push(node);
        else if (node.childNodes)
            recursor(node);
    });
    nodeTextMerge(textNodes);
}
function wrapNode(node, placeholder) {
    var _a;
    if (!node)
        return;
    (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(placeholder, node);
    placeholder.appendChild(node);
}
function unwrapNode(node, container = undefined) {
    if (!node)
        return;
    const parent = node.parentNode;
    if (!parent || node === container)
        return;
    // move all children out of the element
    //console.log("unwrapNode", node);
    while (node.firstChild)
        parent.insertBefore(node.firstChild, node);
    // remove the empty element
    parent.removeChild(node);
}
function unwrapNodes(nodes, tag, container, range) {
    let unwrapnodes = [];
    if (nodes.length === 0)
        return;
    const tagMatch = (el, _tag) => typeof _tag === "string" ? el.tagName.toLowerCase() === _tag : _tag.indexOf(el.tagName.toLowerCase()) !== -1;
    const rangeMatch = (_range, el) => !_range || rangeContainsNode(_range, el, false);
    const tagQuerySelector = typeof tag === "string" ? tag : tag.join(",");
    //console.log("tagQuerySelector",tagQuerySelector, nodes);
    //unwrap:
    nodes.forEach((node) => {
        //console.log(node);
        if (node.nodeType === 3)
            return;
        //console.log(node);
        Array.prototype.forEach.call(node.children, (el) => {
            el.querySelectorAll(tagQuerySelector).forEach((el2) => {
                if (tagMatch(el2, tag) && rangeMatch(range, el2)) {
                    unwrapnodes.push(el2);
                }
            });
            if (tagMatch(el, tag) && rangeMatch(range, el)) {
                unwrapnodes.push(el);
            }
        });
        if (tagMatch(node, tag) && rangeMatch(range, node)) {
            unwrapnodes.push(node);
        }
    });
    unwrapnodes.forEach(node => unwrapNode(node, container));
}
function AttributeCompare(a, b) {
    if (a === b)
        return true;
    const a_keys = Object.keys(a), b_keys = Object.keys(b);
    a_keys.sort();
    b_keys.sort();
    if (a_keys.join("_") !== b_keys.join("_"))
        return false;
    const a_value = Object.values(a), b_value = Object.values(b);
    a_value.sort();
    b_value.sort();
    if (a_value.join("_") !== b_value.join("_"))
        return false;
    return true;
}
function mergeTags(container, tag) {
    var _a, _b, _c, _d, _e, _f;
    if (!container || container.nodeType === 3)
        return;
    let nodes = container.querySelectorAll(tag);
    let length = nodes.length;
    if (!nodes || length === 0)
        return;
    for (let i = length - 1; i >= 0; i--) {
        let cur = nodes[i], prev = cur.previousElementSibling;
        if (!cur.hasChildNodes() && cur.textContent === "") {
            (_a = cur.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(cur);
            continue;
        }
        //is text or span
        if (prev && prev.nodeName.toLowerCase() === tag) {
            if (prev.nodeType === 3) {
                prev.textContent += cur.textContent || "";
                (_b = cur.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(cur);
            }
            else if (AttributeCompare(nodeAttrStyle(prev), nodeAttrStyle(cur))) {
                //is element, and same tag and same style
                nodeChildInsertInto(prev, cur);
                (_c = cur.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(cur);
            }
        }
    }
    nodes = container.querySelectorAll(tag + " > " + tag);
    length = nodes.length;
    if (!nodes || length === 0)
        return;
    for (let i = length - 1; i >= 0; i--) {
        if (nodes[i].parentElement && ((_d = nodes[i].parentElement) === null || _d === void 0 ? void 0 : _d.nodeName.toLowerCase()) === tag &&
            AttributeCompare(nodeAttrStyle(nodes[i].parentElement), nodeAttrStyle(nodes[i]))) {
            //unwrap:
            for (let x = 0, n = nodes[i].childNodes.length; x < n; x++) {
                (_e = nodes[i].parentElement) === null || _e === void 0 ? void 0 : _e.insertBefore(nodes[i].childNodes[x], nodes[i]);
            }
            (_f = nodes[i].parentNode) === null || _f === void 0 ? void 0 : _f.removeChild(nodes[i]);
        }
    }
}
function nodeAttrStyle(el, tag) {
    let styles = {};
    if (!el || !el.style)
        return styles;
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim())
            return;
        const idx = pair.indexOf(":");
        if (idx === -1)
            return;
        let p = [pair.substring(0, idx).trim(), (pair.substring(idx + 1) || "").trim()];
        styles[p[0]] = p[1];
        if (p[0] === "background" && p[1].indexOf('url(') === 0) {
            styles[p[0]] = el.style.background;
        }
    });
    if (tag)
        return styles[tag] || "";
    return styles;
}
function nodeReplaceAttrStyle(el, tag, value) {
    let styles = "";
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim())
            return;
        let p = pair.split(":"), prop = p[0].trim();
        if (prop !== tag) { //skip the one being replaced
            styles += prop + ":" + p[1].trim() + ";";
        }
    });
    if (value) { //add to last
        styles += tag + ":" + value + ";";
    }
    if (styles)
        el.setAttribute("style", styles);
    else
        el.removeAttribute("style");
}
function nodeChildRemoveAttrStyle(el, tag, value) {
    let unwraps = [];
    Array.from(el.querySelectorAll("*")).forEach((node) => {
        if (node.nodeType === 3)
            return;
        let styles = "";
        const s = (node.getAttribute("style") || "").split(';');
        s.forEach((pair) => {
            if (!pair.trim())
                return;
            let p = pair.split(":"), prop = p[0].trim(), val = p[1].trim();
            if (prop !== tag && value !== val)
                styles += prop + ":" + val + ";";
        });
        if (styles === "" && node.nodeName.toLowerCase() === "span") {
            //unwrap:
            unwraps.push(node);
            return;
        }
        node.setAttribute("style", styles);
    });
    if (unwraps.length === 0)
        return;
    unwraps.forEach(node => {
        unwrapNode(node);
    });
}
function nodeBreak(container, midNode) {
    if (container === midNode || !container.contains(midNode))
        return;
    let grandparent = null;
    for (let parent = midNode.parentNode; container != parent; parent = grandparent) {
        let right = document.createElement(parent.nodeName);
        while (midNode.nextSibling)
            right.appendChild(midNode.nextSibling);
        grandparent = parent.parentNode;
        grandparent.insertBefore(right, parent.nextSibling);
        grandparent.insertBefore(midNode, right);
    }
}
function nodesAreTextInlineOrVoid(nodes) {
    let test = true;
    nodes.forEach((n) => {
        if (!nodeIsTextOrVoid(n) && !nodeIsInlineFormat(n)) {
            test = false;
        }
    });
    return test;
}
function nodesAreTextOrVoid(nodes) {
    let test = true;
    nodes.forEach((n) => {
        if (!nodeIsTextOrVoid(n)) {
            test = false;
        }
    });
    return test;
}
function nodeIsTextInlineOrVoid(n) {
    return nodeIsTextOrVoid(n) || nodeIsInlineFormat(n);
}
function nodeIsTextOrVoid(n) {
    return (n && n.nodeType === Node.TEXT_NODE) || nodeIsVoid(n);
}
function nodeIsText(n) {
    return (n && n.nodeType === Node.TEXT_NODE);
}
function nodeIsVoid(n) {
    return n && ["EMBED", "COL", "BASE", "AREA", "IMG", "BR", "HR", "LINK", "META", "PARAM", "SOURCE",
        "TRACK", "WBR"].indexOf(n.nodeName) !== -1;
}
function nodeIsInlineFormat(n) {
    return n && ["STRONG", "U", "EM", "I", "STRIKE", "SUB", "SUP", "SPAN"].indexOf(n.nodeName) !== -1;
}
function nodeChildFirst(n) {
    let last = n;
    while (last && last.childNodes) {
        if (!last.childNodes || last.childNodes.length === 0)
            break;
        last = last.childNodes[0];
    }
    return last;
}
function nodeChildLast(n) {
    let last = n;
    while (last && last.childNodes) {
        if (!last.childNodes || last.childNodes.length === 0 || (last.childNodes.length === 1 && nodeIsVoid(last.childNodes[0])))
            break;
        last = last.childNodes[last.childNodes.length - 1];
    }
    return last;
}
function nodeChildInsertInto(target, node) {
    if (!target || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target))
        return;
    Array.from(node.childNodes).forEach(el => target.appendChild(el));
}
function nodeChildInsertBefore(target, beforeNode, node) {
    //insert node.childNodes into target
    if (!target || !beforeNode || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target))
        return;
    let idx = nodePosition(beforeNode);
    if (idx === -1)
        return;
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
        if (node.childNodes[i])
            target.insertBefore(node.childNodes[i], target.childNodes[idx]);
    }
}
function nodesInsertAfter(nodes, dest) {
    if (!nodes || !dest)
        return;
    let idx = nodePosition(dest);
    if (idx === -1)
        return;
    if (idx === dest.parentNode.childNodes.length - 1) {
        for (let i = 0, n = nodes.length; i < n; i++) {
            dest.parentNode.appendChild(nodes[i]);
        }
    }
    else {
        const beforeNode = dest.parentNode.childNodes[idx + 1];
        nodes.forEach(n => dest.parentNode.insertBefore(n, beforeNode));
    }
}
function nodePosition(n) {
    if (!n.parentNode || !n.parentNode.childNodes)
        return -1;
    for (let i = 0, nx = n.parentNode.childNodes.length; i < nx; i++) {
        if (n.parentNode.childNodes[i] === n) {
            return i;
        }
    }
    return -1;
}
function nodePrev(n, container) {
    let prev = n;
    if (prev !== container) {
        if (prev.previousSibling) {
            prev = prev.previousSibling;
        }
        else if (prev.parentNode && prev.parentNode === container) {
            prev = container;
        }
        else if (prev.parentNode) {
            prev = prev.parentNode;
            while (prev !== container && !prev.previousSibling) {
                prev = prev.parentNode;
            }
        }
    }
    return prev;
}
function nodeParentUntil(node, until) {
    const path = [];
    while (node && node !== until) {
        path.push(node);
        node = node.parentNode;
    }
    return path;
}
function nodeParent(n, tag, container) {
    if (!n)
        return null;
    if (!tag) {
        if (n.parentNode)
            return n.parentNode;
        else
            return null;
    }
    else if (tag && nodeNameCompare(n, tag))
        return n;
    let x = n;
    while (!nodeNameCompare(x, tag) && (!container || x !== container)) {
        if (!x.parentNode)
            return null;
        x = x.parentNode;
    }
    if (nodeNameCompare(x, tag))
        return x;
    return null;
}
function nodeNext(n, container) {
    let next = n;
    if (next !== container) {
        if (next.nextSibling) {
            next = next.nextSibling;
        }
        else if (next.parentNode && next.parentNode === container) {
            next = container;
        }
        else if (next.parentNode) {
            next = next.parentNode;
            while (next !== container && !next.nextSibling) {
                if (!next.parentNode)
                    break;
                next = next.parentNode;
            }
        }
    }
    return next;
}
function getRangeFocus(container) {
    let selection = getSelection();
    if (!selection || selection.rangeCount === 0) {
        container.focus();
        selection = getSelection();
    }
    if (!selection) {
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
function setCaretAt(node, startOffset = 0) {
    const selection = getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE && (node.textContent || "").length < startOffset + 1) {
        //set end instead:
        range.setEnd(node, node.textContent.length);
        range.collapse(false);
    }
    else if (node.nodeType !== Node.TEXT_NODE && node.childNodes.length < startOffset + 1) {
        //set end instead:
        range.setEnd(node.parentNode, Math.min(nodePosition(node) + 1, node.parentNode.childNodes.length));
        range.collapse(false);
    }
    else {
        range.setStart(node, startOffset);
        range.collapse(true);
    }
    selection.addRange(range);
}
function resetSelection(node, startOffset = -1, endOffset = -1) {
    //console.log("begin resetSelection", node, node.textContent, startOffset, endOffset, node.textContent.length);
    let selection = getSelection();
    if (!selection)
        return;
    let range = getRange();
    selection.removeAllRanges();
    if (!node && !range.endContainer)
        return;
    if (!node.parentNode) {
        //possible a node that has been moved
        node = range.endContainer;
    }
    //default put it to end
    if (startOffset === -1 && node.nodeType === 3)
        startOffset = node.textContent.length - 1;
    if (startOffset === -1 && node.nodeType !== 3)
        startOffset = node.childNodes.length - 1;
    if (node.nodeType === 3) {
        //text node:
        selection.collapse(node, Math.min(Math.max(startOffset, endOffset, 0), node.textContent.length));
    }
    else if (nodeNameCompare(node, "br")) {
        selection.collapse(node);
    }
    else {
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
        selection.collapseToEnd();
    }
    else {
        if (startOffset === 0)
            range.setStart(node, startOffset);
        else {
            range.setStart(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, startOffset));
        }
        if (endOffset < startOffset)
            endOffset = startOffset;
        range.setEnd(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, endOffset));
    }
    return selection;
}
function nodeNameCompareIndex(n, name) {
    let index = -1;
    if (!n || !n.nodeName)
        return index;
    if (typeof name === "string")
        return n && n.nodeName && n.nodeName.toString() === name.toUpperCase() ? 0 : -1;
    return name.indexOf(n.nodeName.toString());
}
function nodeNameCompare(n, name) {
    if (typeof name === "string")
        return n && n.nodeName && n.nodeName.toString() === name.toUpperCase();
    return n && name.indexOf(n.nodeName.toString()) !== -1;
}
const exp = {
    domFragment: domFragment,
    appendString2Node: appendString2Node,
    rangeCompareNode: rangeCompareNode,
    rangeContainsNode: rangeContainsNode,
    selectDeepNodesInRange: selectDeepNodesInRange,
    nodeReplaceWith: nodeReplaceWith,
    nodeTextMerge: nodeTextMerge,
    nodeTextMergeAll: nodeTextMergeAll,
    wrapNode: wrapNode,
    unwrapNode: unwrapNode,
    unwrapNodes: unwrapNodes,
    mergeTags: mergeTags,
    nodeAttrStyle: nodeAttrStyle,
    nodeReplaceAttrStyle: nodeReplaceAttrStyle,
    nodeChildRemoveAttrStyle: nodeChildRemoveAttrStyle,
    nodeIsVoid: nodeIsVoid,
    nodeIsText: nodeIsText,
    nodeIsTextOrVoid: nodeIsTextOrVoid,
    selectNodesBetweenRange: selectNodesBetweenRange,
    nodeIsTextInlineOrVoid: nodeIsTextInlineOrVoid,
    nodesAreTextOrVoid: nodesAreTextOrVoid,
    getSelection: getSelection,
    getRange: getRange,
    getRangeFocus: getRangeFocus,
    resetSelection: resetSelection,
    nodeIsInlineFormat: nodeIsInlineFormat,
    nodesAreTextInlineOrVoid: nodesAreTextInlineOrVoid,
    nodeNext: nodeNext,
    nodeChildFirst: nodeChildFirst,
    nodeChildLast: nodeChildLast,
    nodePrev: nodePrev,
    nodeNameCompare: nodeNameCompare,
    nodeNameCompareIndex: nodeNameCompareIndex,
    nodeParentUntil: nodeParentUntil,
    nodeParent: nodeParent,
    nodeChildInsertBefore: nodeChildInsertBefore,
    nodeChildInsertInto: nodeChildInsertInto,
    nodePosition: nodePosition,
    nodesInsertAfter: nodesInsertAfter,
    setCaretAt: setCaretAt,
    nodeBreak: nodeBreak,
    table: table_1.default
};
exports.default = exp;
//# sourceMappingURL=dom.js.map