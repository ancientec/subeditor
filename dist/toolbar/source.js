"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        source: {
            command: "source",
            svg: subeditor_1.default.svgList["view_source"],
            tips: "view source",
            onRender: (_editor, el) => {
                el.addEventListener('click', () => {
                    var _a;
                    //raise shadow:
                    if (!((_a = _editor.toolbar) === null || _a === void 0 ? void 0 : _a.hasShadow())) {
                        _editor.toolbar.enableShadow(["source", "fullscreen"]);
                    }
                    else {
                        _editor.toolbar.disableShadow();
                    }
                    const cmd = el.getAttribute("data-command");
                    _editor.command(cmd, []);
                });
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=source.js.map