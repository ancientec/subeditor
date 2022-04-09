function colSpan(node : HTMLElement) {
    return parseInt(node.getAttribute("colspan") || "1", 10);
    //return (node as HTMLTableCellElement).colSpan;
}
function rowSpan(node : HTMLElement) {
    return parseInt(node.getAttribute("rowspan") || "1", 10);
    //return (node as HTMLTableCellElement).rowSpan;
}
function rowCol(tr : HTMLElement){
    let col = 0;
    Array.from(tr.childNodes).forEach(td => col += parseInt((td as HTMLElement).getAttribute("colspan") || "1", 10));
    return col;
};
function col(table : HTMLElement){
    let tableC = 0;
    Array.from(table.querySelectorAll("tr")).forEach( tr => {
        let col = rowCol(tr);
        if(col > tableC) tableC = col;
    });
    return tableC;
};
function cellList(table : HTMLElement, withHeader = true, useNull = false){
    const tableCols = col(table);
    const trs = Array.from(withHeader ? table.querySelectorAll("tr") : table.querySelectorAll("tbody tr"));
    const allNodeList : ((HTMLElement | null)[])[] = [];
    trs.forEach((tr, row) => {
        if(typeof allNodeList[row] === "undefined") allNodeList[row] = [];
        const children = Array.from(tr.childNodes);
        let i = 0;
        while(i < tableCols) {
            
            for(let x = 0, t = children.length;x < t;x++) {
                while(typeof allNodeList[row][i] !== "undefined") {
                    i++;
                }
                const c = children[x] as HTMLTableCellElement;
                let cSpan = c.colSpan, rSpan = c.rowSpan;
                for(let rowy = 0; rowy < rSpan; rowy++) {
                    for(let colx = 0; colx < cSpan; colx++) {
                        if(typeof allNodeList[row+rowy] === "undefined") allNodeList[row+rowy] = [];
                        allNodeList[row + rowy][i + colx] = useNull && rowy > 0 ? null : c;
                    }
                }
                i += cSpan;
                
            }
        }
    });
    return allNodeList;
}

export default {
    cellList : cellList,
    col : col,
    rowCol: rowCol,
    colSpan : colSpan,
    rowSpan : rowSpan,
}