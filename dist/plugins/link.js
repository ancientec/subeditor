"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        event: "onCommand",
        target: ["link"],
        callback: (editor, cmd, action, url, text, target) => {
            var _a, _b, _c;
            const { range } = editor.getSelectionRange();
            if (action === "remove" && ((_a = editor.feature) === null || _a === void 0 ? void 0 : _a.a.node)) {
                editor.dom.unwrapNode((_b = editor.feature) === null || _b === void 0 ? void 0 : _b.a.node);
                editor.triggerChange();
                return;
            }
            else if (action === "update" && ((_c = editor.feature) === null || _c === void 0 ? void 0 : _c.a.node)) {
                const n = editor.feature.a.node, offset = range.endOffset;
                n.href = url || "";
                n.target = target || "";
                n.textContent = text || "";
                editor.dom.setCaretAt(n.firstChild, Math.min(offset, text.length));
                editor.triggerChange();
                return;
            }
            range.deleteContents();
            range.collapse(false);
            //do insert or update:
            let node = document.createElement("a");
            node.href = url || "";
            node.target = target || "";
            node.textContent = text || "";
            if (range.endContainer.parentElement.nodeName === "CODE") {
                let el = range.endContainer.parentElement;
                if (el.parentElement.nodeName === "PRE")
                    el = el.parentElement;
                editor.dom.nodesInsertAfter([node], el);
            }
            else {
                range.insertNode(node);
            }
            editor.dom.setCaretAt(node.firstChild, node.textContent.length);
            editor.triggerChange();
        }
    },
    {
        event: "onCommand",
        target: ["remove_link"],
        callback: (editor) => {
            var _a, _b, _c, _d, _e;
            const { selection } = editor.getSelectionRange();
            const c = (_b = (_a = editor.feature) === null || _a === void 0 ? void 0 : _a.a.node) === null || _b === void 0 ? void 0 : _b.childNodes[0];
            let offset = (selection === null || selection === void 0 ? void 0 : selection.focusOffset) || 0, el = selection === null || selection === void 0 ? void 0 : selection.focusNode;
            if ((_c = editor.feature) === null || _c === void 0 ? void 0 : _c.a.node) {
                editor.dom.unwrapNode((_d = editor.feature) === null || _d === void 0 ? void 0 : _d.a.node);
                if (((_e = c === null || c === void 0 ? void 0 : c.previousSibling) === null || _e === void 0 ? void 0 : _e.nodeType) === Node.TEXT_NODE) {
                    if (el === c) {
                        el = c.previousSibling;
                        offset = el.textContent.length + offset;
                    }
                    c.previousSibling.textContent += c.textContent || "";
                    c.remove();
                }
                if (el)
                    editor.dom.setCaretAt(el, offset);
                editor.triggerChange();
            }
        }
    }
];
//# sourceMappingURL=link.js.map