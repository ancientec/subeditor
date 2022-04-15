import History, { ChangeEntry } from "./history";
import Event, { SubEditorEvent } from './event';
import { Feature } from './feature';
import Toolbar, { ToolbarItem } from "./toolbar/toolbar";
import { SelectionSlimState } from '@ancientec/selection-serializer';
export { ChangeEntry, SubEditorEvent, ToolbarItem, SelectionSlimState };
export interface SubEditorHTMLElement extends HTMLElement {
    _SubEditor?: SubEditor;
}
export interface SubEditorOption {
    width?: number;
    height?: number;
    svgList?: {
        [key: string]: string;
    };
    css?: string;
    skipCss?: boolean;
    langList?: {
        [key: string]: {
            [key: string]: string;
        };
    };
    cfgList?: {
        [key: string]: any;
    };
    lang?: string;
    ln?: Function;
    value?: string;
    autoGrow?: boolean;
    pluginList?: (SubEditorEvent[] | string)[];
    toolbarList?: (ToolbarItem | string)[];
    onChange: Function;
    instance?: Function;
}
export default class SubEditor {
    refEl: SubEditorHTMLElement;
    refEditor: HTMLDivElement;
    refTextarea: HTMLTextAreaElement;
    refContent: HTMLDivElement;
    refToolbar: HTMLDivElement;
    refFooter: HTMLDivElement;
    static version: "0.5.5";
    static svgList: {
        [key: string]: string;
    };
    static langList: {
        [key: string]: {
            [key: string]: string;
        };
    };
    static presetPluginList: {
        [key: string]: SubEditorEvent[];
    };
    cfgList: {
        [key: string]: any;
    };
    cachedList: {
        [key: string]: any;
    };
    private lang;
    private autoGrow;
    private height;
    private lnFunc?;
    private cacheTextareaStyle;
    private static lastCssString;
    static presetCssString: string;
    static pluginCSS: {
        [key: string]: string;
    };
    history: History;
    private debounceChange;
    private onChange;
    event: Event;
    selection?: SelectionSlimState;
    toolbar?: Toolbar;
    feature: Feature | null;
    dom: {
        domFragment: (html: string, returnHTML?: boolean) => any;
        appendString2Node: (html: string, target: Node | HTMLElement) => void;
        rangeCompareNode: (range: any, node: any) => 1 | -1 | 0 | 2 | 3 | 4;
        rangeContainsNode: (range: any, node: any, includePartial?: boolean) => boolean;
        selectDeepNodesInRange: (range: Range) => import("./dom").RangeNode[];
        nodeReplaceWith: (node: any, replaceNodes: any[]) => void;
        nodeTextMerge: (nodes: Node[]) => void;
        nodeTextMergeAll: (parent: HTMLElement) => void;
        wrapNode: (node: Node, placeholder: HTMLElement) => void;
        unwrapNode: (node: Node, container?: HTMLElement | undefined) => void;
        unwrapNodes: (nodes: any[], tag: string | string[], container: any, range: any) => void;
        mergeTags: (container: HTMLElement, tag: string) => void;
        nodeAttrStyle: (el: HTMLElement, tag?: string | undefined) => any;
        nodeReplaceAttrStyle: (el: HTMLElement, tag: string, value: string) => void;
        nodeChildRemoveAttrStyle: (el: HTMLElement, tag: string, value: string) => void;
        nodeIsVoid: (n: Node | ChildNode) => boolean;
        nodeIsText: (n: Node | ChildNode) => boolean;
        nodeIsTextOrVoid: (n: Node | ChildNode) => boolean;
        selectNodesBetweenRange: (range: Range) => Node[];
        nodeIsTextInlineOrVoid: (n: Node | ChildNode) => boolean;
        nodesAreTextOrVoid: (nodes: (Node | ChildNode)[]) => boolean;
        getSelection: () => Selection | null;
        getRange: () => false | Range;
        getRangeFocus: (container: HTMLElement) => false | Range;
        resetSelection: (node: any, startOffset?: number, endOffset?: number) => Selection | undefined;
        nodeIsInlineFormat: (n: Node | ChildNode) => boolean;
        nodesAreTextInlineOrVoid: (nodes: (Node | ChildNode)[]) => boolean;
        nodeNext: (n: any, container: any) => any;
        nodeChildFirst: (n: Node) => Node;
        nodeChildLast: (n: Node) => Node;
        nodePrev: (n: any, container: any) => any;
        nodeNameCompare: (n: any, name: string | string[]) => boolean;
        nodeNameCompareIndex: (n: any, name: string | string[]) => number;
        nodeParentUntil: (node: Node, until: HTMLElement) => Node[];
        nodeParent: (n: Node, tag?: any, container?: HTMLElement | undefined) => Node | null;
        nodeChildInsertBefore: (target: Node, beforeNode: Node, node: Node) => void;
        nodeChildInsertInto: (target: Node, node: Node) => void;
        nodePosition: (n: any) => number;
        nodesInsertAfter: (nodes: Node[], dest: Node) => void;
        setCaretAt: (node: Node, startOffset?: number) => void;
        nodeBreak: (container: Node, midNode: Node) => void;
        table: {
            cellList: (table: HTMLElement, withHeader?: boolean, useNull?: boolean) => (HTMLElement | null)[][];
            col: (table: HTMLElement) => number;
            rowCol: (tr: HTMLElement) => number;
            colSpan: (node: HTMLElement) => number;
            rowSpan: (node: HTMLElement) => number;
        };
    };
    docListener: {
        [key: string]: any[];
    };
    callbackList: {
        [key: string]: Function;
    };
    constructor(el: SubEditorHTMLElement, opts: SubEditorOption);
    /**
     *
     * @returns html string value
     */
    value(): string;
    ln(key: string): any;
    registerCallback(key: string, fn: Function): void;
    getCallback(key: string, args?: any): any;
    static presetToolbarItem(name: string, item: Function): void;
    static presetPlugin(pluginName: string, plugin: SubEditorEvent[]): void;
    initPlugins(plugins: (SubEditorEvent[] | string)[]): void;
    handleFeature(): void;
    private initEvents;
    private resetSelection;
    restoreSelection(sel?: SelectionSlimState | undefined): void;
    getSelectionRange(): {
        selection: Selection | null;
        range: Range;
    };
    setCache(key: string, value: any): void;
    getCache(key: string): any;
    setCfg(key: string, value: any): void;
    getCfg(key: string): any;
    command(cmd: string, value?: any[]): void;
    disableFooter(): void;
    enableFooter(height?: number): void;
    setAutoGrow(grow: boolean): void;
    private growFn;
    private fixStylePosition;
    private initToolbarItems;
    destroy(): void;
    static presetLang(langList: {
        [key: string]: {
            [key: string]: string;
        };
    }): void;
    private static initLang;
    static presetSvg(_svg: {
        [key: string]: string;
    }): void;
    private static initSvg;
    static presetCss(cssString?: string): void;
    static lastCss(): string;
    private static initCss;
    changeValue(str: string): void;
    triggerChange(): void;
    handleChange(changed: ChangeEntry | null): void;
}
