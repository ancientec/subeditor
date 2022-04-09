"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paste_1 = require("../paste");
exports.default = [
    {
        event: "onPaste",
        target: [],
        callback: (editor, e) => {
            var _a, _b, _c, _d, _e, _f;
            e.preventDefault();
            e.stopPropagation();
            if (!e.clipboardData)
                return;
            const html = (0, paste_1.cleanupHtml)(e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain"));
            const { range } = editor.getSelectionRange();
            range.deleteContents();
            if ((_a = editor.feature) === null || _a === void 0 ? void 0 : _a.path.includes("CODE")) {
                //paste plain text
                if (range.endContainer.nodeType === Node.TEXT_NODE) {
                    const endOffset = range.endOffset, offset = endOffset + html.length;
                    range.endContainer.textContent = ((_b = range.endContainer.textContent) === null || _b === void 0 ? void 0 : _b.substring(0, endOffset)) + html + ((_c = range.endContainer.textContent) === null || _c === void 0 ? void 0 : _c.substring(endOffset));
                    editor.dom.setCaretAt(range.endContainer, offset);
                }
            }
            else {
                //paste html
                const pholder = document.createElement("div");
                pholder.innerHTML = html;
                if (range.endContainer.nodeType === Node.TEXT_NODE) {
                    const end = document.createTextNode(range.endContainer.textContent.substring(range.endOffset));
                    range.endContainer.textContent = range.endContainer.textContent.substring(0, range.endOffset);
                    editor.dom.nodesInsertAfter([...Array.from(pholder.childNodes), end], range.endContainer);
                    editor.dom.setCaretAt(end, 0);
                }
                else {
                    range.insertNode(pholder);
                    if (pholder.nextSibling)
                        editor.dom.setCaretAt(pholder.nextSibling, 0);
                    else
                        editor.dom.setCaretAt(pholder.lastChild, ((_d = pholder.lastChild) === null || _d === void 0 ? void 0 : _d.childNodes.length) || ((_f = (_e = pholder.lastChild) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.length));
                    editor.dom.unwrapNode(pholder);
                }
            }
            editor.triggerChange();
        }
    },
    {
        event: "onKeyUp",
        target: ["ctrl+v", "cmd+v"],
        callback: (editor, e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
];
//# sourceMappingURL=paste.js.map