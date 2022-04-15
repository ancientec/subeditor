"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarPresets = void 0;
const color_1 = __importDefault(require("./color"));
const blockquote_1 = __importDefault(require("./blockquote"));
const format_1 = __importDefault(require("./format"));
const fullscreen_1 = __importDefault(require("./fullscreen"));
const align_1 = __importDefault(require("./align"));
const table_1 = __importDefault(require("./table"));
const hr_1 = __importDefault(require("./hr"));
const source_1 = __importDefault(require("./source"));
const text_1 = __importDefault(require("./text"));
const undo_1 = __importDefault(require("./undo"));
const redo_1 = __importDefault(require("./redo"));
const indent_1 = __importDefault(require("./indent"));
const remove_format_1 = __importDefault(require("./remove_format"));
const link_1 = __importDefault(require("./link"));
const remove_link_1 = __importDefault(require("./remove_link"));
const list_1 = __importDefault(require("./list"));
const seperator_1 = __importDefault(require("./seperator"));
const nextline_1 = __importDefault(require("./nextline"));
const spacer_1 = __importDefault(require("./spacer"));
const subeditor_1 = __importDefault(require("../subeditor"));
function ToolbarPresets(editor) {
    return Object.assign({}, (0, undo_1.default)(editor), (0, redo_1.default)(editor), (0, color_1.default)(editor), (0, blockquote_1.default)(editor), (0, format_1.default)(editor), (0, fullscreen_1.default)(editor), (0, align_1.default)(editor), (0, table_1.default)(editor), (0, hr_1.default)(editor), (0, source_1.default)(editor), (0, text_1.default)(editor), (0, indent_1.default)(editor), (0, remove_format_1.default)(editor), (0, link_1.default)(editor), (0, remove_link_1.default)(editor), (0, list_1.default)(editor), (0, seperator_1.default)(editor), (0, nextline_1.default)(editor), (0, spacer_1.default)(editor));
}
exports.ToolbarPresets = ToolbarPresets;
class Toolbar {
    constructor(editor) {
        this.refToolbar = document.createElement("div");
        this.refShadow = document.createElement("div");
        this.refTips = document.createElement("div");
        this.pluginItemList = {};
        this.renderButton = (item) => {
            if (!item.command || !item.svg)
                return "";
            return '<span class="se-button se-ToolbarItem" data-command="' + item.command + '" data-tips="' + this.editor.ln(item.tips || "") + '"><span class="se-icon">' + item.svg + '</span></span>';
        };
        this.hideDropdownListener = (e) => {
            if (!this.refToolbar) {
                document.removeEventListener('click', this.hideDropdownListener);
                return;
            }
            let target = e.target;
            let isDropdownContent = false;
            do {
                if (target && target.classList.contains('se-dropdown-content')) {
                    isDropdownContent = true;
                    break;
                }
            } while (target = target.parentElement);
            if (!isDropdownContent && !this.refToolbar.querySelector(".se-ToolbarItem.is-active .se-dropdown-content .se-button.close-dropdown")) {
                //not in dropdown, and dropdown content doesn't have close button
                this.hideDropdown();
            }
        };
        this.editor = editor;
        this.prepareUI();
        this.registerEvents();
    }
    prepareUI() {
        var _a;
        (_a = this.editor.refEditor.querySelector(".SubEditorToolbar")) === null || _a === void 0 ? void 0 : _a.remove();
        this.refToolbar = this.editor.refEditor.insertBefore(document.createElement("div"), this.editor.refContent.parentElement);
        this.refToolbar.classList.add("SubEditorToolbar");
        this.refShadow.classList.add("se-Shadow");
        this.refToolbar.appendChild(this.refShadow);
        this.refTips.classList.add("se-tips");
        this.refToolbar.appendChild(this.refTips);
    }
    registerPluginItem(item) {
        const ToolbarItem = typeof item === "function" ? item(this.editor) : item;
        this.pluginItemList = Object.assign(this.pluginItemList, ToolbarItem);
    }
    addItem(item) {
        let barItem = undefined;
        const presets = ToolbarPresets(this.editor);
        if (typeof item === "string") {
            if (typeof Toolbar.presetItemList[item] === "function")
                barItem = Toolbar.presetItemList[item](this.editor);
            else if (typeof this.pluginItemList[item] !== "undefined")
                barItem = this.pluginItemList[item];
            else if (typeof presets[item] !== "undefined")
                barItem = presets[item];
            else
                return;
        }
        else if (typeof item === "function")
            barItem = item(this.editor);
        if (!barItem || typeof barItem === "string" || typeof barItem.command === "undefined")
            return;
        let div = document.createElement("div");
        if (!barItem.dropdowncontent) {
            div.innerHTML = this.renderButton(barItem);
        }
        else if (barItem.dropdowncontent) {
            div.innerHTML = barItem.dropdowncontent;
        }
        const barItemEl = div.firstChild;
        this.refToolbar.insertBefore(barItemEl, this.refShadow);
        if (barItem.onRender) {
            barItem.onRender(this.editor, barItemEl);
        }
        else {
            barItemEl.addEventListener('click', (e) => {
                const cmd = barItemEl.getAttribute("data-command");
                this.editor.command(cmd, []);
            });
        }
        div.remove();
    }
    initEventTips(el) {
        el.addEventListener("mouseenter", (e) => {
            e.stopPropagation();
            const elTarget = e.target;
            const tips_str = this.editor.ln(elTarget.getAttribute("data-tips") || "");
            if (tips_str === "")
                return;
            this.refTips.style.display = "block";
            this.refTips.innerHTML = tips_str;
            const toolbarRect = this.refToolbar.getBoundingClientRect();
            let rect = elTarget.getBoundingClientRect();
            this.refTips.style.left = Math.max(0, rect.left - toolbarRect.left + elTarget.clientWidth / 2 - this.refTips.clientWidth / 2) + "px";
            this.refTips.style.top = rect.top - toolbarRect.top - this.refTips.clientHeight + "px";
            if (rect.top < rect.height) {
                this.refTips.style.top = rect.height + "px";
            }
        });
        el.addEventListener("mouseleave", (e) => {
            e.stopPropagation();
            this.refTips.style.display = "none";
            this.refTips.style.top = "";
        });
    }
    initItems(items) {
        items.forEach(item => this.addItem(item));
        //toolbar tips
        this.refToolbar.querySelectorAll("[data-tips]").forEach(el => this.initEventTips(el));
    }
    insertCloseButton(itemEl) {
        this.removeCloseButton(itemEl);
        this.editor.dom.appendString2Node('<button class="se-button close-dropdown"><span class="se-icon">' + subeditor_1.default.svgList['close'] + '</span></button>', itemEl.querySelector(".se-dropdown-content"));
        itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown").addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            this.hideDropdown();
            return false;
        });
    }
    removeCloseButton(itemEl) {
        const btn = itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown");
        if (btn)
            btn.remove();
    }
    registerEvents() {
        this.refToolbar.addEventListener('click', (e) => {
            const el = e.target;
            if (el.classList.contains("se-button") && el.parentElement.classList.contains("se-dropdown-trigger")) {
                e.preventDefault();
                e.stopPropagation();
                const menu = el.parentElement.parentElement;
                const isActive = menu.classList.contains("is-active");
                this.hideDropdown();
                if (isActive) {
                    menu.classList.remove("is-active");
                }
                else {
                    menu.classList.add("is-active");
                    this.adjustContentPosition(menu.querySelector(".se-dropdown-content"));
                    menu.querySelectorAll(".se-dropdown-content [data-tips]").forEach(e => this.initEventTips(e));
                }
                return false;
            }
            return true;
        });
        //make sure to clean up when destroy
        if (typeof this.editor.docListener['click'] === "undefined") {
            this.editor.docListener['click'] = [];
        }
        this.editor.docListener['click'].push(this.hideDropdownListener);
        document.removeEventListener('click', this.hideDropdownListener);
        document.addEventListener('click', this.hideDropdownListener);
        this.editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
                    this.refToolbar.querySelectorAll("[data-command]").forEach(el => {
                        var _a;
                        const cmd = el.getAttribute('data-command') || "_";
                        if (cmd === "_")
                            return;
                        el.classList.remove('is-featured');
                        if (el.getAttribute('data-featureformat')) {
                            if (((_a = this.editor.feature) === null || _a === void 0 ? void 0 : _a.formatEL) === el.getAttribute('data-featureformat')) {
                                el.classList.add('is-featured');
                            }
                        }
                        else if (typeof this.editor.feature[cmd] !== "undefined" && this.editor.feature[cmd]) {
                            el.classList.add('is-featured');
                        }
                    });
                } }]);
    }
    adjustContentPosition(ddcontent) {
        //adjust x position
        ddcontent.removeAttribute("style");
        setTimeout(() => {
            const rect = ddcontent.getBoundingClientRect();
            if (!rect.width)
                return;
            let xNew = rect.width / 2 - 18; //console.log("adjustContentPosition", xNew, rect.x, );
            if (rect.x - xNew < 0)
                xNew = rect.x;
            ddcontent.setAttribute("style", "transform:translateX(-" + xNew + "px)");
        }, 1);
    }
    hideDropdown() {
        this.refToolbar.querySelectorAll(".se-ToolbarItem.is-active").forEach(el => el.classList.remove("is-active"));
    }
    hasShadow() {
        return this.refToolbar.classList.contains("EnableShadow");
    }
    enableShadow(allowCmds) {
        this.disableShadow();
        this.refToolbar.classList.add("EnableShadow");
        this.refToolbar.querySelectorAll(".se-ToolbarItem").forEach(e => {
            let cmd = e.getAttribute("data-command") || "";
            let allow = allowCmds.indexOf(cmd) !== -1;
            if (!allow) {
                e.querySelectorAll("[data-command]").forEach(e2 => {
                    if (!allow && allowCmds.indexOf(e2.getAttribute("data-command") || "") !== -1) {
                        allow = true;
                    }
                });
            }
            if (allow) {
                e.classList.add("AboveShadow");
            }
        });
    }
    disableShadow() {
        this.refToolbar.classList.remove("EnableShadow");
        this.refToolbar.querySelectorAll(".AboveShadow").forEach(e => e.classList.remove("AboveShadow"));
    }
}
exports.default = Toolbar;
Toolbar.presetItemList = {};
//# sourceMappingURL=toolbar.js.map