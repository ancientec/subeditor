/*
* https://github.com/ancientec/subeditor
*
* Ancientec Co., Ltd.
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("./debounce"));
const history_1 = __importDefault(require("./history"));
const event_1 = __importDefault(require("./event"));
const feature_1 = __importDefault(require("./feature"));
const dom_1 = __importDefault(require("./dom"));
const toolbar_1 = __importDefault(require("./toolbar"));
const selection_serializer_1 = __importDefault(require("@ancientec/selection-serializer"));
class SubEditor {
    constructor(el, opts) {
        var _a;
        this.cfgList = {};
        //to store any temp variables
        this.cachedList = {};
        this.lang = "en";
        this.autoGrow = false;
        this.height = 0;
        this.cacheTextareaStyle = "";
        this.debounceChange = () => { };
        //private debounceFeature: () => void = () => {};
        this.onChange = () => { };
        //private dobounceFeatureSelectionFocusNode : HTMLElement | null = null;
        this.event = new event_1.default(this);
        this.feature = null;
        this.dom = dom_1.default;
        this.docListener = {};
        this.callbackList = {};
        SubEditor.initSvg(opts.svgList || {});
        SubEditor.initLang(opts.langList || {});
        if (typeof el._SubEditor !== "undefined") {
            el._SubEditor.destroy();
        }
        //set current language:
        if (opts.lang)
            this.lang = opts.lang;
        if (opts.ln)
            this.lnFunc = opts.ln;
        if (opts.cfgList)
            this.cfgList = opts.cfgList;
        if (opts.instance)
            opts.instance(this);
        //cache instance:
        this.refEl = el;
        this.refEl._SubEditor = this;
        //build html:
        this.refEditor = document.createElement("div");
        this.refContent = document.createElement("div");
        this.refFooter = document.createElement("div");
        const contentContainer = document.createElement("div");
        contentContainer.classList.add("SubEditorContentContainer");
        contentContainer.appendChild(this.refContent);
        this.refEditor.appendChild(contentContainer);
        this.refEditor.appendChild(this.refFooter);
        if (el.tagName === 'TEXTAREA') {
            this.refTextarea = el;
            (_a = this.refTextarea.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(this.refEditor, this.refTextarea);
        }
        else {
            this.refTextarea = document.createElement("textarea");
            el.appendChild(this.refEditor);
            el.appendChild(this.refTextarea);
        }
        //classes
        this.refEditor.classList.add("SubEditor");
        this.refContent.classList.add("SubEditorContent");
        this.refFooter.classList.add("SubEditorFooter");
        //cache style attribute
        this.cacheTextareaStyle = this.refTextarea.getAttribute("style") || "";
        //match width height position
        this.refEditor.style.width = (opts.width ? opts.width : this.refTextarea.clientWidth) + "px";
        this.height = (opts.height ? opts.height : this.refTextarea.clientHeight);
        this.refEditor.style.height = this.height + "px";
        //hide textarea:
        this.refTextarea.style.display = "none";
        this.refTextarea.classList.add("SubEditorTextarea");
        if (opts.value) {
            this.refTextarea.value = opts.value;
        }
        this.refContent.innerHTML = this.refTextarea.value;
        this.refContent.setAttribute("contenteditable", "true");
        this.history = new history_1.default(this.refContent);
        //init first history entry
        this.history.Next();
        if (opts.onChange) {
            this.onChange = opts.onChange;
        }
        this.toolbar = new toolbar_1.default(this);
        this.refToolbar = this.refEditor.querySelector(".SubEditorToolbar");
        this.initPlugins(opts.pluginList || []);
        this.initEvents();
        this.event.trigger("registerCss", "", []);
        SubEditor.initCss(opts.css || "", opts.skipCss === true);
        this.event.trigger("registerSvg", "", []);
        this.event.trigger("registerLanguage", "", []);
        this.event.trigger("registerToolbarItem", "", []);
        this.initToolbarItems(opts.toolbarList || []);
        if (typeof opts.autoGrow !== "undefined")
            this.setAutoGrow(opts.autoGrow);
        this.fixStylePosition();
        this.event.trigger("registerUI", "", []);
    }
    /**
     *
     * @returns html string value
     */
    value() {
        const source = this.refEditor.querySelector(".SubEditorSource");
        if (source) {
            return source.value;
        }
        return this.refContent.style.display !== "none" ? this.refContent.innerHTML : this.refTextarea.value;
    }
    ln(key, vars = undefined) {
        if (this.lnFunc)
            return this.lnFunc(key) || key;
        let translated = (typeof SubEditor.langList[this.lang] !== "undefined" && typeof SubEditor.langList[this.lang][key] !== "undefined" ? SubEditor.langList[this.lang][key] : key);
        if (vars && vars.length) {
            vars.forEach((v, idx) => {
                translated = translated.replace(new RegExp("{%" + (idx + 1) + "}", 'g'), v.toString());
            });
        }
        return translated;
    }
    registerCallback(key, fn) {
        this.callbackList[key] = fn;
    }
    getCallback(key, args = undefined) {
        if (typeof this.callbackList[key] === "undefined")
            return;
        if (typeof this.callbackList[key] === "function")
            return this.callbackList[key].apply(this, args);
        else
            return this.callbackList[key];
    }
    static presetToolbarItem(name, item) {
        toolbar_1.default.presetItemList[name] = item;
    }
    static presetPlugin(pluginName, plugin) {
        SubEditor.presetPluginList[pluginName] = plugin;
    }
    initPlugins(plugins) {
        plugins.forEach(plugin => {
            if (typeof plugin === "string") {
                if (typeof SubEditor.presetPluginList[plugin] !== "undefined") {
                    this.event.register(SubEditor.presetPluginList[plugin]);
                }
                else if (typeof SubEditor.pluginList[plugin] !== "undefined") {
                    this.event.register(SubEditor.pluginList[plugin]);
                }
            }
            else if (typeof plugin === "object" && plugin.length) {
                this.event.register(plugin);
            }
        });
    }
    handleFeature() {
        const sel = dom_1.default.getSelection();
        if (!sel || !(sel === null || sel === void 0 ? void 0 : sel.focusNode) || !this.refContent.contains(sel.focusNode))
            return;
        //const focusNode = sel.focusNode.nodeType === 3 ? sel.focusNode.parentElement! : sel.focusNode as HTMLElement;
        //if(this.dobounceFeatureSelectionFocusNode === focusNode) return;
        const feature = (0, feature_1.default)(sel.focusNode, this.refContent);
        if (this.feature === feature)
            return;
        this.feature = feature;
        //this.dobounceFeatureSelectionFocusNode = feature.node as HTMLElement;
        this.event.trigger("onFeatureChange", this.feature.nodeName, [this, this.feature]);
    }
    initEvents() {
        this.debounceChange = (0, debounce_1.default)(() => {
            this.handleChange(this.history.Next());
        }, 300);
        this.refContent.addEventListener('keyup', (e) => {
            this.event.trigger("onKeyUp", e.target.tagName, [this, e]);
            this.debounceChange();
        });
        this.refContent.addEventListener('keydown', (e) => {
            this.event.trigger("onKeyDown", e.target.tagName, [this, e]);
        });
        this.refContent.addEventListener('click', (e) => {
            this.event.trigger("onClick", e.target.tagName, [this, e]);
        });
        this.refContent.addEventListener('mouseup', (e) => {
            this.event.trigger("onMouseUp", e.target.tagName, [this, e]);
        });
        this.refContent.addEventListener('blur', (e) => {
            this.event.trigger("onBlur", e.target.tagName, [this, e]);
        });
        this.refContent.addEventListener('paste', (e) => {
            this.event.trigger("onPaste", e.target.tagName, [this, e]);
        });
        this.docListener['selectionchange'] = [() => {
                let x = dom_1.default.getSelection().focusNode;
                let isIn = x === this.refContent;
                if (!isIn && x && x !== this.refContent) {
                    while (x && x.parentElement) {
                        if (x.parentNode === this.refContent) {
                            isIn = true;
                            break;
                        }
                        x = x.parentElement;
                    }
                }
                if (!isIn) {
                    this.selection = undefined;
                    return;
                }
                const sel = selection_serializer_1.default.saveSlim(this.refContent);
                if (JSON.stringify(this.selection) !== JSON.stringify(sel)) {
                    this.selection = sel;
                    this.handleFeature();
                    this.event.trigger("onSelectionChange", "", [this, this.selection]);
                }
            }];
        document.addEventListener('selectionchange', this.docListener['selectionchange'][0]);
    }
    resetSelection() {
        this.selection = selection_serializer_1.default.saveSlim(this.refContent);
    }
    restoreSelection(sel = undefined) {
        selection_serializer_1.default.restore(this.refContent, sel ? sel : this.selection);
    }
    getSelectionRange() {
        //safe check for selection, range
        if (!this.selection) {
            this.resetSelection();
        }
        let selection = dom_1.default.getSelection();
        const range = selection.getRangeAt(0);
        return { selection: selection, range: range.cloneRange() };
    }
    setCache(key, value) {
        this.cachedList[key] = value;
    }
    getCache(key) {
        return typeof this.cachedList[key] === "undefined" ? undefined : this.cachedList[key];
    }
    setCfg(key, value) {
        this.cfgList[key] = value;
    }
    getCfg(key) {
        let ln = this.ln(key);
        if (ln && ln !== key)
            return ln;
        return this.cfgList[key] || "";
    }
    command(cmd, value = []) {
        if (!this.selection) {
            this.selection = selection_serializer_1.default.saveSlim(this.refContent);
        }
        selection_serializer_1.default.restore(this.refContent, this.selection);
        this.event.trigger("onCommand", cmd, [this, cmd, ...value]);
    }
    disableFooter() {
        this.refFooter.style.display = "none";
        this.fixStylePosition();
    }
    enableFooter(height = 15) {
        this.refFooter.style.display = "block";
        this.refFooter.style.height = height + "px";
        this.fixStylePosition();
    }
    setAutoGrow(grow) {
        if (this.autoGrow === grow)
            return;
        this.autoGrow = grow;
        if (grow) {
            this.refEditor.classList.add("AutoGrow");
            this.refContent.addEventListener('input', this.growFn);
            this.refEditor.style.height = "auto";
            this.refContent.parentElement.style.height = "auto";
        }
        else {
            this.refEditor.classList.remove("AutoGrow");
            this.refContent.removeEventListener('input', this.growFn);
            this.refEditor.style.height = this.height + "px";
        }
        this.fixStylePosition();
    }
    growFn(ev) {
        ev.target.parentElement.style.height = ev.target.clientHeight + "px";
    }
    fixStylePosition() {
        //fix padding
        //this.refContent.parentElement!.style.marginTop = this.refToolbar.clientHeight+"px";
        if (!this.autoGrow) {
            this.refContent.parentElement.style.height = (this.refEditor.clientHeight - this.refToolbar.clientHeight - this.refFooter.clientHeight) + "px";
        }
    }
    initToolbarItems(toolbarItemList) {
        var _a;
        (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.initItems(toolbarItemList);
    }
    destroy() {
        var _a;
        if (this.refEl.nodeName === 'TEXTAREA') {
            this.refEl.setAttribute("style", this.cacheTextareaStyle);
            (_a = this.refEl.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.refEditor);
            this.refEl.classList.remove("SubEditorTextarea");
        }
        else {
            this.refEl.removeChild(this.refEditor);
            this.refEl.removeChild(this.refTextarea);
        }
        //reset variable
        this.cachedList = [];
        this.cfgList = [];
        this.selection = undefined;
        this.feature = null;
        Object.keys(this.docListener).forEach(ev => {
            this.docListener[ev].forEach(i => {
                document.removeEventListener(ev, i);
            });
        });
        this.refEl._SubEditor = undefined;
    }
    static presetLang(langList) {
        Object.keys(langList).forEach(ln => {
            SubEditor.langList[ln] = Object.assign({}, SubEditor.langList[ln] || {}, langList[ln]);
        });
    }
    static initLang(langList) {
        // handle new languages
        if (Object.keys(langList).length > 0)
            SubEditor.presetLang(langList);
    }
    static presetSvg(_svg) {
        SubEditor.svgList = Object.assign(SubEditor.svgList, _svg);
    }
    static initSvg(userSvgList) {
        SubEditor.svgList = Object.assign({}, SubEditor.svgList || {}, userSvgList);
    }
    static presetCss(cssString = "") {
        SubEditor.presetCssString = cssString;
    }
    static lastCss() {
        return SubEditor.lastCssString;
    }
    static initCss(cssString = "", skipCss = false) {
        let pluginCss = "";
        const SubEditorStyle = document.querySelector("#SubEditorStyle");
        if (skipCss && SubEditorStyle)
            return;
        Object.keys(SubEditor.pluginCSS).forEach(p => pluginCss += SubEditor.pluginCSS[p]);
        const styleStr = SubEditor.cssString + "\n" + pluginCss + "\n" + SubEditor.presetCssString + "\n" + cssString;
        SubEditor.lastCssString = styleStr;
        for (let i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].title && document.styleSheets[i].title === "SubEditorStyle") {
                //already found defined style sheets
                if (styleStr !== SubEditorStyle.innerHTML) {
                    SubEditorStyle.innerHTML = styleStr;
                }
                return;
            }
        }
        const style = window.document.createElement('style');
        style.title = 'SubEditorStyle';
        style.setAttribute('id', 'SubEditorStyle');
        style.innerHTML = styleStr;
        document.head.appendChild(style);
    }
    changeValue(str) {
        if (this.refEditor) {
            this.refContent.innerHTML = str;
            this.resetSelection();
            this.handleFeature();
            this.handleChange(this.history.Next());
        }
    }
    triggerChange() {
        if (this.refEditor) {
            this.handleFeature();
            this.handleChange(this.history.Next());
        }
    }
    handleChange(changed) {
        this.event.trigger("onBeforeChange", "", [this, changed]);
        if (this.refTextarea.style.display === "none") {
            this.refTextarea.value = this.refContent.innerHTML;
        }
        if (changed && this.onChange)
            this.onChange(changed);
    }
}
exports.default = SubEditor;
SubEditor.version = "0.6.0";
//default and official values:
SubEditor.cssString = "";
SubEditor.svgList = {};
SubEditor.langList = {};
SubEditor.pluginList = {};
SubEditor.toolbarItemList = {};
//user define:
SubEditor.presetPluginList = {};
SubEditor.presetCssString = "";
//the last generated css string after init
SubEditor.lastCssString = "";
SubEditor.pluginCSS = {};
//# sourceMappingURL=subeditor.js.map