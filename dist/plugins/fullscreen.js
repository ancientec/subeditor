"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [{
        event: "onCommand",
        target: ["fullscreen"],
        callback: (editor, type, value) => {
            if (value) {
                //backup style:
                editor.refEditor.classList.add("fullscreen");
            }
            else {
                editor.refEditor.classList.remove("fullscreen");
            }
            editor.event.trigger("onFullscreenChange", "", [editor, value]);
            return false;
        }
    }];
//# sourceMappingURL=fullscreen.js.map