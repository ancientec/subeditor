"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        format: {
            command: "format",
            svg: subeditor_1.default.svgList["p"],
            tips: "format",
            dropdowncontent: '<div class="se-ToolbarItem se-dropdown" data-tips="' + editor.ln("paragraph") + '"><div class="se-dropdown-trigger"><button class="se-button"  data-command="paragraph" data-tips="paragraph" id="btn-dropdown-menu-paragraph" aria-haspopup="true" aria-controls="dropdown-menu-paragraph"><span></span><span class="se-icon" aria-hidden="true">' + subeditor_1.default.svgList["p"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-paragraph" role="menu"><div class="se-dropdown-content horizontal"  aria-hidden="true"><span class="se-button se-ToolbarItem" data-command="p" data-featureformat="P" data-tips="Normal"><span class="se-icon">' + subeditor_1.default.svgList["p"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h1" data-featureformat="H1" data-tips="Heading 1"><span class="se-icon">' + subeditor_1.default.svgList["h1"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h2" data-featureformat="H2" data-tips="Heading 2"><span class="se-icon">' + subeditor_1.default.svgList["h2"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h3" data-featureformat="H3" data-tips="Heading 3"><span class="se-icon">' + subeditor_1.default.svgList["h3"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h4" data-featureformat="H4" data-tips="Heading 4"><span class="se-icon">' + subeditor_1.default.svgList["h4"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h5" data-featureformat="H5" data-tips="Heading 5"><span class="se-icon">' + subeditor_1.default.svgList["h5"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h6" data-featureformat="H6" data-tips="Heading 6"><span class="se-icon">' + subeditor_1.default.svgList["h6"] + '</span></span><span class="se-button se-ToolbarItem" data-command="blockquote" data-featureformat="BLOCKQUOTE" data-tips="Blockquote"><span class="se-icon">' + subeditor_1.default.svgList["blockquote"] + '</span></span><span class="se-button se-ToolbarItem" data-command="code" data-featureformat="CODE" data-tips="Code"><span class="se-icon">' + subeditor_1.default.svgList["code"] + '</span></span></div></div></div>',
            onRender: (_editor, el) => {
                el.querySelectorAll('.se-button').forEach(elm => {
                    elm.addEventListener('click', (e) => {
                        const cmd = elm.getAttribute("data-command");
                        _editor.command(cmd, []);
                    });
                });
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=format.js.map