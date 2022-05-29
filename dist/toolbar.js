"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("./subeditor"));
class Toolbar {
    constructor(editor) {
        this.refToolbar = document.createElement("div");
        this.refShadow = document.createElement("div");
        this.refTips = document.createElement("div");
        //toolbarItem defined in plugins:
        this.pluginItemList = {};
        // array holding rendered items by various orders
        this.preparedItemList = {};
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
    prepareItemList() {
        this.preparedItemList = {};
        //render all functions into toolbar:
        Object.keys(subeditor_1.default.toolbarItemList).forEach((key) => {
            if (typeof subeditor_1.default.toolbarItemList[key] === "function") {
                this.preparedItemList = Object.assign(this.preparedItemList, subeditor_1.default.toolbarItemList[key](this.editor));
            }
            else {
                this.preparedItemList[key] = subeditor_1.default.toolbarItemList[key];
            }
        });
        Object.keys(this.pluginItemList).forEach((key) => {
            this.preparedItemList[key] = this.pluginItemList[key];
        });
        Object.keys(Toolbar.presetItemList).forEach((key) => {
            if (typeof Toolbar.presetItemList[key] === "function") {
                this.preparedItemList = Object.assign(this.preparedItemList, Toolbar.presetItemList[key](this.editor));
            }
            else {
                this.preparedItemList[key] = Toolbar.presetItemList[key];
            }
        });
    }
    addItem(item) {
        let barItem = undefined;
        if (typeof item === "string") {
            if (typeof this.preparedItemList[item] !== "undefined")
                barItem = this.preparedItemList[item];
            /*if(typeof Toolbar.presetItemList[item] === "function") barItem = Toolbar.presetItemList[item](this.editor) as ToolbarItem;
            else if(typeof this.pluginItemList[item] !== "undefined") barItem = this.pluginItemList[item];
            else if(typeof SubEditor.toolbarItemList[item] !== "undefined") {
              const defaultItem = SubEditor.toolbarItemList[item](this.editor);
              if(typeof defaultItem[item] !== "undefined") barItem = defaultItem[item];
              else return;//plugin function failed to return the correct format
            }*/
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
        this.prepareItemList();
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
            ddcontent.parentElement.setAttribute("style", "transform:translateX(-" + xNew + "px)");
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
//toolbarItem defined by user using SubEditor.presetToolbarItem:
Toolbar.presetItemList = {};
//# sourceMappingURL=toolbar.js.map