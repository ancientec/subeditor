import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";

function table_style(editor : SubEditor, value : string) {
    if(!editor.feature!.node) return;
    const node = editor.dom.nodeParent(editor.feature!.node, "TABLE") as HTMLElement;
    if(!node) return;
    node.setAttribute("style", value);
}
function cell_style(editor : SubEditor, value : string, applyTo : string) {
    if(!editor.feature!.node) return;
    const node = (editor.dom.nodeParent(editor.feature!.node, "TD") || editor.dom.nodeParent(editor.feature!.node, "TH")) as HTMLElement;
    if(!node) return;
    if(applyTo === "cell") {
        node.setAttribute("style", value);
    }
    else if(applyTo === "row") {

        Array.from(node.parentElement?.querySelectorAll(node.nodeName)!).forEach(n => n.setAttribute("style", value));
    }
    else if(applyTo === "all") {
        Array.from((editor.dom.nodeParent(node, "TBODY") as HTMLElement).querySelectorAll("TD")!).forEach(n => n.setAttribute("style", value));
    }
}
function table_function(editor : SubEditor, value : string){
    //console.log(editor,value);
    if(!editor.feature!.node) return;
    const node = (editor.dom.nodeParent(editor.feature!.node, "TD") || editor.dom.nodeParent(editor.feature!.node, "TH")) as HTMLElement;
    if(!node) return;
    const func : {[key: string]: Function} = {}, table = editor.dom.nodeParent(node, "TABLE") as HTMLElement, tbody = table.querySelector("TBODY")!, pos = editor.dom.nodePosition(node);
    const headerStyle = editor.getCfg("table.default.header.cell.style"),
    cellStyle = editor.getCfg("table.default.cell.style");

    const  tableCellList = editor.dom.table.cellList(table, true), tableUniqueCellList = editor.dom.table.cellList(table, true, true);
    const nodeIndexList = (tr : HTMLElement, useNull = true) => {
        const row = Array.from(table.querySelectorAll("TR")).indexOf(tr);
        return useNull ? tableUniqueCellList[row] : tableCellList[row];
    }
    const colPosition = (n : HTMLElement) => {
        return nodeIndexList(n.parentElement!).indexOf(n);
    }
    func['insert_header'] = () => {
        const tds = Array.from((editor.dom.nodeParent(node, "TR") as HTMLElement).querySelectorAll("td")), 
        thead = table.querySelector("thead");
        if(thead) return;

        let h = document.createElement("thead");
        h.appendChild(document.createElement("tr"));
        for (let i = 0, t = tds.length; i < t; i++){
            const th = document.createElement("th");
            if(tds[i].colSpan > 1) th.setAttribute("colspan", tds[i].colSpan.toString());
            if(headerStyle) th.setAttribute("style", headerStyle);
            th.appendChild(document.createElement("br"));
            h.childNodes[0].appendChild(th);
        }
        table.insertBefore(h, table.querySelector("tbody"));
    };

    func['delete_header'] = () => {
        const thead = editor.dom.nodeParent(node, "THEAD");
        if(thead) {
            editor.dom.setCaretAt(tbody.querySelectorAll("td")[pos], 0);            
            thead.parentNode!.removeChild(thead);
        }
    };
    func['delete_row'] = () => {
        
        const tr = editor.dom.nodeParent(node, "TR") as HTMLElement;
        if(!tr) return;
        const posTR = editor.dom.nodePosition(tr);
        let idx = 0, trs = Array.from(tr.parentElement!.childNodes);
        if(posTR + 1 < trs.length) idx = posTR + 1;
        else if(posTR > 0) idx = posTR -1;
        if(trs.length > 1 && trs[idx]) {
            editor.dom.setCaretAt(trs[idx].childNodes[Math.min(pos, trs[idx].childNodes.length-1)],0);
        }
        /**
         * 1) normal cell
         * 2) rowspan from above row
         * 3) rowspan from this row to below
         */
        let prevNode : HTMLElement | null = null;
        nodeIndexList(tr,false).forEach(td => {
            const rowSpan = editor.dom.table.rowSpan(td!);
            if(prevNode === td) return;
            prevNode = td;
            if(!tr.contains(td)) {
                //rowspan from above row
                if(1 < rowSpan) {
                    if(rowSpan === 2) td!.removeAttribute("rowspan");
                    else td!.setAttribute("rowspan", (rowSpan-1).toString());
                }
                return;
            }
            if(rowSpan > 1 && tr.nextElementSibling) {
                //rowspan from this row to below, move to next row
                const nodeList = nodeIndexList(tr.nextElementSibling as HTMLElement,false), nodePos = nodeList.indexOf(td);
                if(nodePos !== -1) {
                    const beforeNode = nodeList.find((el, i) => i < nodePos && el !== null && tr.nextElementSibling!.contains(el));
                    if(beforeNode) {
                        editor.dom.nodesInsertAfter([td!], beforeNode);
                    } else {
                        tr.nextElementSibling!.insertBefore(td!, tr.nextElementSibling!.childNodes[0]);
                    }
                    if(1 < rowSpan) {
                        if(rowSpan === 2) td!.removeAttribute("rowspan");
                        else td!.setAttribute("rowspan", (rowSpan-1).toString());
                    }
                }

            }
        });
        tr.parentNode!.removeChild(tr);
        if(tbody.querySelectorAll("td").length === 0) table.remove();

    }

    func['delete_column'] = () => {
        let tr = editor.dom.nodeParent(node, "TR") as HTMLElement;
        if(!tr || !table || !tr.childElementCount) return;
        if (pos === -1) return;
        if(tr.childNodes.length === 1) {
            table.remove();
            return;
        }
        if(node.nextElementSibling) {
            editor.dom.setCaretAt(node.nextElementSibling,0);
        }else if(node.previousElementSibling) {
            editor.dom.setCaretAt(node.previousElementSibling,0);
        }
        
        const nodeColPosition = colPosition(node), colspan = editor.dom.table.colSpan(node);
        const trs = Array.from(table.querySelectorAll("tr"));
        const allNodeList = tableUniqueCellList;

        const IndexDelete : number[] = [];
        for(var i = 0; i < colspan;i++) {
            IndexDelete.push(nodeColPosition + i);
        }
        trs.forEach( (r, idx) => {
            if(r === tr) {
                //same row, remove col
                r.removeChild(r.childNodes[pos]);
            } else {
                const nodeList = allNodeList[idx];
                let prevNode : HTMLElement | null = null;
                for(var i = 0, t = IndexDelete.length;i < t;i++) {
                    if(prevNode === nodeList[IndexDelete[i]] || !nodeList[IndexDelete[i]]) continue;
                    prevNode = nodeList[IndexDelete[i]];
                    const span = editor.dom.table.colSpan(prevNode!);
                    //determine if we need to strink or delete
                    if(span === 1) {
                        r.removeChild(prevNode!);
                        prevNode = null;
                    } else {
                    if (span-1 === 1)
                        prevNode!.removeAttribute("colspan");
                    else
                        prevNode!.setAttribute("colspan", (span-1).toString());
                    }
                }
            }
        });
        if(tbody?.querySelectorAll("td").length === 0) table.remove();
    }

    func['insert_row_above'] = () => {
        let tr = editor.dom.nodeParent(node, "TR") as HTMLElement, tds = tr.querySelectorAll("td");
        if(!tr || !tbody || !tds.length) return;
        let ntr = document.createElement("tr");

        for(let i = 0,  t = tr.childElementCount; i < t; i++) {
            const td = tr.childNodes[i].cloneNode(false) as HTMLElement;
            if(cellStyle) td.setAttribute("style", cellStyle);
            td.appendChild(document.createElement("br"));
            ntr.appendChild(td);
        }
        tbody.insertBefore(ntr, tr);
    }
    func['insert_row_below'] = () => {
        let tr = editor.dom.nodeParent(node, "TR") as HTMLElement;
        let ntr = document.createElement("tr");
        for(let i = 0,  t = tr.childElementCount; i < t; i++) {
            const td = tr.childNodes[i].cloneNode(false) as HTMLElement;
            if(cellStyle) td.setAttribute("style", cellStyle);
            td.appendChild(document.createElement("br"));
            ntr.appendChild(td);
        }
        editor.dom.nodesInsertAfter([ntr], tr);
    }
     
    func['insert_column_left'] = () => {
        const allNodeList = tableUniqueCellList;
        const nodeColPosition = colPosition(node);
        const trs = Array.from(table.querySelectorAll("tr")), row = trs.indexOf(node.parentElement as HTMLTableRowElement);
        let normalizedPos = nodeColPosition;
        if(allNodeList[row][normalizedPos] === null) {
            for(let i = row; i >= 0; i--) {
                normalizedPos--;
                if(allNodeList[row][normalizedPos] !== null) break;
            } 
        }
        const singleCell = editor.dom.table.colSpan(node) === 1 && normalizedPos === nodeColPosition;
        trs.forEach( (r, idx) => {
            const nodeList = allNodeList[idx];
            const n = nodeList[normalizedPos];
            if(!n) return;
            if(singleCell && normalizedPos > 0 && nodeList[normalizedPos - 1] === n) {
                const span = editor.dom.table.colSpan(n)+1;
                n.setAttribute("colspan",(span).toString());
                return;
            }
            const td = document.createElement(n.nodeName);
            if(cellStyle) td.setAttribute("style", cellStyle);
            td.appendChild(document.createElement("br"));
            const rowSpan = editor.dom.table.rowSpan(n);
            if(rowSpan > 1) td.setAttribute("rowspan", rowSpan.toString());
            r.insertBefore(td, n);
        });
    }
    func['insert_column_right'] = () => {
        const allNodeList = tableUniqueCellList;
        const nodeColPosition = colPosition(node);
        const trs = Array.from(table.querySelectorAll("tr")), row = trs.indexOf(node.parentElement as HTMLTableRowElement);
        let normalizedPos = nodeColPosition;
        if(allNodeList[row][normalizedPos] === null) {
            for(let i = row; i >= 0; i--) {
                normalizedPos--;
                if(allNodeList[row][normalizedPos] !== null) {
                    break;
                }
            } 
        }
        //move to right end
        while(allNodeList[row].length > normalizedPos+1 && allNodeList[row][normalizedPos+1] === allNodeList[row][normalizedPos]) {
            normalizedPos++;
        }
        const singleCell = editor.dom.table.colSpan(node) === 1 && normalizedPos === nodeColPosition;
        trs.forEach( (r, idx) => {
            const nodeList = allNodeList[idx];
            const n = nodeList[normalizedPos];
            if(!n) return;
            if(singleCell && normalizedPos + 1 < nodeList.length && nodeList[normalizedPos + 1] === n) {
                const span = editor.dom.table.colSpan(n)+1;
                n.setAttribute("colspan",(span).toString());
                return;
            }
            const td = document.createElement(n.nodeName);
            if(cellStyle) td.setAttribute("style", cellStyle);
            td.appendChild(document.createElement("br"));
            const rowSpan = editor.dom.table.rowSpan(n);
            if(rowSpan > 1) td.setAttribute("rowspan", rowSpan.toString());
            editor.dom.nodesInsertAfter([td],n);

        });
    }

    func['merge_down'] = () => {
        let tr = editor.dom.nodeParent(node, "TR")!, 
        trs = (tbody as HTMLElement).querySelectorAll("tr");
        const row = editor.dom.nodePosition(tr);
        const  rowspan = parseInt(node.getAttribute("rowspan") || "1", 10);
        if(trs.length <= row+rowspan) return;
        const nodeList = nodeIndexList(trs[row]), nextNodeList = nodeIndexList(trs[row + rowspan]);
        const col = nodeList.indexOf(node);

        if(editor.dom.table.colSpan(nodeList[col]!) !== editor.dom.table.colSpan(nextNodeList[col]!)) return;

        editor.dom.nodeChildInsertInto(node, nextNodeList[col]!);
        trs[row + rowspan].removeChild(nextNodeList[col]!);
        if(trs[row + rowspan].childElementCount === 0) trs[row + rowspan].remove();

        if(tr.childNodes.length === 1) {
            node.removeAttribute("rowspan");
        } else {
            let span = parseInt(node.getAttribute("rowspan") || "1", 10) + 1;
            node.setAttribute("rowspan",span.toString());
        }
    }
    func['merge_right_header'] = () => {
        let tr = editor.dom.nodeParent(node, "TR") as HTMLElement;
        const col = editor.dom.nodePosition(node);
        if(tr.childElementCount <= col + 1) return;
        let mergetd;
        const mergetds = tr.querySelectorAll("th");
        if (mergetds.length > col+1 && mergetds[col+1]) {
            mergetd = mergetds[col+1];
        }
        if (mergetd) {
            editor.dom.nodeChildInsertInto(node, mergetd);
            let span = parseInt(node.getAttribute("colspan") || "1", 10) + 1;
            node.setAttribute("colspan",span.toString());
            mergetd.parentNode!.removeChild(mergetd);
        }
    }
    func['merge_right'] = () => {
        if(node.nodeName === "TH") return func['merge_right_header']();

        let tr = editor.dom.nodeParent(node, "TR")!, 
        trs = (tbody as HTMLElement).querySelectorAll("tr");
        const col = editor.dom.nodePosition(node), row = editor.dom.nodePosition(tr);
        const rowspan = parseInt(node.getAttribute("rowspan") || "1", 10);
        if(tr.childNodes.length <= col+1) return;

        let mergedspans = rowspan;
        for(var i = row; i < row + rowspan; i++) {
            if(!trs[i]) break;
            const tds = trs[i].querySelectorAll("td");
            const colIdx = i === row ? col+1 : col;
            
            if(tds[colIdx]) {
                const span = parseInt(tds[colIdx].getAttribute("rowspan") || "1", 10);
                editor.dom.nodeChildInsertInto(node, tds[colIdx]);
                trs[i].removeChild(tds[colIdx]);
                mergedspans -= span;
                if(mergedspans <= 0){
                    while(mergedspans < 0) {
                        const td =document.createElement("td");
                        td.appendChild(document.createElement("br"));
                        if(trs[i].childElementCount > col) {
                            trs[i].insertBefore(td, trs[i].childNodes[col]);
                        }else {
                            trs[i].appendChild(td);
                        }
                        mergedspans++;
                    }
                    if(trs[i].childElementCount === 0) {
                        trs[i].parentNode!.removeChild(trs[i]);
                    }
                    break;
                }
            }
        }
        if(rowspan > 1 && tr.childNodes.length === 1) {
            node.removeAttribute("rowspan");
        }
        let span = parseInt(node.getAttribute("colspan") || "1", 10) + 1;
        node.setAttribute("colspan",span.toString());
    }
    func['unmerge_header'] = () => {
        const col = editor.dom.nodePosition(node), nodecol = parseInt(node.getAttribute("colspan") || "1", 10);
        if(nodecol === 1) return;
        //how many more col:
        for (let j = col + 1; j < col + nodecol; j++) {
            const td = document.createElement(node.nodeName);
            if(cellStyle) td.setAttribute("style", cellStyle);
            td.appendChild(document.createElement("br"));
            editor.dom.nodesInsertAfter([td], node);
        }
        node.removeAttribute("colspan");
    }
    func['unmerge'] = () => {
        if(node.nodeName === "TH") return func['unmerge_header']();
        let tr = editor.dom.nodeParent(node, "TR")!, 
        trs = (tbody as HTMLElement).querySelectorAll("tr");
        const col = editor.dom.nodePosition(node), row = editor.dom.nodePosition(tr);
        let noderow = parseInt(node.getAttribute("rowspan") || "1",10), nodecol = parseInt(node.getAttribute("colspan") || "1", 10);
        if(noderow === 1 && nodecol === 1) return;


        //unmerge:
        for(let i = row; i < row + noderow; i++) {
            const thisrow = trs[i];
            let tds = thisrow.querySelectorAll(node.nodeName);
            //console.log(thisrow, tds, row, col, thisrow.childElementCount);
            if (i > row) {
                //add column for every next row:
                //console.log("add col", t);
                const td = document.createElement(node.nodeName);
                if(cellStyle) td.setAttribute("style", cellStyle);
                td.appendChild(document.createElement("br"));
                thisrow.insertBefore(td, tds[col]);
                tds = thisrow.querySelectorAll(node.nodeName);
            }
            //how many more col:
            for (let j = col + 1; j < col + nodecol; j++) {
                //console.log("more col", j, col, thisrow.childElementCount - 1);
                const td = document.createElement(node.nodeName);
                if(cellStyle) td.setAttribute("style", cellStyle);
                td.appendChild(document.createElement("br"));
                if(i === row) {
                    editor.dom.nodesInsertAfter([td], tds[col]);
                } else {
                    tds[col].parentElement!.insertBefore(td, tds[col]);
                }
            }
        }
        node.removeAttribute("rowspan");
        node.removeAttribute("colspan");
    }


    if(typeof func[value] === "function") func[value]();
    editor.triggerChange();
}

export default [
    {
        event : "registerLanguage",
        target : [],
        callback : () : {[key: string]:{[key: string]: string}} => {
            const ln : {[key: string]:{[key: string]: string}} = {};
            ln["en"] = {
                "table" : "table",
                "TABLE STYLE" : "TABLE STYLE",
                "Apply" : "Apply",
                "CELL STYLE" : "CELL STYLE",
                "Apply To" : "Apply To",
                "All" : "All",
                "Cell" : "Cell",
                "Row" : "Row",
                "INSERT HEADER" : "INSERT HEADER",
                "DELETE HEADER" : "DELETE HEADER",
                "INSERT ROW ABOVE" : "INSERT ROW ABOVE",
                "INSERT ROW BELOW" : "INSERT ROW BELOW",
                "INSERT COLUMN LEFT" : "INSERT COLUMN LEFT",
                "INSERT COLUMN RIGHT" : "INSERT COLUMN RIGHT",
                "DELETE ROW" : "DELETE ROW",
                "DELETE COLUMN" : "DELETE COLUMN",
                "MERGE DOWN" : "MERGE DOWN",
                "MERGE RIGHT" : "MERGE RIGHT",
                "UNMERGE" : "UNMERGE"


            };
            return ln;
        }
    },
    {
    event : "onKeyDown",
    target : ["tab"],
    callback : (editor :SubEditor, e : KeyboardEvent) => {
        //tab: to next cell
        if(!editor.feature!.path.includes("TD") && !editor.feature!.path.includes("TH") && !editor.feature!.path.includes("TABLE")) return;
        const node = (editor.dom.nodeParent(editor.feature!.node!, "TD") || editor.dom.nodeParent(editor.feature!.node!, "TH")) as HTMLElement;
        if(!node) return;
        const table = editor.feature!.pathNode[editor.feature!.path.indexOf("TABLE")];
        if(!table) return;
        const tds = Array.from(table.querySelectorAll("TH,TD"));
        const currentIdx = tds.indexOf(node);
        if(currentIdx === -1) return;
        e.preventDefault();
        e.stopPropagation();
        if(currentIdx === tds.length -1) {
            //break out of table:
            if(editor.refContent.lastElementChild === table) {
                editor.refContent.appendChild(document.createElement("br"));
            }
            
            editor.dom.setCaretAt(table.nextSibling!,0);
        } else {
            editor.dom.setCaretAt(tds[currentIdx+1],0);
        }


    }
    },
    {
    event : "onCommand",
    target : ["table"],
    callback : (editor :SubEditor, cmd : string, value : string, styleValue : string | undefined, styleApplyTo : string | undefined) => {
        const v = value.split(",");
        if (v.length === 1) {
            if(value === "table_style") table_style(editor, styleValue!);
            else if(value === "cell_style") cell_style(editor, styleValue!, styleApplyTo!);
            else table_function(editor, value);
            return;
        }

        let ths = [],th = [], trs = [], focus_row = parseInt(v[0],10), focus_col = parseInt(v[1],10);
        for (let j = 0; j < focus_col; j++) {
            th.push('<th>header '+(j+1)+'</th>');
        }
        ths.push('<tr>'+th.join("")+'</tr>');
        for (let i = 0; i < focus_row; i++) {
            let tr = [];
            for (let j = 0; j < focus_col; j++) {
                tr.push('<td><br></td>');
            }
            trs.push('<tr>'+tr.join("")+'</tr>');
        }

        const table = document.createElement("table");
        table.innerHTML = '<thead>'+ths.join("")+'</thead><tbody>'+trs.join("")+'</tbody>';
        const insertAfterIdx = editor.feature!.path.findIndex(p => ["BLOCKQUOTE","PRE","CODE","OL","UL","TABLE"].indexOf(p) !== -1);
        if(insertAfterIdx !== -1) {
           editor.dom.nodesInsertAfter([document.createElement("br"), table], 
            editor.feature!.path.length > insertAfterIdx + 1 && editor.feature!.path[insertAfterIdx] === "CODE" && editor.feature!.path[insertAfterIdx + 1] === "PRE" ? editor.feature!.pathNode[insertAfterIdx+1] :
            editor.feature!.pathNode[insertAfterIdx]);
        } else {
            const {range} = editor.getSelectionRange();
            range.deleteContents();
            range.insertNode(table);
        }
        const tableStyle = editor.getCfg("table.default.table.style"), headerStyle = editor.getCfg("table.default.header.cell.style"),
        cellStyle = editor.getCfg("table.default.cell.style");
        if(tableStyle) table.setAttribute("style", tableStyle);
        if(headerStyle) Array.from(table.querySelectorAll("TH")).forEach(n => n.setAttribute("style", headerStyle));
        if(cellStyle) Array.from(table.querySelectorAll("TBODY TD")).forEach(n => n.setAttribute("style", cellStyle));
        
        const usableParent = (node : Node) => {
            const path : Node[] = [];
            path.push(node);
            while(editor.dom.nodeIsTextInlineOrVoid(node) && node !== editor.refContent && ["DIV","TD","TH","LI"].indexOf(node.nodeName) === -1) {
                node = node.parentNode as Node;
                path.push(node);
            }
            return path;
        }
        const nodePath = usableParent(table);
        const pNode = nodePath.find(n => n.nodeName === "P");
        if(pNode && table.parentElement) {
        //break paragraph
            if(table.parentElement?.nodeName === "P") {
                editor.dom.nodeBreak(pNode, table);
            }
            const p = document.createElement("p");
            if(table.parentElement.lastChild === table) {
                editor.dom.nodesInsertAfter([table], table.parentElement);
            } else{
                for(let i = Array.from(table.parentElement.childNodes).indexOf(table)+1, j = table.parentElement.childNodes.length; i < j; i++) {
                    p.appendChild(table.parentElement.childNodes[i]);
                }
                editor.dom.nodesInsertAfter([table, p], table.parentElement);
            }
           
        }
        if(editor.refContent.lastChild === table) {
            editor.refContent.appendChild(document.createElement("br"));
        }
        editor.dom.setCaretAt(table.querySelector("tbody td")!,0);
        editor.triggerChange();
        
    }
}] as SubEditorEvent[];