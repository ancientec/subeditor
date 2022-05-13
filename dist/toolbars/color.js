"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    if (x === '')
        return '00';
    const hex = (parseInt(x, 10)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');
const rgbStyleToHex = (rgb) => {
    if (rgb.indexOf('rgb(') === -1)
        return rgb;
    let _rgb = rgb.replace('rgb(', '').replace(')', '').split(',');
    return rgbToHex(_rgb[0], _rgb[1], _rgb[2]);
};
function default_1(editor) {
    const content = (type) => {
        var _a, _b;
        const v = type === 'color' ?
            ['color', subeditor_1.default.svgList['text_color'], ((_a = editor.feature) === null || _a === void 0 ? void 0 : _a.color) || "", editor.ln('text color'), editor.ln('SET COLOR'), '#000000'] :
            ['background', subeditor_1.default.svgList['background_color'], ((_b = editor.feature) === null || _b === void 0 ? void 0 : _b.background) || "", editor.ln("background color"), editor.ln('SET BACKGROUND COLOR'), '#ffffff'];
        return '<div class="se-ToolbarItem se-dropdown"><div class="se-dropdown-trigger"><button class="se-button"  data-command="' + v[0] + '" data-tips="' + v[3] + '" id="btn-dropdown-menu-' + v[0] + '" aria-haspopup="true" aria-controls="dropdown-menu-' + v[0] + '"><span></span><span class="se-icon">' + v[1] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-' + v[0] + '" role="menu"><div class="se-dropdown-content control"><div class="padding"><table><tbody><tr><td><div style="background-color: rgb(0, 0, 0);"></div></td><td><div style="background-color: rgb(68, 68, 68);"></div></td><td><div style="background-color: rgb(102, 102, 102);"></div></td><td><div style="background-color: rgb(153, 153, 153);"></div></td><td><div style="background-color: rgb(204, 204, 204);"></div></td><td><div style="background-color: rgb(238, 238, 238);"></div></td><td><div style="background-color: rgb(243, 243, 243);"></div></td><td><div style="background-color: rgb(255, 255, 255);"></div></td></tr><tr><td><div style="background-color: rgb(255, 0, 0);"></div></td><td><div style="background-color: rgb(255, 153, 0);"></div></td><td><div style="background-color: rgb(255, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 255);"></div></td><td><div style="background-color: rgb(0, 0, 255);"></div></td><td><div style="background-color: rgb(153, 0, 255);"></div></td><td><div style="background-color: rgb(255, 0, 255);"></div></td></tr><tr><td><div style="background-color: rgb(244, 204, 204);"></div></td><td><div style="background-color: rgb(252, 229, 205);"></div></td><td><div style="background-color: rgb(255, 242, 204);"></div></td><td><div style="background-color: rgb(217, 234, 211);"></div></td><td><div style="background-color: rgb(208, 224, 227);"></div></td><td><div style="background-color: rgb(207, 226, 243);"></div></td><td><div style="background-color: rgb(217, 210, 233);"></div></td><td><div style="background-color: rgb(234, 209, 220);"></div></td></tr><tr><td><div style="background-color: rgb(234, 153, 153);"></div></td><td><div style="background-color: rgb(249, 203, 156);"></div></td><td><div style="background-color: rgb(255, 229, 153);"></div></td><td><div style="background-color: rgb(182, 215, 168);"></div></td><td><div style="background-color: rgb(162, 196, 201);"></div></td><td><div style="background-color: rgb(159, 197, 232);"></div></td><td><div style="background-color: rgb(180, 167, 214);"></div></td><td><div style="background-color: rgb(213, 166, 189);"></div></td></tr><tr><td><div style="background-color: rgb(224, 102, 102);"></div></td><td><div style="background-color: rgb(246, 178, 107);"></div></td><td><div style="background-color: rgb(255, 217, 102);"></div></td><td><div style="background-color: rgb(147, 196, 125);"></div></td><td><div style="background-color: rgb(118, 165, 175);"></div></td><td><div style="background-color: rgb(111, 168, 220);"></div></td><td><div style="background-color: rgb(142, 124, 195);"></div></td><td><div style="background-color: rgb(194, 123, 160);"></div></td></tr><tr><td><div style="background-color: rgb(204, 0, 0);"></div></td><td><div style="background-color: rgb(230, 145, 56);"></div></td><td><div style="background-color: rgb(241, 194, 50);"></div></td><td><div style="background-color: rgb(106, 168, 79);"></div></td><td><div style="background-color: rgb(69, 129, 142);"></div></td><td><div style="background-color: rgb(61, 133, 198);"></div></td><td><div style="background-color: rgb(103, 78, 167);"></div></td><td><div style="background-color: rgb(166, 77, 121);"></div></td></tr><tr><td><div style="background-color: rgb(153, 0, 0);"></div></td><td><div style="background-color: rgb(180, 95, 6);"></div></td><td><div style="background-color: rgb(191, 144, 0);"></div></td><td><div style="background-color: rgb(56, 118, 29);"></div></td><td><div style="background-color: rgb(19, 79, 92);"></div></td><td><div style="background-color: rgb(11, 83, 148);"></div></td><td><div style="background-color: rgb(53, 28, 117);"></div></td><td><div style="background-color: rgb(116, 27, 71);"></div></td></tr><tr><td><div style="background-color: rgb(102, 0, 0);"></div></td><td><div style="background-color: rgb(120, 63, 4);"></div></td><td><div style="background-color: rgb(127, 96, 0);"></div></td><td><div style="background-color: rgb(39, 78, 19);"></div></td><td><div style="background-color: rgb(12, 52, 61);"></div></td><td><div style="background-color: rgb(7, 55, 99);"></div></td><td><div style="background-color: rgb(32, 18, 77);"></div></td><td><div style="background-color: rgb(76, 17, 48);"></div></td></tr></tbody></table><div><input class="Hex" type="color" value="' + (rgbStyleToHex(v[2]) || v[5]) + '"><button class="se-button">' + v[4] + '</button></div></div></div></div></div>';
    };
    return {
        color: {
            command: "color",
            svg: subeditor_1.default.svgList["text_color"],
            tips: editor.ln("text color"),
            dropdowncontent: content('color'),
            onRender: (_editor, el) => {
                var _a, _b;
                const menu = el.querySelector('.se-dropdown-menu');
                (_a = el.querySelector('.se-dropdown-trigger > button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    var _a, _b, _c, _d, _e;
                    if (!menu.classList.contains("is-active")) {
                        //to be open:
                        //make sure feature is ready
                        _editor.handleFeature();
                        el.querySelector('input').value = rgbStyleToHex(((_b = (_a = _editor.feature) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.style.color) || ((_e = (_d = (_c = _editor.feature) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.style.color) || "");
                    }
                });
                el.querySelectorAll('td > div').forEach(div => {
                    div.addEventListener('click', (e) => {
                        el.querySelector('input').value = rgbStyleToHex(e.currentTarget.style.backgroundColor);
                    });
                });
                (_b = el.querySelector('.se-dropdown-content button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
                    var _a, _b;
                    e.preventDefault();
                    e.stopPropagation();
                    (_a = _editor.toolbar) === null || _a === void 0 ? void 0 : _a.hideDropdown();
                    _editor.command('color', [(_b = el.querySelector('input')) === null || _b === void 0 ? void 0 : _b.value]);
                    return false;
                });
            }
        },
        backgroundcolor: {
            command: "backgroundcolor",
            svg: subeditor_1.default.svgList["background_color"],
            tips: "background color",
            dropdowncontent: content('background'),
            onRender: (_editor, el) => {
                var _a, _b;
                const menu = el.querySelector('.se-dropdown-menu');
                (_a = el.querySelector('.se-dropdown-trigger > button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    var _a, _b, _c, _d, _e;
                    if (!menu.classList.contains("is-active")) {
                        //to be open:
                        //make sure feature is ready
                        _editor.handleFeature();
                        el.querySelector('input').value = rgbStyleToHex(((_b = (_a = _editor.feature) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.style.backgroundColor) || ((_e = (_d = (_c = _editor.feature) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.style.backgroundColor) || "");
                    }
                });
                el.querySelectorAll('td > div').forEach(div => {
                    div.addEventListener('click', (e) => {
                        el.querySelector('input').value = rgbStyleToHex(e.currentTarget.style.backgroundColor);
                    });
                });
                (_b = el.querySelector('.se-dropdown-content button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
                    var _a, _b;
                    e.preventDefault();
                    e.stopPropagation();
                    (_a = _editor.toolbar) === null || _a === void 0 ? void 0 : _a.hideDropdown();
                    _editor.command('backgroundcolor', [(_b = el.querySelector('input')) === null || _b === void 0 ? void 0 : _b.value]);
                    return false;
                });
            }
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=color.js.map