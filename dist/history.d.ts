import { SelectionSlimState } from '@ancientec/selection-serializer';
export interface HistoryEntry {
    delta: any[];
    selection: SelectionSlimState;
}
export interface ChangeEntry {
    key: number;
    change: HistoryEntry;
    content: string;
}
export declare class History {
    entryIndex: number;
    entryList: HistoryEntry[];
    entryChangeList: HistoryEntry[];
    lastContentStr: string | null;
    lastContentDom: HTMLElement;
    static HistoryInstanceCounter: number;
    id: number;
    private contentContainer;
    counter: number;
    constructor(contentContainer: HTMLElement);
    private KeyCounter;
    /**
     * move one entry up
     * @returns ChangeEntry | null
     */
    Undo(): ChangeEntry | null;
    Redo(): ChangeEntry | null;
    Next(): ChangeEntry | null;
}
export default History;
