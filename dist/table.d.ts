declare function colSpan(node: HTMLElement): number;
declare function rowSpan(node: HTMLElement): number;
declare function rowCol(tr: HTMLElement): number;
declare function col(table: HTMLElement): number;
declare function cellList(table: HTMLElement, withHeader?: boolean, useNull?: boolean): (HTMLElement | null)[][];
declare const _default: {
    cellList: typeof cellList;
    col: typeof col;
    rowCol: typeof rowCol;
    colSpan: typeof colSpan;
    rowSpan: typeof rowSpan;
};
export default _default;
