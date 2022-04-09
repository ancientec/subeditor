"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [{
        event: "onCommand",
        target: ["source"],
        callback: (editor, type, value) => {
            const mode = editor.refContent.style.display === "none" ? "source" : "editor";
            if (mode === "editor") {
                editor.refContent.style.display = "none";
                const source = document.createElement("textarea");
                source.classList.add("SubEditorSource");
                source.value = editor.refContent.innerHTML;
                source.addEventListener("input", () => source.style.height = source.scrollHeight + "px");
                editor.refContent.parentElement.appendChild(source);
            }
            else {
                editor.refContent.style.display = "";
                const source = editor.refEditor.querySelector(".SubEditorSource");
                editor.changeValue(source.value);
                source.remove();
            }
        }
    }];
//# sourceMappingURL=source.js.map