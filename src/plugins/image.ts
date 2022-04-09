import SubEditor from "../subeditor";
import { SubEditorEvent } from "../event";
import { ToolbarItem } from "../toolbar/toolbar";

//toolbar and event all together


/*
upload:
1) drop or pick
2) render preview ui
3) send file to url
4) process result via upload handler
5) update preview ui
6) insert or cancel

library:
1) load library url
2) render ui & paging
3) click to insert
*/
const getCfg = (editor : SubEditor) => {
    const cfg : {[key: string]: any} = {
        "image.features" : ["url","upload","library"],
        "image.accept.types" : "image/jpeg, image/jpg, image/png, image/apng, image/gif, image/webp",
        "image.library.fetch" : null,//react component for displaying library fn(props.onInsert)
        "image.library.per.page" : 20,
        "image.library.allow.paging" : true,
        "image.library.allow.search" : true,
        "image.upload.url" : "",
        "image.upload.max.size" : 0,
        "image.upload.max.size.per.file" : 0,
        "image.upload.accept.files" : 0, //0:accept multiple files, 1: accept 1 file
        "image.upload.handler" : null, //function(file, callback){handle post}
        "image.url.rewrite.handler" : (u : string) => { return u.replace('http://','//').replace('https://','//')},
    };
    Object.keys(cfg).forEach(key => {
        cfg[key] = editor.getCfg(key);
    });
    return cfg;
}

const renderLibrary = (editor : SubEditor, content : HTMLElement) => {
    const cfg = getCfg(editor);
    if(typeof cfg["image.library.fetch"] !== "function") return;

    content.classList.remove("horizontal");
    content.innerHTML = '<div class="padding"><div class="FileTileImageGrid ImageLibrary"></div></div>';
    //reset cache to default:
    editor.setCache("image.library.current.keyword", "");

    const fetchPage = (page : number, keyword : string) => {
        const currentKeyword = editor.getCache("image.library.current.keyword") || "";
        if(currentKeyword !== keyword) page = 1;
        editor.setCache("image.library.current.page", page);
        editor.setCache("image.library.current.keyword", keyword);
        cfg["image.library.fetch"](page, cfg["image.library.per.page"], keyword, (total : number, data : any[]) => {
            const totalPages =  cfg[ "image.library.per.page"] ? Math.ceil(total / cfg[ "image.library.per.page"]) : 1;
            const grid = content.querySelector(".FileTileImageGrid")!;
            grid.innerHTML = "";
            data.forEach(item => {
                const tile : HTMLElement = item.tileFunc ? item.tileFunc() : renderTile(item);
                //hook event:
                grid.appendChild(tile);
                tile.addEventListener("click", (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    editor.command("image",["library", item]);
                    editor.toolbar!.hideDropdown();
                    return false;
                });

            });
            
            editor.toolbar?.adjustContentPosition(content);
            if(grid.parentElement!.querySelector(".FileTileImageGridFooter")) {
                grid.parentElement!.removeChild(grid.parentElement!.querySelector(".FileTileImageGridFooter")!);
            }
            if(!cfg["image.library.allow.paging"] && !cfg["image.library.allow.search"]) return;
            const footer = document.createElement("div");
            footer.setAttribute("class", "FileTileImageGridFooter");
            const pagination = document.createElement("nav");
            pagination.setAttribute("class", "FileTileImageGridPagination");
            footer.appendChild(pagination);
            grid.parentElement!.appendChild(footer);

            if(cfg["image.library.allow.paging"]) {
                const prev = document.createElement("a");
                prev.setAttribute("class", "previous se-button");
                pagination.appendChild(prev);
                prev.innerHTML = '<span class="se-icon">'+SubEditor.svgList['previous']+'</span>';

                const pageSpan = document.createElement("span");
                pagination.appendChild(pageSpan);

                const current = document.createElement("input");
                current.setAttribute("type", "text");
                current.setAttribute("class", "current");
                current.value = page.toString();
                pageSpan.appendChild(current);

                const totalSpan = document.createElement("span");
                totalSpan.setAttribute("class", "total");
                totalSpan.innerHTML = '/ '+totalPages;
                pageSpan.appendChild(totalSpan);

                const next = document.createElement("a");
                next.setAttribute("class", "next se-button");
                pagination.appendChild(next);
                next.innerHTML = '<span class="se-icon">'+SubEditor.svgList['next']+'</span>';

                prev.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    const kw = (pagination.querySelector("input.keyword") as HTMLInputElement).value || "";
                    if(kw !== keyword) fetchPage(1, kw);
                    else if(page > 1) {
                        fetchPage(page-1, kw);
                    }
                    return false;
                });
                next.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    const kw = (pagination.querySelector("input.keyword") as HTMLInputElement).value || "";
                    if(kw !== keyword) fetchPage(1, kw);
                    else if(page < totalPages) {
                        fetchPage(page+1, kw);
                    }
                    return false;
                });
                current.addEventListener("keydown", (ev) => {
                    if(ev.key !== 'Enter') return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    const targetPage = parseInt((pagination.querySelector("input.current") as HTMLInputElement).value, 10);
                    const kw = (pagination.querySelector("input.keyword") as HTMLInputElement).value || "";
                    if(kw !== keyword) fetchPage(1, kw);
                    else if(targetPage != page && targetPage > 0 && targetPage <= totalPages) {
                        fetchPage(targetPage, kw);
                    }
                    return false;
                  });
                current.addEventListener("blur", () => {
                    const targetPage = parseInt((pagination.querySelector("input.current") as HTMLInputElement).value, 10);
                    const kw = (pagination.querySelector("input.keyword") as HTMLInputElement).value || "";
                    if(kw !== keyword) fetchPage(1, kw);
                    else if(targetPage != page && targetPage > 0 && targetPage <= totalPages) {
                        fetchPage(targetPage, kw);
                    }
                });
            }
            if(cfg["image.library.allow.search"]) {
                const keywordInput = document.createElement("input");
                keywordInput.setAttribute("type", "text");
                keywordInput.setAttribute("class", "keyword");
                keywordInput.setAttribute("keyword", editor.ln("keyword"));
                keywordInput.value = keyword;
                pagination.appendChild(keywordInput);

                const search = document.createElement("a");
                search.setAttribute("class", "search se-button");
                pagination.appendChild(search);
                search.innerHTML = '<span class="se-icon">'+SubEditor.svgList['search']+'</span>';

                search.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    const kw = keywordInput.value || "";
                    if(kw !== keyword) fetchPage(1, kw);
                    return false;
                });
            }
        });
    }
    const current_page = editor.getCache("image.library.current.page");
    fetchPage(current_page && typeof current_page === "string" ? parseInt(current_page,10) : current_page || 1, editor.getCache("image.library.current.keyword") || "");
    editor.toolbar!.adjustContentPosition(content);
    editor.toolbar!.insertCloseButton(content.parentElement!.parentElement!);
    
}
const isImage = (type : string) => type.indexOf("image/") !== -1;
const renderTile = (item : any) => {
    const btn = document.createElement("button");
    if(isImage(item.type)) {
        btn.innerHTML = '<figure><figure><img src="'+(item.thumb || item.url)+'" alt="'+item.name+'"></figure></figure><span class="caption">'+item.name+'</span>';
    } else {
        btn.innerHTML =  '<figure><figure><span class="text">'+item.name+'</span></figure></figure><span class="caption">'+item.name+'</span>';
    }
    return btn;
    
}
const processUpload = (editor : SubEditor, idx : number, file : File,  el : HTMLElement, completed : Function) => {
    const url = editor.getCfg("image.upload.url") || "", 
    cfgUploadHandler = editor.getCfg("image.upload.handler"),
    cfgUrlRewriteHandler = editor.getCfg("image.url.rewrite.handler");
    if(!url) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url); 
    const fd = new FormData();
    fd.append("file",file);
    xhr.upload.addEventListener("progress", (ev) => {
        const percent = Math.min(100, Math.floor(ev.loaded / ev.total * 10000) / 100);
        //console.log("progress",file.name, percent+"%");
        el.querySelector(".text")!.innerHTML = editor.ln("uploading")+ " "+percent+"%";
    });
    xhr.addEventListener("error", () => {
        xhr.abort();
    });
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if(xhr.status === 0) {
                el.classList.add("failed");
                el.querySelector(".text")!.innerHTML = editor.ln("upload failed");
                editor.cachedList["image.upload.result.list"][idx] = {status : "failed"};
                completed(false);
                return;
            }
            cfgUploadHandler(file, xhr.responseText, (_url : string, _thumb : string, _obj : any, _elFunc : Function | undefined | null = undefined ) => {
                
                el.classList.add("completed");
                const url2 = typeof cfgUrlRewriteHandler === "function" ? cfgUrlRewriteHandler(_url) : _url,
                thumb2 = typeof cfgUrlRewriteHandler === "function" ? cfgUrlRewriteHandler(_thumb) : _thumb;
                editor.cachedList["image.upload.result.list"][idx] = {status : "completed", name : file.name, type : file.type, url : url2, thumb : thumb2,  obj : _obj, elFunc : _elFunc};
                if(isImage(file.type)) {
                    const img = document.createElement("img");
                    img.setAttribute("src", thumb2);
                    el.setAttribute("data-thumb", thumb2);
                    el.querySelector("figure figure")!.innerHTML = img.outerHTML;
                }else {
                    el.querySelector(".text")!.innerHTML = file.type === "text/plain" ? "TXT" : file.type.substring(file.type.indexOf("/")+1).toUpperCase();
                }
                el.setAttribute("data-url", url2);
                completed(true);                
            });
        }
    }
    xhr.send(fd);
    
}
const renderUpload = (editor : SubEditor, content : HTMLElement) => {
    content.classList.remove("horizontal");
    let cfgAcceptTypes = editor.getCfg("image.accept.types") || "";
    const cfgUploadAcceptFiles = editor.getCfg("image.upload.accept.files") || 0,
    cfgMaxSize = editor.getCfg("image.upload.max.size") || 0,
    cfgMaxSizePerFile = editor.getCfg("image.upload.max.size.per.file") || 0;
    content.innerHTML = '';
    editor.dom.appendString2Node('<div class="padding"><div class="uploadcontainer"><strong>'+editor.ln("drop or click to upload image")+'</strong><input type="file" name="file" '+(cfgUploadAcceptFiles > 0 ? "multiple" : "")+'></div></div>', content);
    editor.toolbar?.adjustContentPosition(content);
    editor.toolbar!.insertCloseButton(content.parentElement!.parentElement!);
    const input = content.querySelector('input[type="file"]') as HTMLInputElement, uploadContainer = input.parentElement!;
    if(cfgAcceptTypes) input.setAttribute("accept",cfgAcceptTypes);
    //reset cache for store upload result data
    editor.cachedList["image.upload.result.list"] = [];

    let previewGrid : HTMLElement, gridContainer : HTMLElement, uploadAgainBtn : HTMLButtonElement, insertBtn : HTMLButtonElement;
    const onFiles = (files : FileList) =>{
        
        uploadContainer.style.display = "none";
        if(!content.querySelector(".FileTileImageGridContainer")) {

            previewGrid = document.createElement("div");
            previewGrid.classList.add("FileTileImageGrid");
            gridContainer = document.createElement("div");
            gridContainer.classList.add("FileTileImageGridContainer");
            gridContainer.appendChild(previewGrid);
            uploadContainer.parentElement!.appendChild(gridContainer);
            const footer = document.createElement("div");
            if(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")) {
                uploadContainer.parentElement!.removeChild(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")!);
            }
            footer.classList.add("FileTileImageGridFooter");
            uploadContainer.parentElement!.appendChild(footer);
            
            
            //gridContainer.appendChild(footer);

            insertBtn = document.createElement("button");
            insertBtn.innerHTML = editor.ln("UPLOADING...");//editor.ln("INSERT UPLOADED IMAGE");
            insertBtn.setAttribute("disabled","disabled");
            insertBtn.setAttribute("class","button insert");
            footer.appendChild(insertBtn);
            uploadAgainBtn = document.createElement("button");
            uploadAgainBtn.innerHTML = editor.ln("START OVER");
            uploadAgainBtn.setAttribute("class","se-button upload_again");
            uploadAgainBtn.style.display = "none";
            insertBtn.parentElement!.insertBefore(uploadAgainBtn, insertBtn);
            //start over:
            uploadAgainBtn.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                renderUpload(editor, content);
                return false;
            });
            //do insert:
            insertBtn.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                //variables are stored in cache
                editor.command("image",["upload"]);
                editor.toolbar!.hideDropdown();
                return false;
            });
        } else {
            gridContainer = content.querySelector(".FileTileImageGridContainer") as HTMLElement;
            previewGrid = content.querySelector(".FileTileImageGrid") as HTMLElement;
            uploadAgainBtn = content.querySelector(".upload_again") as HTMLButtonElement;
            insertBtn = content.querySelector(".insert") as HTMLButtonElement;
        }

        let count = previewGrid.querySelectorAll("button").length, completed = count, failed = 0;

        //check size:
        if(cfgMaxSize > 0 || cfgMaxSizePerFile > 0) {
            let err_size = false, err_size_per_file = false, total_size = 0;
            Array.from(files).forEach(file => {
                if(cfgMaxSizePerFile > 0 && file.size/1048576 > cfgMaxSizePerFile) {
                    err_size_per_file = true;
                }
                total_size += file.size;
                if(cfgMaxSize > 0 && total_size/1048576 > cfgMaxSize) {
                    err_size = true;
                }
            });
            if(err_size || err_size_per_file) {
                uploadContainer.style.display = "";
                gridContainer.remove();
                if(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")) {
                    uploadContainer.parentElement!.removeChild(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")!);
                }
                const text = uploadContainer.querySelector("strong")!;
                const cachedText = text.innerHTML;//drop or upload..
                let errText = "";
                if(err_size) errText = "<small>"+editor.ln("max allowed size of all files in total should be ")+" "+cfgMaxSize+"MB. </small>";
                if(err_size_per_file) errText += "<small>"+editor.ln("max allowed size per file should be ")+" "+cfgMaxSizePerFile+"MB. </small>";
                text.innerHTML = errText;
                
                setTimeout(() => {
                    text.innerHTML = cachedText;
                }, 5000);
                return;
            }
        }
        
        
        Array.from(files).forEach(file => {
            //test type and universal type, such as image/*:
            if(cfgAcceptTypes.indexOf(file.type) === -1 && cfgAcceptTypes.indexOf(file.type.substring(0,file.type.indexOf(""))+"/*") === -1) return;
            
            if(cfgUploadAcceptFiles > 0 && count+1 > cfgUploadAcceptFiles) return;
            count++;
            const tile = document.createElement("button");
            editor.dom.appendString2Node('<figure><figure><span class="text">uploading 0%</span></figure></figure><span class="caption">'+file.name+'</span>', tile);
            tile.addEventListener("click", (e) => {e.preventDefault();e.stopPropagation();return false;});
            previewGrid.appendChild(tile);
            editor.cachedList["image.upload.result.list"].push({});
            processUpload(editor, count-1, file, tile, (status : boolean) => {
                completed++;
                if(!status) failed++;
                if(completed >= count) {
                    content.querySelector(".FileTileImageGrid button.upload")?.remove();
                    //end of upload
                    if(failed > 0 && completed === failed) {
                        uploadAgainBtn.style.display = "";
                        insertBtn.style.display = "none";
                    }
                    else {
                        insertBtn.removeAttribute("disabled");
                        insertBtn.innerHTML = editor.ln("insert");
                        //if allow to upload more
                        if(cfgUploadAcceptFiles === 0 || count < cfgUploadAcceptFiles) {
                            const dropBtnTile = document.createElement("button");
                            dropBtnTile.setAttribute("class","upload");
                            dropBtnTile.innerHTML = SubEditor.svgList["plus"];
                            previewGrid.appendChild(dropBtnTile);
                            const inputTile = document.createElement("input");
                            inputTile.setAttribute("type","file");
                            if(cfgUploadAcceptFiles === 0 || cfgUploadAcceptFiles - count > 1) {
                                inputTile.setAttribute("multiple","");
                            }
                            dropBtnTile.appendChild(inputTile);
                            dropBtnTile.addEventListener("drop", (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if(!e.dataTransfer!.files || !e.dataTransfer!.files.length) return;
                                onFiles(e.dataTransfer!.files);
                            });
                            
                            inputTile.addEventListener("change", (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const target = e.target as HTMLInputElement;
                                if((target as any)._mockfiles !== "undefined") {
                                    onFiles((target as any)._mockfiles);
                                    return;
                                  }
                                if(!target.files || target.files.length === 0) return;
                                onFiles(target.files);
                                
                            });
                        }
                    }
                }
            });
            editor.toolbar!.adjustContentPosition(content);
        });
        if(count === 0) {
            //no files with matching type detected
            uploadContainer.style.display = "";
            gridContainer.remove();
            if(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")) {
                uploadContainer.parentElement!.removeChild(uploadContainer.parentElement!.querySelector(".FileTileImageGridFooter")!);
            }
            const text = uploadContainer.querySelector("strong")!;
            const cachedText = text.innerHTML;//drop or upload..
            text.innerHTML = "<small>"+editor.ln("please select the appropriate file types:")+" "+cfgAcceptTypes+"</small>";
            setTimeout(() => {
                text.innerHTML = cachedText;
            }, 5000);
        }
    }
    //.uploadcontainer as drop target
    uploadContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!e.dataTransfer!.files || !e.dataTransfer!.files.length) return;
        onFiles(e.dataTransfer!.files);
    });
    
    input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLInputElement;
        if((target as any)._mockfiles !== "undefined") {
            onFiles((target as any)._mockfiles);
            return;
          }
        if(!target.files || target.files.length === 0) return;
        onFiles(target.files);
        
    });
}
const renderURL = (editor : SubEditor, content : HTMLElement) => {
    content.classList.remove("horizontal");
    content.innerHTML = '';
    editor.dom.appendString2Node('<div class="padding"><div class="se-dropdown-item"><input type="text" name="url"><label>'+ editor.ln("image url")+'</label></div><div style="text-align: right;margin-right:5px"><button class="se-button insert">'+ editor.ln("insert")+'</button></div></div>', content);
    editor.toolbar!.insertCloseButton(content.parentElement!.parentElement!);
    editor.toolbar?.adjustContentPosition(content);
    content.querySelector("button.insert")!.addEventListener("click", (e) =>{
        e.preventDefault();
        e.stopPropagation();
        const url = content.querySelector("input")!.value || "";
        if(url) {
            editor.command("image",["url", url]);
            editor.toolbar!.hideDropdown();
        }
        return false;
    });
}
export default [
{
    event : "registerSvg",
    target : [],
    callback : () : {[key: string]: string} => {
        return {"test" : SubEditor.svgList["b"]};
    }
},
{
    event : "registerCss",
    target : [],
    callback : () : {[key: string]: string} => {
        return {};
        //return {"image" : ".FileTileImageGridPagination > .se-button{border-color:red;}"};
    }
},
{
    event : "registerLanguage",
    target : [],
    callback : () : {[key: string]:{[key: string]: string}} => {
        const ln : {[key: string]:{[key: string]: string}} = {};
        ln["en"] = {
            "image" : "image",
            "uploading" : "uploading",
            "upload failed" : "upload failed",
            "drop or click to upload image" : "drop or click to upload image",
            "insert" : "insert",
            "please select the appropriate file types:" : "please select the appropriate file types:",
            "max allowed size per file should be " : "max allowed size per file should be ",
            "max allowed size of all files in total should be " : "max allowed size of all files in total should be ",
            "UPLOADING..." : "UPLOADING...",
            "START OVER" : "START OVER"
        };
        return ln;
    }
},
{
    event : "registerToolbarItem",
    target : [],
    callback : (editor : SubEditor) : {[key : string] : ToolbarItem} => {
        return {
            library : {
                command : "library",
                svg : SubEditor.svgList["image_library"],
                tips : editor.ln("image library"),
                dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="'+ editor.ln("image library")+'"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-image"><span></span><span class="se-icon">'+SubEditor.svgList["image_library"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-image" role="menu"><div class="se-dropdown-content se-control"></div></div></div>',
                onRender : (_editor : SubEditor, el : HTMLElement) => {
                    const menu = el.querySelector('.se-dropdown-menu')!;
                    el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
                        if(!menu.classList.contains("is-active")) {
                            //to be open:
                            //cache selection, typing in input lose selection
                            editor.setCache("currentSelection", _editor.selection!);
                            //make sure feature is ready
                            _editor.handleFeature();
                            //render sub menu:
                            const cfg = getCfg(editor), 
                            content = el.querySelector(".se-dropdown-content") as HTMLElement;
                            if(!content.querySelector(".ImageLibrary")) {
                                if(typeof cfg["image.library.fetch"] !== "function") return;
                                renderLibrary(_editor, content);
                            }
                            //will show previous library without the need to re-rendering
                        }
                    });
                }
            }
        };
    }
},
{
    event : "registerToolbarItem",
    target : [],
    callback : (editor : SubEditor) : {[key : string] : ToolbarItem} => {
        //toolbar item
        return {
            image : {
            command : "image",
            svg : SubEditor.svgList["image"],
            tips : editor.ln("image"),
          dropdowncontent : '<div class="se-dropdown se-ToolbarItem" data-tips="'+ editor.ln("image")+'"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-image"><span></span><span class="se-icon">'+SubEditor.svgList["image"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-image" role="menu"><div class="se-dropdown-content se-control"></div></div></div>',
            onRender : (_editor : SubEditor, el : HTMLElement) => {
    
                const menu = el.querySelector('.se-dropdown-menu')!;
                el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
                    if(!menu.classList.contains("is-active")) {
                        //to be open:
                        //cache selection, typing in input lose selection
                        editor.setCache("currentSelection", _editor.selection!);
                        //make sure feature is ready
                        _editor.handleFeature();
                        //render sub menu:
                        const cfg = getCfg(editor), cfgFeatures : string[] = cfg["image.features"] || [], 
                        content = el.querySelector(".se-dropdown-content") as HTMLElement;
                        if(cfgFeatures.length === 1 && cfgFeatures[0] === "library") {
                            if(!content.querySelector(".ImageLibrary")) {
                                if(typeof cfg["image.library.fetch"] !== "function") return;
                                renderLibrary(_editor, content);
                            }
                            //will show previous library without the need to re-rendering
                        }
                        else if(cfgFeatures.length === 0 || (cfgFeatures.length === 1 && cfgFeatures[0] === "url")) {
                            //only use url
                            renderURL(_editor, content);
                        } else {
                            //sub menu:
                            content.classList.add("horizontal");
                            content.innerHTML = "";
                            cfgFeatures.forEach((f : string) => {
                                switch(f) {
                                    case 'url':
                                        editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="'+f+'" data-value="'+f+'" data-tips="image '+f+'"><span class="se-icon">'+SubEditor.svgList["link"]+'</span></span>',content);
                                        content.querySelector('span.se-button[data-value="url"]')!.addEventListener("click", (e) => {renderURL(_editor, content);e.preventDefault();e.stopPropagation();return false;});
                                    break;
                                    case 'upload':
                                        if(!cfg["image.upload.url"]) return;
                                        editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="'+f+'" data-value="'+f+'" data-tips="image '+f+'"><span class="se-icon">'+SubEditor.svgList["upload"]+'</span></span>',content);
                                        content.querySelector('span.se-button[data-value="upload"]')!.addEventListener("click", (e) => {renderUpload(_editor, content);e.preventDefault();e.stopPropagation();return false;});
                                    break;
                                    case 'library':
                                        if(typeof cfg["image.library.fetch"] !== "function") return;
                                        editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="'+f+'" data-value="'+f+'" data-tips="image '+f+'"><span class="se-icon">'+SubEditor.svgList["image_library"]+'</span></span>',content);
                                        content.querySelector('span.se-button[data-value="library"]')!.addEventListener("click", (e) => {renderLibrary(_editor, content);e.preventDefault();e.stopPropagation();return false;});
                                    break;
                                }
                            });
                            
                        }
                        
                    }
                  });
    
                
            }
            }
        };
    }
},
{
    event : "onCommand",
    target : ["image"],
    callback : (editor :SubEditor, type : string, action : string, value : any) => {
        //type= image,action=url,upload,library, value=string,url
        const {range} = editor.getSelectionRange();
        
        
        let nodes : HTMLElement[] = [];
        if(action === "upload") {
            const _nodes : HTMLElement[] = [];
            editor.cachedList["image.upload.result.list"].forEach((n : any) => {
                if(n.status === "failed") return;
                if(typeof n.elFunc === "function") {
                    _nodes.push(n.elFunc());
                    return;
                }
                //determine if it is image or file:
                if(n.type.indexOf("image/") !== -1) {
                    const _node = document.createElement("img");
                    _node.setAttribute("data-action", action);
                    _node.setAttribute("src", n.url);
                    _node.setAttribute("style","max-width:100%");
                    _nodes.push(_node);
                } else {
                    const _node = document.createElement("a");
                    _node.setAttribute("data-action", action);
                    _node.setAttribute("href", n.url);
                    _node.setAttribute("target","_blank");
                    _node.innerHTML = n.name;
                    _nodes.push(_node);
                }
            });
            //seperator
            nodes = [];
            for(let i2 = 0, t = _nodes.length; i2 < t; i2++) {
                nodes.push(_nodes[i2]);
                if(i2 < t - 1) nodes.push(document.createElement("br"));
            }
        } else if (action === 'library') {
            if(typeof value.elFunc === "function") {
                nodes.push(value.elFunc());
            } else if(value.type && value.url){
                //determine if it is image or file:
                if(value.type.indexOf("image/") !== -1) {
                    const _node = document.createElement("img");
                    _node.setAttribute("data-action", action);
                    _node.setAttribute("src", value.url);
                    _node.setAttribute("style","max-width:100%");
                    nodes.push(_node);
                } else {
                    const _node = document.createElement("a");
                    _node.setAttribute("data-action", action);
                    _node.setAttribute("href", value.url);
                    _node.setAttribute("target","_blank");
                    _node.innerHTML = value.name || value.url;
                    nodes.push(_node);
                }
            }
        } else if (action === "url") {
            const node = document.createElement("img");
            node.setAttribute("data-action", action);
            node.setAttribute("src", value);
            node.setAttribute("style","max-width:100%");
            nodes.push(node);
        }
        //image is not allowed in code
        if(range.endContainer.parentElement!.nodeName === "CODE") {
            let el = range.endContainer.parentElement as HTMLElement;
            if(el.parentElement!.nodeName === "PRE") el = el.parentElement as HTMLElement;
            editor.dom.nodesInsertAfter(nodes,el);
        } else {
            range.deleteContents();
            nodes.reverse();
            nodes.forEach(n => range.insertNode(n));
            range.setEndAfter(nodes[nodes.length-1]);
            //fix insert at table or list:
            for(var i = nodes.length -1; i >= 0;i--) {
                if(["TABLE","UL","OL"].indexOf(nodes[i].parentElement!.nodeName) !== -1) {
                    editor.dom.nodesInsertAfter([nodes[i]],nodes[i].parentElement!);
                }
            }
        }
        
        if(editor.refContent.lastChild === nodes[0]) {
            if(editor.refContent.lastElementChild?.previousElementSibling?.nodeName === "P") {
                //create a new paragraph
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
                range.setEndBefore(p.childNodes[0]);
            } else {
                editor.refContent.appendChild(document.createElement("br"));
                range.setEndAfter(editor.refContent.lastChild);
            }
            
        } 
        range.collapse(false);
        editor.triggerChange();
    }
}] as SubEditorEvent[];