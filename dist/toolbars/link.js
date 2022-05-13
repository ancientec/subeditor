"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        link: {
            command: "link",
            svg: subeditor_1.default.svgList["link"],
            tips: "link",
            dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("link") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-link"><span></span><span class="se-icon">' + subeditor_1.default.svgList["link"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-link" role="menu"><div class="se-dropdown-content control"><div class="padding"><div class="se-dropdown-item"><input type="text" name="url"><label>' + editor.ln("url") + '</label></div><div class="se-dropdown-item"><input type="text" name="text"><label>' + editor.ln("text") + '</label></div><div class="se-dropdown-item"><input type="text" name="target"><label>' + editor.ln("link target") + ' <u style="cursor:pointer">' + editor.ln("open in new tab") + '</u></label></div><div style="text-align: right;margin-right:5px"><button class="se-button alert">' + editor.ln("remove") + '</button><button class="se-button insert">' + editor.ln("insert") + '</button></div></div></div></div></div>',
            onRender: (_editor, el) => {
                var _a, _b;
                const btnAlert = el.querySelector('.se-dropdown-content .se-button.alert'), btnInsert = el.querySelector('.se-dropdown-content .se-button.insert'), inputURL = el.querySelector('.se-dropdown-content input[name=url]'), inputText = el.querySelector('.se-dropdown-content input[name=text]'), inputTarget = el.querySelector('.se-dropdown-content input[name=target]');
                //cache selection, typing in input lose selection
                editor.setCache("currentSelection", _editor.selection);
                (_a = el.querySelector("u")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    el.querySelector("input[name=target]").value = "_blank";
                });
                btnInsert.addEventListener('click', (e) => {
                    var _a;
                    e.preventDefault();
                    e.stopPropagation();
                    (_a = _editor.toolbar) === null || _a === void 0 ? void 0 : _a.hideDropdown();
                    _editor.restoreSelection(editor.getCache("currentSelection"));
                    _editor.command('link', [btnInsert.innerHTML === editor.ln("insert") ? "insert" : "update", inputURL.value, inputText.value, inputTarget.value]);
                    return false;
                });
                btnAlert.addEventListener('click', (e) => {
                    var _a;
                    e.preventDefault();
                    e.stopPropagation();
                    (_a = _editor.toolbar) === null || _a === void 0 ? void 0 : _a.hideDropdown();
                    _editor.command('link', ["remove"]);
                    return false;
                });
                const menu = el.querySelector('.se-dropdown-menu');
                (_b = el.querySelector('.se-dropdown-trigger > button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                    var _a, _b, _c, _d, _e;
                    if (!menu.classList.contains("is-active")) {
                        //to be open:
                        //save selection:
                        editor.setCache("currentSelection", _editor.selection);
                        if ((_a = _editor.feature) === null || _a === void 0 ? void 0 : _a.a.node) {
                            //update
                            btnInsert.innerHTML = editor.ln("update");
                            inputURL.value = ((_b = _editor.feature) === null || _b === void 0 ? void 0 : _b.a.href) || "";
                            inputTarget.value = ((_c = _editor.feature) === null || _c === void 0 ? void 0 : _c.a.target) || "";
                            inputText.value = ((_e = (_d = _editor.feature) === null || _d === void 0 ? void 0 : _d.a.node) === null || _e === void 0 ? void 0 : _e.textContent) || "";
                            btnAlert.style.display = "";
                        }
                        else {
                            //insert
                            inputURL.value = "";
                            inputTarget.value = "";
                            inputText.value = "";
                            btnInsert.innerHTML = editor.ln("insert");
                            btnAlert.style.display = "none";
                        }
                    }
                });
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=link.js.map