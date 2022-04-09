"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        align: {
            command: "align",
            svg: subeditor_1.default.svgList["align_left"],
            tips: "align",
            dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("align") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">' + subeditor_1.default.svgList["align_left"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="align" data-value="left" data-tips="align left"><span class="se-icon">' + subeditor_1.default.svgList["align_left"] + '</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="center" data-tips="align center"><span class="se-icon">' + subeditor_1.default.svgList["align_center"] + '</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="right" data-tips="align right"><span class="se-icon">' + subeditor_1.default.svgList["align_right"] + '</span></span><span class="se-button ToolbarItem" data-command="align" data-value="justify" data-tips="align justify"><span class="se-icon">' + subeditor_1.default.svgList["align_justify"] + '</span></span></div></div></div>',
            onRender: (_editor, el) => {
                el.querySelectorAll('.se-button[data-command]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        _editor.command("align", [btn.getAttribute("data-value")]);
                        return false;
                    });
                });
                _editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
                            el.querySelectorAll('.se-button').forEach(btn => {
                                var _a;
                                btn.classList.remove('is-featured');
                                if (btn.getAttribute("data-value") === ((_a = _editor.feature) === null || _a === void 0 ? void 0 : _a.align)) {
                                    btn.classList.add('is-featured');
                                }
                            });
                        } }]);
                //end of feature change
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=align.js.map