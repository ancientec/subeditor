import SubEditor from "../subeditor";

export default function(editor : SubEditor) {
    return {
      link : {
        command : "link",
        svg : SubEditor.svgList["link"],
        tips : "link",
        dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="'+ editor.ln("link")+'"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-link"><span></span><span class="se-icon">'+SubEditor.svgList["link"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-link" role="menu"><div class="se-dropdown-content control"><div class="padding"><div class="se-dropdown-item"><input type="text" name="url"><label>'+ editor.ln("url")+'</label></div><div class="se-dropdown-item"><input type="text" name="text"><label>'+ editor.ln("text")+'</label></div><div class="se-dropdown-item"><input type="text" name="target"><label>'+ editor.ln("link target") + ' <u style="cursor:pointer">' + editor.ln("open in new tab") +'</u></label></div><div style="text-align: right;margin-right:5px"><button class="se-button alert">'+ editor.ln("remove")+'</button><button class="se-button insert">'+ editor.ln("insert")+'</button></div></div></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          
            const btnAlert = el.querySelector('.se-dropdown-content .se-button.alert') as HTMLElement,
            btnInsert = el.querySelector('.se-dropdown-content .se-button.insert') as HTMLElement,
            inputURL = el.querySelector('.se-dropdown-content input[name=url]') as HTMLInputElement,
            inputText = el.querySelector('.se-dropdown-content input[name=text]') as HTMLInputElement,
            inputTarget = el.querySelector('.se-dropdown-content input[name=target]') as HTMLInputElement;
            //cache selection, typing in input lose selection
            editor.setCache("currentSelection", _editor.selection!);
            el.querySelector("u")?.addEventListener('click', () => {
                (el.querySelector("input[name=target]") as HTMLInputElement).value = "_blank";
            });
           btnInsert.addEventListener('click', (e) => {
                
                e.preventDefault();
                e.stopPropagation();
                _editor.toolbar?.hideDropdown();
                _editor.restoreSelection(editor.getCache("currentSelection"));
                _editor.command('link', [btnInsert.innerHTML === editor.ln("insert") ? "insert" : "update", inputURL.value, inputText.value, inputTarget.value]);
                return false;
            });
            btnAlert.addEventListener('click', (e) => {
                
                e.preventDefault();
                e.stopPropagation();
                _editor.toolbar?.hideDropdown();
                _editor.command('link', ["remove"]);
                return false;
            });
            const menu = el.querySelector('.se-dropdown-menu')!;
            el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
              if(!menu.classList.contains("is-active")) {
                  //to be open:
                  //save selection:
                  editor.setCache("currentSelection", _editor.selection!);
                  
                  if(_editor.feature?.a.node) {
                    //update
                    btnInsert.innerHTML = editor.ln("update");
                    inputURL.value = _editor.feature?.a.href || "";
                    inputTarget.value = _editor.feature?.a.target || "";
                    inputText.value = _editor.feature?.a.node?.textContent || "";
                    btnAlert.style.display = "";
                  } else {
                    //insert
                    inputURL.value = "";
                    inputTarget.value = "";
                    inputText.value = "";
                    btnInsert.innerHTML = editor.ln("insert");
                    btnAlert.style.display = "none";
                  }
              }
            });
        }
      }
    }
}