"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags = { "bold": "strong", "italic": "em", "underline": "u", "strikethrough": "strike", "subscript": "sub", "superscript": "sup" };
const tag_values = Object.values(tags);
tag_values.push("i");
const isText = (t) => tag_values.indexOf(t.toLowerCase()) !== -1;
const isInText = (n, matchNodeName) => {
    do {
        if (n.nodeName.toLowerCase() === matchNodeName || (matchNodeName === "em" && n.nodeName === "I")) {
            return n;
        }
        n = n.parentElement;
    } while (n && isText(n.nodeName));
    return false;
};
exports.default = [
    {
        event: "onCommand",
        target: ["bold", "italic", "underline", "strikethrough", "subscript", "superscript"],
        callback: (editor, type) => {
            const tag = tags[type];
            const { range } = editor.getSelectionRange();
            let caretNode = range.endContainer, caretOffset = range.endOffset;
            const nodes = editor.dom.selectDeepNodesInRange(range);
            //determine if we are wrapping or unwrap:
            const firstTextNode = nodes.find(n => n.node.nodeType === Node.TEXT_NODE);
            const needWrap = !firstTextNode || !isInText(firstTextNode.node, tag);
            const formatNode = (n) => {
                const placeholder = document.createElement(tag);
                const parentNode = isInText(n.node, tag);
                if (needWrap && !parentNode) {
                    editor.dom.wrapNode(n.node, placeholder);
                }
                else if (!needWrap && parentNode) {
                    //unwrap
                    editor.dom.unwrapNode(parentNode, editor.refContent);
                }
            };
            caretNode = nodes[nodes.length - 1].node;
            caretOffset = nodes[nodes.length - 1].endOffset;
            const resetCaret = () => {
                editor.dom.setCaretAt(caretNode, caretOffset);
                editor.triggerChange();
            };
            if (nodes[0].collapsed) {
                if (nodes[0].node === editor.refContent) {
                    const placeholder = document.createElement(tag);
                    editor.refContent.appendChild(placeholder);
                    placeholder.appendChild(document.createElement("br"));
                    range.selectNode(placeholder);
                    range.collapse(true);
                    editor.triggerChange();
                    return;
                }
                //only handle text nodes
                if (nodes[0].node.nodeType === Node.TEXT_NODE && nodes[0].node.parentElement)
                    formatNode(nodes[0]);
                //maybe insert into end of doc
                editor.dom.mergeTags(range.commonAncestorContainer, tag);
                return resetCaret();
            }
            nodes.forEach((node) => {
                var _a, _b;
                if (node.isVoid) {
                    return;
                }
                if (!node.partial) {
                    formatNode(node);
                    return;
                }
                //handle beginng and
                const parentNode = isInText(node.node, tag);
                if (needWrap && !parentNode) {
                    //extract the string to be styled
                    const str = node.startOffset !== undefined && node.startOffset > -1 ? node.node.textContent.substring(node.startOffset, node.endOffset) : node.node.textContent;
                    const span = document.createElement(tag);
                    span.appendChild(document.createTextNode(str));
                    if (nodes.length === 1) {
                        //string in middle
                        range.deleteContents();
                        range.insertNode(span);
                        editor.dom.setCaretAt(span.childNodes[0], (_a = span.childNodes[0].textContent) === null || _a === void 0 ? void 0 : _a.length);
                    }
                    else if (node === nodes[0]) {
                        //append to start
                        editor.dom.nodesInsertAfter([span], node.node);
                        node.node.textContent = node.node.textContent.substring(0, node.startOffset);
                    }
                    else if (node === nodes[nodes.length - 1]) {
                        //insert before end
                        (_b = node.node.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(span, node.node);
                        node.node.textContent = node.node.textContent.substring(node.endOffset);
                    }
                }
                else if (!needWrap && parentNode) {
                    //unwrap
                    editor.dom.unwrapNode(parentNode, editor.refContent);
                }
            });
            editor.dom.mergeTags(range.commonAncestorContainer, tag);
            resetCaret();
        }
    }
];
//# sourceMappingURL=text.js.map