"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [{
        event: "onCommand",
        target: ["fullscreen"],
        callback: (editor, type, value) => {
            if (value) {
                //backup style:
                editor.refEditor.setAttribute("data-backupstyle", editor.refEditor.getAttribute("style") || "");
                editor.refEditor.setAttribute("style", "position:fixed;z-index:100500;height:100%;width:100%;top:0;left:0;");
            }
            else {
                editor.refEditor.setAttribute("style", editor.refEditor.getAttribute("data-backupstyle") || "");
            }
            editor.event.trigger("onFullscreenChange", "", [editor, value]);
            return false;
        }
    }];
//# sourceMappingURL=fullscreen.js.map