"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
const ev = [{ event: "onFeatureChange", target: [], callback: function (_editor) {
            _editor.refToolbar.querySelectorAll('.se-ToolbarItem[data-tips="text"] .se-button[data-command]').forEach(btn => {
                btn.classList.remove('is-featured');
                const cmd = btn.getAttribute("data-command");
                if (_editor.feature[cmd]) {
                    btn.classList.add('is-featured');
                }
            });
        } }];
function default_1(editor) {
    const o = {
        text: {
            command: "text",
            svg: subeditor_1.default.svgList["text"],
            tips: "text",
            dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="text"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">' + subeditor_1.default.svgList["text"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="bold" data-tips="bold"><span class="se-icon">' + subeditor_1.default.svgList["b"] + '</span></span><span class="se-button se-ToolbarItem" data-command="italic" data-tips="italic"><span class="se-icon">' + subeditor_1.default.svgList["i"] + '</span></span><span class="se-button se-ToolbarItem" data-command="underline" data-tips="underline"><span class="se-icon">' + subeditor_1.default.svgList["u"] + '</span></span><span class="se-button se-ToolbarItem" data-command="strikethrough" data-tips="strikethrough"><span class="se-icon">' + subeditor_1.default.svgList["strikethrough"] + '</span></span><span class="se-button se-ToolbarItem" data-command="superscript" data-tips="superscript"><span class="se-icon">' + subeditor_1.default.svgList["superscript"] + '</span></span><span class="se-button se-ToolbarItem" data-command="subscript" data-tips="subscript"><span class="se-icon">' + subeditor_1.default.svgList["subscript"] + '</span></span></div></div></div>',
            onRender: (_editor, el) => {
                el.querySelectorAll('.se-button[data-command]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        _editor.command(btn.getAttribute("data-command"));
                        return false;
                    });
                });
                _editor.event.register(ev);
                //end of feature change
            }
        }
    };
    const x = { b: "bold", i: "italic", u: "underline", strikethrough: "strikethrough", subscript: "subscript", superscript: "superscript" };
    Object.keys(x).forEach(key => {
        const cmd = x[key];
        o[cmd] = {
            command: cmd, svg: "", tips: "",
            dropdowncontent: '<span class="se-button se-ToolbarItem" data-command="' + cmd + '" data-tips="' + cmd + '"><span class="se-icon">' + (subeditor_1.default.svgList[key]) + '</span></span>',
            onRender: (_editor, el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    _editor.command(el.getAttribute("data-command"));
                    return false;
                });
            }
        };
    });
    return o;
}
exports.default = default_1;
//# sourceMappingURL=text.js.map