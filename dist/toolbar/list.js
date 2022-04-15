"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
const ev = [{ event: "onFeatureChange", target: [], callback: function (_editor) {
            _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-command="ol"],.se-ToolbarItem[data-command="ul"]').forEach(btn => {
                var _a;
                btn.classList.remove('is-featured');
                const cmd = btn.getAttribute("data-command");
                if ((_a = _editor.feature) === null || _a === void 0 ? void 0 : _a.path.includes(cmd.toUpperCase())) {
                    btn.classList.add('is-featured');
                }
            });
        } }];
function default_1(editor) {
    return {
        ol: {
            command: "ol",
            svg: subeditor_1.default.svgList["ol"],
            tips: "ordered list",
            onRender: (_editor, el) => {
                el.addEventListener('click', (e) => {
                    const cmd = el.getAttribute("data-command");
                    _editor.command(cmd, []);
                });
                _editor.event.register(ev);
                //end of feature change
            }
        },
        ul: {
            command: "ul",
            svg: subeditor_1.default.svgList["ul"],
            tips: "unordered list",
            onRender: (_editor, el) => {
                el.addEventListener('click', (e) => {
                    const cmd = el.getAttribute("data-command");
                    _editor.command(cmd, []);
                });
                _editor.event.register(ev);
                //end of feature change
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=list.js.map