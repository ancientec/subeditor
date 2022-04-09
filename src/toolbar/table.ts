import SubEditor from "../subeditor";

function createTableDropdown(editor : SubEditor, el : HTMLElement) {
    el.querySelector(".se-dropdown-content")!.innerHTML = '<div class="padding"><table class="ToolbarTable"><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><div class="title"></div></div>';
    const table = el.querySelector("table")!;

    const _mouseover = (e : MouseEvent, row : number, col : number) => {
        let x = 0, y = 0;
      table.querySelectorAll('tr').forEach(tr => {
          x++;
        tr.querySelectorAll('td').forEach(td => {
            y++;
            
            td.classList.remove("active");
            if(row >= x && col >= y) {
                td.classList.add("active");
            }
            if (td === e.currentTarget) {
                el.querySelector(".title")!.innerHTML = x+" x "+ y;
            }
        });
        y=0; 
      });
      };//end of _mouseover

      const _mouseout = () => {
        table.querySelectorAll("td").forEach(td => {
            td.classList.remove("active");
            el.querySelector(".title")!.innerHTML = "&nbsp;";});
      };//end of mouse out
      let _row = 0, _col = 0;
      table.querySelectorAll('tr').forEach(tr => {
          _row++;
        tr.querySelectorAll('td').forEach(td => {
            _col++;
            const __row = _row, __col = _col;
            td.addEventListener('mouseover', e => {_mouseover(e, __row, __col)});
            td.addEventListener('mouseout', _mouseout);
            td.addEventListener('click', () => { editor.toolbar?.hideDropdown();editor.command("table", [__row+","+__col]) });
        });
        _col=0; 
      });
}

function inTableDropdown(editor :SubEditor, el : HTMLElement) {

    const cell = (editor.dom.nodeParent(editor.feature?.node as Node, "TD") || editor.dom.nodeParent(editor.feature?.node as Node, "TH")) as HTMLElement;
    const is_td = editor.feature?.path.includes("TD"), table = editor.feature!.pathNode[editor.feature?.path.indexOf("TABLE")!], tr = editor.dom.nodeParent(editor.feature?.node as Node, "TR"), trs = table.querySelectorAll("tbody tr");

    const has_header = table.querySelectorAll("th").length > 0;
    const col = editor.dom.nodePosition(cell), row = editor.dom.nodePosition(tr);
    const noderowspan = parseInt(cell.getAttribute("rowspan") || "1",10), nodecolspan = parseInt(cell.getAttribute("colspan") || "1",10);
    const allow_unmerge = nodecolspan > 1 || noderowspan > 1;
    let allow_mergeright = cell.parentElement!.childNodes.length > col + 1;
    let allow_mergedown = is_td && trs.length > row + 1;
    const tableCellList : (HTMLElement | null)[][] = (allow_mergedown || allow_mergeright) ? editor.dom.table.cellList(table, false) : [];

    if(allow_mergeright) {
        
        const nodeList = tableCellList[row], idx = nodeList.indexOf(cell);
        if(editor.dom.table.rowSpan(cell) !== editor.dom.table.rowSpan(nodeList[idx+1]!)) {
            allow_mergeright = false;
        }
    }
    
    if(allow_mergedown) {
        const nodeList = tableCellList[row], 
        nextNodeList = tableCellList[row+1],
        idx = nodeList.indexOf(cell);
        if(editor.dom.table.colSpan(nodeList[idx]!) !== editor.dom.table.colSpan(nextNodeList[idx]!)) {
            allow_mergedown = false;
        }

    }



    el.querySelector(".se-dropdown-content")!.innerHTML = '<button class="se-button se-dropdown-item hover borderbottom" data-command="table_style" >'+ editor.ln("TABLE STYLE")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="cell_style">'+ editor.ln("CELL STYLE")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_header" style="'+(has_header ? 'display: none;' : '')+'">'+ editor.ln("INSERT HEADER")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_header" style="'+(is_td ? 'display: none;' : '')+'">'+ editor.ln("DELETE HEADER")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_row_above" style="'+(!is_td ? 'display: none;' : '')+'">'+ editor.ln("INSERT ROW ABOVE")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_row_below" style="'+(!is_td ? 'display: none;' : '')+'">'+ editor.ln("INSERT ROW BELOW")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_column_left">'+ editor.ln("INSERT COLUMN LEFT")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_column_right">'+ editor.ln("INSERT COLUMN RIGHT")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_row" style="'+(!is_td ? 'display: none;' : '')+'">'+ editor.ln("DELETE ROW")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_column">'+ editor.ln("DELETE COLUMN")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="merge_down" style="'+(!allow_mergedown ? 'display: none;' : '')+'">'+ editor.ln("MERGE DOWN")+'</button><button class="se-button se-dropdown-item hover borderbottom" data-command="merge_right" style="'+(!allow_mergeright ? 'display: none;' : '')+'">'+ editor.ln("MERGE RIGHT")+'</button><button class="se-button se-dropdown-item hover" data-command="unmerge" style="'+(!allow_unmerge ? 'display: none;' : '')+'">'+ editor.ln("UNMERGE")+'</button>';
    
    el.querySelectorAll(".se-dropdown-item").forEach(i => {
        i.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const cmd = i.getAttribute("data-command") as string || "";
            if(cmd === "table_style") {
                const style = table.hasAttribute("style") ? table.getAttribute("style") :
                editor.getCfg("table.default.table.style");
                el.querySelector(".se-dropdown-content")!.innerHTML = '<div class="padding"><div class="se-dropdown-item"><input type="text" name="style"><label>'+ editor.ln("TABLE STYLE")+'</label></div><div style="text-align: right;margin-right:5px"><button class="se-button apply">'+ editor.ln("Apply")+'</button></div></div>';
                (el.querySelector(".se-dropdown-content input[name=style]") as HTMLInputElement).value = style;
                el.querySelector(".se-dropdown-content .se-button.apply")!.addEventListener("click", ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    editor.restoreSelection(editor.getCache("currentSelection"));
                    editor.command("table", ["table_style", (el.querySelector(".se-dropdown-content input[name=style]") as HTMLInputElement).value]);
                    editor.toolbar?.hideDropdown();
                    return false;
                });
                return false;
            }
            if(cmd === "cell_style") {
                const style = cell.hasAttribute("style") ? cell.getAttribute("style") :
                editor.getCfg(is_td ? "table.default.cell.style" : "table.default.header.cell.style");
                let str = '<div class="padding"><div class="se-dropdown-item"><input type="text" name="style"><label>'+ editor.ln("CELL STYLE")+'</label></div><div style="text-align:right;display:flex"><button disabled style="    border: none;background: #fff;">'+ editor.ln("Apply To")+'</button>';
                if(is_td) {
                    str += '<button class="se-button apply" data-value="all">'+ editor.ln("All")+'</button><button class="se-button apply" data-value="row">'+ editor.ln("Row")+'</button><button class="se-button apply" data-value="cell">'+ editor.ln("Cell")+'</button></div></div>';
                } else {
                    str += '<button class="se-button apply" data-value="row">'+ editor.ln("Row")+'</button><button class="se-button apply" data-value="cell">'+ editor.ln("Cell")+'</button></div></div>';
                }
                el.querySelector(".se-dropdown-content")!.innerHTML = str;
                (el.querySelector(".se-dropdown-content input[name=style]") as HTMLInputElement).value = style;
                Array.from(el.querySelectorAll(".se-dropdown-content .se-button.apply")).forEach(btn => btn.addEventListener("click", ev => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    editor.restoreSelection(editor.getCache("currentSelection"));
                    editor.command("table", ["cell_style", (el.querySelector(".se-dropdown-content input[name=style]") as HTMLInputElement).value, (ev.target as HTMLButtonElement).getAttribute("data-value") as string || ""]);
                    editor.toolbar?.hideDropdown();
                    return false;
                }));
                return false;
            }
            
            editor.restoreSelection(editor.getCache("currentSelection"));
            editor.command("table", [cmd]);
            editor.toolbar?.hideDropdown();
            return false;
        });
    });
}

export default function(editor : SubEditor) {

    return {
        table : {
        command : "table",
        svg : SubEditor.svgList["table"],
        tips : editor.ln("table"),
      dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="'+ editor.ln("table")+'"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-table"><span></span><span class="se-icon">'+SubEditor.svgList["table"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-table" role="menu"><div class="se-dropdown-content se-control"><div class="title"></div></div></div></div>',
        onRender : (_editor : SubEditor, table : HTMLElement) => {

            const menu = table.querySelector('.se-dropdown-menu')!;
            table.querySelector('.se-dropdown-trigger > button')!.addEventListener('click', () => {
                if(!menu.classList.contains("is-active")) {
                    //to be open:
                    //cache selection, typing in input lose selection
                    editor.setCache("currentSelection", _editor.selection!);
                    //make sure feature is ready
                    _editor.handleFeature();
                    //check if we are in table
                    const path = _editor.feature?.path!;
                    if(path.includes("TD") || path.includes("TH")) {
                        inTableDropdown(_editor, table);
                    } else {
                        createTableDropdown(_editor, table);
                    }
                }
              });

            
        }
        }
    }
}