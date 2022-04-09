"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [{
        event: "onCommand",
        target: ["indent", "outdent"],
        callback: (editor, cmd, value) => {
            const attr = "padding-left";
            const size = cmd === "indent" ? parseInt("" + editor.getCfg("indent.size"), 10) || 40 : 0 - (parseInt("" + editor.getCfg("indent.size"), 10) || 40);
            const paddingLeft = (node, size2) => {
                let padding = (parseInt(editor.dom.nodeAttrStyle(node, attr), 10) || 0) + size2;
                if (padding < 0 && cmd !== "indent")
                    return;
                if (padding === 0) {
                    node.style.paddingLeft = "";
                }
                else
                    node.style.paddingLeft = padding + "px";
            };
            const usableParent = (node) => {
                const path = [];
                path.push(node);
                while (editor.dom.nodeIsTextInlineOrVoid(node)) {
                    node = node.parentNode;
                    path.push(node);
                }
                return path;
            };
            const { range } = editor.getSelectionRange();
            const nodes = editor.dom.selectDeepNodesInRange(range);
            if (nodes[0].collapsed) {
                const parent = usableParent(nodes[0].node);
                if (nodes[0].node === editor.refContent) {
                    const placeholder = document.createElement('p');
                    paddingLeft(placeholder, size);
                    placeholder.appendChild(document.createElement("br"));
                    editor.refContent.appendChild(placeholder);
                    editor.dom.setCaretAt(placeholder, 0);
                }
                else if (editor.dom.nodesAreTextInlineOrVoid(Array.from(parent[0].childNodes))) {
                    if (parent[parent.length - 1] !== editor.refContent) {
                        paddingLeft(parent[parent.length - 1], size);
                    }
                    else {
                        //move everything in
                        const placeholder = document.createElement('p');
                        paddingLeft(placeholder, size);
                        Array.from(parent[parent.length - 1].childNodes).forEach(el => placeholder.appendChild(el));
                        parent[parent.length - 1].appendChild(placeholder);
                        editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
                    }
                }
                else if (parent[parent.length - 1] === editor.refContent) {
                    const placeholder = document.createElement('p');
                    paddingLeft(parent[parent.length - 1], size);
                    editor.dom.wrapNode(parent[parent.length - 2], placeholder);
                    editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
                }
                else {
                    paddingLeft(parent[parent.length - 1], size);
                }
                editor.triggerChange();
                return;
            }
            let lastPlaceholdler = null, padded = [], reducedNodes = [];
            if (nodes.length > 3) {
                //reduce to childNodes of common commonAncestorContainer
                reducedNodes = editor.dom.selectNodesBetweenRange(range);
                reducedNodes.unshift(nodes[0].node);
                reducedNodes.push(nodes[nodes.length - 1].node);
            }
            else {
                nodes.forEach(n => reducedNodes.push(n.node));
            }
            reducedNodes.forEach((node) => {
                for (var i = 0, l = padded.length; i < l; i++) {
                    if (padded[i].contains(node))
                        return;
                }
                const parent2 = usableParent(node);
                if (parent2[parent2.length - 1] === editor.refContent) {
                    if (lastPlaceholdler === null || lastPlaceholdler !== node.previousSibling) {
                        lastPlaceholdler = document.createElement('p');
                        paddingLeft(lastPlaceholdler, size);
                        editor.dom.wrapNode(parent2[parent2.length - 2], lastPlaceholdler);
                    }
                    else {
                        //reuse,merge into pervious
                        lastPlaceholdler.appendChild(parent2[parent2.length - 2]);
                    }
                }
                else {
                    paddingLeft(parent2[parent2.length - 1], size);
                }
            });
            if (nodes[nodes.length - 1].isVoid) {
                //next of this element
                editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
            }
            else {
                editor.dom.setCaretAt(range.endContainer, range.endOffset);
            }
            editor.triggerChange();
        }
    }];
//# sourceMappingURL=indent.js.map