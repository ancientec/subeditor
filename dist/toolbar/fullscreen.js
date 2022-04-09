"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        fullscreen: {
            command: "fullscreen",
            svg: subeditor_1.default.svgList["fullscreen"],
            tips: "fullscreen",
            onRender: (_editor, el) => {
                //when next button click, set fullscreen according to value, "1"= to fullscreen, ""=exit fullscreen
                el.setAttribute("data-value", "1"); //next to fullscreen
                el.addEventListener('click', (e) => {
                    _editor.command("fullscreen", [el.getAttribute("data-value")]);
                });
                _editor.event.register([{ event: "onFullscreenChange", target: [], callback: () => {
                            const isFullscreen = el.getAttribute("data-value");
                            if (isFullscreen === "") {
                                //exit fullscreen
                                el.querySelector("span.se-icon").innerHTML = subeditor_1.default.svgList["fullscreen"];
                                el.setAttribute("data-value", "1");
                                el.setAttribute("data-tips", "exit fullscreen");
                                el.classList.remove("is-featured");
                            }
                            else {
                                //to fullscreen
                                el.querySelector("span.se-icon").innerHTML = subeditor_1.default.svgList["fullscreen_close"];
                                el.setAttribute("data-value", "");
                                el.setAttribute("data-tips", "fullscreen");
                                el.classList.add("is-featured");
                            }
                            if (editor.refToolbar) {
                                const tips = editor.refToolbar.querySelector(".tips");
                                if (tips) {
                                    tips.style.display = "none";
                                    tips.style.top = "";
                                }
                            }
                        } }]);
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=fullscreen.js.map