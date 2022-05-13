/*
* https://github.com/ancientec/subeditor
*
* Ancientec Co., Ltd. 
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

'use strict';
import debounce from "./debounce";
import History, { ChangeEntry } from "./history";
import Event,{SubEditorEvent} from './event';
import parseFeature, { Feature } from './feature';
import dom from './dom';
import Toolbar, { ToolbarItem } from "./toolbar";
import selection_serializer, { SelectionSlimState } from '@ancientec/selection-serializer';

export {ChangeEntry, SubEditorEvent, ToolbarItem, SelectionSlimState};

export interface SubEditorHTMLElement extends HTMLElement {
    _SubEditor? : SubEditor;
}

export interface SubEditorOption {
    width? : number;
    height? : number;
    svgList? : {[key: string]: string};
    css? : string;
    skipCss? : boolean;
    //list of all languages in format: {en : {"Heading 1" : "Heading 1"}}
    langList? : {[key: string]:{[key: string]: string}};
    cfgList? : {[key: string]: any};
    
    //current language
    lang? : string;
    //custom language function:
    ln? : Function;
    value? : string;
    autoGrow? : boolean;
    pluginList?: (SubEditorEvent[] | string)[];
    toolbarList? : (ToolbarItem | string)[];
    onChange : Function;
    instance? : Function;
}


export default class SubEditor {
    public refEl : SubEditorHTMLElement;
    public refEditor!: HTMLDivElement;
    public refTextarea! : HTMLTextAreaElement;
    public refContent! : HTMLDivElement;
    public refToolbar! : HTMLDivElement;
    public refFooter! : HTMLDivElement;

    public static version : string = "0.5.5";

    //default and official values:
    public static cssString : string = "";
    public static svgList : {[key: string]: string} = {};
    public static langList : {[key: string]:{[key: string]: string}} = {};
    public static pluginList  : {[key: string]: SubEditorEvent[]} = {};
    public static toolbarItemList : {[key: string]: Function} = {};

    //user define:
    public static presetPluginList : {[key: string]: SubEditorEvent[]} = {};
    public static presetCssString : string = "";

    public cfgList : {[key: string]: any} = {};
    //to store any temp variables
    public cachedList : {[key: string] : any} = {};
    private lang : string = "en";
    private autoGrow : boolean = false;
    private height : number = 0;
    private lnFunc? : Function;
    private cacheTextareaStyle = "";
    //the last generated css string after init
    private static lastCssString = "";
    
    public static pluginCSS : {[key: string]: string} = {};
    public history : History;
    private debounceChange: () => void = () => {};
    //private debounceFeature: () => void = () => {};
    private onChange : Function = () => {};
    //private dobounceFeatureSelectionFocusNode : HTMLElement | null = null;

    public event : Event = new Event(this);
    public selection? : SelectionSlimState;
    public toolbar? : Toolbar;
    
    public feature : Feature | null = null;
    public dom  = dom;

    public docListener : {[key: string]:any[]} = {};
    public callbackList : {[key: string]:Function} = {}; 

    constructor(el : SubEditorHTMLElement, opts : SubEditorOption) {

        SubEditor.initSvg(opts.svgList || {});
        SubEditor.initLang(opts.langList || {});
        if(typeof el._SubEditor !== "undefined") {
            el._SubEditor.destroy();
        }

        //set current language:
        if(opts.lang) this.lang = opts.lang;
        if(opts.ln) this.lnFunc = opts.ln;
        if(opts.cfgList) this.cfgList = opts.cfgList;
        if(opts.instance) opts.instance(this);

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
        

        if( el.tagName === 'TEXTAREA' ) {
            this.refTextarea = el as HTMLTextAreaElement;
            this.refTextarea.parentNode?.insertBefore(this.refEditor, this.refTextarea);
        } else {
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
        this.refEditor.style.width = (opts.width ? opts.width : this.refTextarea.clientWidth)+"px";
        this.height =  (opts.height ? opts.height : this.refTextarea.clientHeight);
        this.refEditor.style.height = this.height+"px";

        //hide textarea:
        this.refTextarea.style.display = "none";
        this.refTextarea.classList.add("SubEditorTextarea");

        if(opts.value) {
            this.refTextarea.value = opts.value;
        }
        this.refContent.innerHTML = this.refTextarea.value;
        this.refContent.setAttribute("contenteditable", "true");

        this.history = new History(this.refContent);
        //init first history entry
        this.history.Next();

        if(opts.onChange) {
            this.onChange = opts.onChange;
        }
        this.toolbar = new Toolbar(this);
        this.refToolbar = this.refEditor.querySelector(".SubEditorToolbar") as HTMLDivElement;
        this.initPlugins(opts.pluginList || []);
        this.initEvents();
        this.event.trigger("registerCss","", []);
        SubEditor.initCss(opts.css || "", opts.skipCss === true);
        this.event.trigger("registerSvg","", []);
        this.event.trigger("registerLanguage","", []);
        this.event.trigger("registerToolbarItem","", []);
        this.initToolbarItems(opts.toolbarList || []);
        if(typeof opts.autoGrow !== "undefined") this.setAutoGrow(opts.autoGrow);
        this.fixStylePosition();
        this.event.trigger("registerUI","", []);

    }
    /**
     * 
     * @returns html string value
     */
    public value() : string {
        const source = this.refEditor.querySelector(".SubEditorSource") as HTMLTextAreaElement;
        if(source) {
            return source.value;
        }
        return this.refContent.style.display !== "none" ? this.refContent.innerHTML : this.refTextarea.value;
    }
    public ln(key : string, vars : (string | number)[] | undefined = undefined) {
        if(this.lnFunc) return this.lnFunc(key) || key;
        let translated = (typeof SubEditor.langList[this.lang] !== "undefined" && typeof SubEditor.langList[this.lang][key] !== "undefined" ? SubEditor.langList[this.lang][key] : key);
        
        if(vars && vars.length) {
            vars.forEach((v, idx) => {
                translated = translated.replace(new RegExp("{%"+(idx+1)+"}",'g'),v.toString());
            });
        }
        return translated;
    }
    public registerCallback(key : string, fn : Function) {
        this.callbackList[key] = fn;
    }
    public getCallback(key : string, args : any = undefined) {
        if(typeof this.callbackList[key] === "undefined") return;
        
        if (typeof this.callbackList[key] === "function") return this.callbackList[key].apply(this, args);
        else return this.callbackList[key];
    }
    public static presetToolbarItem( name : string, item : Function) {
        Toolbar.presetItemList[name] = item;
    }
    public static presetPlugin(pluginName : string, plugin : SubEditorEvent[]) {
        SubEditor.presetPluginList[pluginName] = plugin;
    }
    public initPlugins(plugins : (SubEditorEvent[] | string)[]) {
        
        plugins.forEach(plugin => {
            
            if(typeof plugin === "string") {
                if(typeof SubEditor.presetPluginList[plugin] !== "undefined" ) {
                    this.event.register(SubEditor.presetPluginList[plugin]);
                } else if(typeof SubEditor.pluginList[plugin] !== "undefined" ) {
                    this.event.register(SubEditor.pluginList[plugin]);
                }
            } else if(typeof plugin === "object" && plugin.length){
                this.event.register(plugin);
            }
            
        })
    }
    public handleFeature() {
        const sel = dom.getSelection();
        if(!sel || !sel?.focusNode || !this.refContent.contains(sel.focusNode)) return;
        //const focusNode = sel.focusNode.nodeType === 3 ? sel.focusNode.parentElement! : sel.focusNode as HTMLElement;
        //if(this.dobounceFeatureSelectionFocusNode === focusNode) return;
        const feature = parseFeature(sel.focusNode, this.refContent);
        if(this.feature === feature) return;
        this.feature = feature;
        //this.dobounceFeatureSelectionFocusNode = feature.node as HTMLElement;
        this.event.trigger("onFeatureChange",this.feature.nodeName, [this, this.feature]);
    }
    private initEvents() {
        this.debounceChange = debounce(() => {
            this.handleChange(this.history.Next());
        }, 300);
        this.refContent.addEventListener('keyup', (e : KeyboardEvent) => {
            this.event.trigger("onKeyUp",(e.target as HTMLElement).tagName, [this, e]);
            this.debounceChange();
            
        });

        this.refContent.addEventListener('keydown', (e) => {
            this.event.trigger("onKeyDown",(e.target as HTMLElement).tagName, [this, e]);
        });

        this.refContent.addEventListener('click', (e) => {
            this.event.trigger("onClick",(e.target as HTMLElement).tagName, [this, e]);
        });

        this.refContent.addEventListener('mouseup', (e) => {
            this.event.trigger("onMouseUp",(e.target as HTMLElement).tagName, [this, e]);
        });

        this.refContent.addEventListener('blur', (e) => {
            this.event.trigger("onBlur",(e.target as HTMLElement).tagName, [this, e]);
        });

        this.refContent.addEventListener('paste', (e) => {
            this.event.trigger("onPaste",(e.target as HTMLElement).tagName, [this, e]);
        });
        this.docListener['selectionchange'] = [() => {
            let x = dom.getSelection()!.focusNode;
            let isIn = x === this.refContent;
            
            if (!isIn && x && x !== this.refContent) {
                while(x && x.parentElement) {
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
            const sel = selection_serializer.saveSlim(this.refContent);
            if(JSON.stringify(this.selection) !== JSON.stringify(sel)) {
                this.selection = sel;
                this.handleFeature();
                this.event.trigger("onSelectionChange", "", [this, this.selection]);
            }
        }];
        document.addEventListener('selectionchange', this.docListener['selectionchange'][0]);
    }
    private resetSelection() {
        this.selection = selection_serializer.saveSlim(this.refContent);
    }
    public restoreSelection(sel : SelectionSlimState | undefined = undefined) {
        selection_serializer.restore(this.refContent,sel ? sel : this.selection!);
    }
    public getSelectionRange() {
        //safe check for selection, range
        if(!this.selection) {
            this.resetSelection();
        }
        let selection = dom.getSelection();
        const range = selection!.getRangeAt(0);
        return {selection : selection, range : range.cloneRange()};
        
    }
    public setCache(key : string, value : any) {
        this.cachedList[key] = value;
    }
    public getCache(key : string) {
        return typeof this.cachedList[key] === "undefined" ? undefined : this.cachedList[key];
    }
    public setCfg(key : string, value : any) {
        this.cfgList[key] = value;
    }
    public getCfg(key : string) {
        let ln = this.ln(key);
        if(ln && ln !== key) return ln;
        return this.cfgList[key] || "";
    }
    public command(cmd : string, value : any[] = []) {
        if(!this.selection) {
            this.selection = selection_serializer.saveSlim(this.refContent);
        }
        selection_serializer.restore(this.refContent, this.selection);
        this.event.trigger("onCommand", cmd, [this, cmd, ...value]);
    }
    public disableFooter() {
        this.refFooter.style.display = "none";
        this.fixStylePosition();
    }
    public enableFooter(height: number = 15) {
        this.refFooter.style.display = "block";
        this.refFooter.style.height = height+"px";
        this.fixStylePosition();
    }
    public setAutoGrow(grow : boolean) {
        if(this.autoGrow === grow) return;
        this.autoGrow = grow;
        if(grow) {
            this.refEditor.classList.add("AutoGrow");
            this.refContent.addEventListener('input', this.growFn);
            this.refEditor.style.height = "auto";
            this.refContent.parentElement!.style.height = "auto";
        } else {
            this.refEditor.classList.remove("AutoGrow");
            this.refContent.removeEventListener('input',this.growFn);
            this.refEditor.style.height = this.height+"px";
        }
        this.fixStylePosition();
    }
    private growFn(ev : any) {
        
        (ev.target as HTMLDivElement).parentElement!.style.height =  (ev.target as HTMLDivElement).clientHeight+"px";
    }
    private fixStylePosition() {
        //fix padding
        //this.refContent.parentElement!.style.marginTop = this.refToolbar.clientHeight+"px";
        
        if(!this.autoGrow) { 
            this.refContent.parentElement!.style.height = (this.refEditor.clientHeight-this.refToolbar.clientHeight-this.refFooter.clientHeight)+"px";
        }
    }
    private initToolbarItems(toolbarItemList : (ToolbarItem | string)[]) {
        this.toolbar?.initItems(toolbarItemList);
    }
    public destroy() {
        if( this.refEl.nodeName === 'TEXTAREA' ) {
            this.refEl.setAttribute("style", this.cacheTextareaStyle);
            this.refEl.parentNode?.removeChild(this.refEditor);
            this.refEl.classList.remove("SubEditorTextarea");
        } else {
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
            })
        });
        this.refEl._SubEditor = undefined;
    }
    public static presetLang(langList : {[key: string]:{[key: string]: string}}) {
        Object.keys(langList).forEach(ln => {
            SubEditor.langList[ln] = Object.assign({}, SubEditor.langList[ln] || {}, langList[ln]);
        });
    }
    private static initLang(langList : {[key: string]:{[key: string]: string}}) {
        // handle new languages
        if(Object.keys(langList).length > 0) SubEditor.presetLang(langList);
    }
    public static presetSvg(_svg : {[key: string]: string}) {
        SubEditor.svgList = Object.assign(SubEditor.svgList, _svg);
    }
    private static initSvg(userSvgList : {[key: string]: string}){
        SubEditor.svgList = Object.assign({}, SubEditor.svgList || {}, userSvgList);
    }
    public static presetCss(cssString : string = "") {
        SubEditor.presetCssString = cssString;
    }
    public static lastCss() {
        return SubEditor.lastCssString;
    }
    private static initCss(cssString : string = "", skipCss : boolean = false) {
        let pluginCss = "";
        const SubEditorStyle = document.querySelector("#SubEditorStyle");
        if(skipCss && SubEditorStyle) return;

        Object.keys(SubEditor.pluginCSS).forEach(p => pluginCss += SubEditor.pluginCSS[p]);
        const styleStr = SubEditor.cssString + "\n" + pluginCss + "\n" + SubEditor.presetCssString + "\n" + cssString;
        SubEditor.lastCssString = styleStr;

        for(let i = 0; i < document.styleSheets.length; i++){
            if( document.styleSheets[i].title && document.styleSheets[i].title === "SubEditorStyle" ){
                //already found defined style sheets
                if(styleStr !== SubEditorStyle!.innerHTML) {
                    SubEditorStyle!.innerHTML = styleStr;
                }
                return;
            }
        }
        const style = window.document.createElement('style');
        style.title = 'SubEditorStyle';
        style.setAttribute('id','SubEditorStyle');
        style.innerHTML = styleStr;
		document.head.appendChild(style);
    }
    public changeValue(str : string) {
        if (this.refEditor) {
            this.refContent.innerHTML = str;
            this.resetSelection();
            this.handleFeature();
            this.handleChange(this.history.Next());
        }
    }
    public triggerChange() {
        if (this.refEditor) {
            this.handleFeature();
            this.handleChange(this.history.Next());
        }
    }
    public handleChange(changed : ChangeEntry | null) {
        this.event.trigger("onBeforeChange", "", [this, changed]);
        if(this.refTextarea.style.display === "none") {
            this.refTextarea.value = this.refContent.innerHTML;
        }
        if(changed && this.onChange) this.onChange(changed);
    }
}