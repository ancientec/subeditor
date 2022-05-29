import SubEditor from './subeditor';
export interface ToolbarItem {
    command: string;
    svg: string;
    dropdowncontent?: string;
    tips?: string;
    onRender?: Function;
}
export default class Toolbar {
    editor: SubEditor;
    refToolbar: HTMLDivElement;
    refShadow: HTMLDivElement;
    refTips: HTMLDivElement;
    static presetItemList: {
        [key: string]: Function;
    };
    pluginItemList: {
        [key: string]: ToolbarItem;
    };
    private preparedItemList;
    renderButton: (item: ToolbarItem) => string;
    constructor(editor: SubEditor);
    private prepareUI;
    registerPluginItem(item: Function | ToolbarItem): void;
    prepareItemList(): void;
    addItem(item: ToolbarItem | string | Function): void;
    private initEventTips;
    initItems(items: (ToolbarItem | string | Function)[]): void;
    hideDropdownListener: (e: Event) => void;
    insertCloseButton(itemEl: HTMLElement): void;
    removeCloseButton(itemEl: HTMLElement): void;
    private registerEvents;
    adjustContentPosition(ddcontent: HTMLElement): void;
    hideDropdown(): void;
    hasShadow(): boolean;
    enableShadow(allowCmds: string[]): void;
    disableShadow(): void;
}
