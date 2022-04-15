

var changeFn = (change) => {};
var editor1,editor2;
var destroyEditor1 = () => {
    editor1.destroy();
};
var destroyEditor2 = () => {
    editor2.destroy();
};
var initEditor1 = (opts) => {
    editor1 = new SubEditor(document.querySelector('#editor1'), Object.assign({}, {
        width : 450, 
        height:250,
        value : '',
        autoGrow : true,
        pluginList : ["fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list", "table","image"],
        onChange : function(change) {changeFn(change); },
        toolbarList : ["undo","redo","nextline","text","text","text","text","|","bold","italic","underline","strikethrough","subscript","superscript","nextline","format","|","paragraph","h1","h2","h3","h4","h5","h6","blockquote","code","nextline","link","remove_format","seperator","indent","outdent","nextline","color","backgroundcolor","nextline","align","align_left","align_center","align_right","align_justify","spacer","ol","ul","nextline","image", "library","spacer","table","hr","source","spacer","spacer","spacer","fullscreen"]
    
    }, opts || {}));
};
var initEditor2 = (opts) => {
    editor2 = new SubEditor(document.querySelector('#editor2'),  Object.assign({}, {
        onChange : function(change) { changeFn(change);},
        pluginList : ["fullscreen","hr", "color","source","align","text","undo","redo","indent","format","remove_format","link", "paste","list", "table","image"],
        toolbarList : ["undo","redo","text","format","link","remove_format","indent","outdent","color","backgroundcolor","align","ol","ul","image", "library","table","hr","source","fullscreen"]
    
    }, opts || {}));
};

initEditor1();

initEditor2();

describe('init', () => {


    it('insert into div', () => {
      chai.expect(document.querySelector('#editor1')).to.equal(editor1.refEditor.parentElement);
      chai.expect(editor1.refTextarea.value).to.equal(editor1.refContent.innerHTML);
    });
    it('attach to textarea', () => {
        chai.expect(document.querySelector('#editor2').parentElement).to.equal(editor2.refEditor.parentElement);
        chai.expect(document.querySelector('#editor2').previousElementSibling).to.equal(editor2.refEditor);
        chai.expect(editor2.refTextarea.value).to.equal(editor2.refContent.innerHTML);
    });

});
describe('destroy', () => {
    it('instance exists', () => {
        chai.expect(document.querySelector('#editor1')._SubEditor).to.equal(editor1);
    });
    it('instance destroy', () => {
        destroyEditor1();
        chai.expect(document.querySelector('#editor1')._SubEditor).to.equal(undefined);
        editor1 = undefined;
        initEditor1();
    });
    
    
});
describe('test language', () => {

    it('new language', () => {
        destroyEditor1();
        var enx = Object.assign({}, SubEditor.langList.en, {
            "bold" : "boldx",
            "italic" : "italicx",
        });
        initEditor1({langList : {enx : enx}, lang : "enx"});
        chai.expect(editor1.ln("bold")).to.equal( "boldx");
    });
    it('add/replace to existing language', () => {
        destroyEditor1();
        var en = Object.assign({}, SubEditor.langList.en, {
            "bold" : "boldx",
            "italic" : "italicx",
            "new_string" : "new string"
        });
        initEditor1({langList : {en : en}, lang : "en"});
        chai.expect(editor1.ln("bold")).to.equal( "boldx");
        chai.expect(editor1.ln("new_string")).to.equal( "new string");
        destroyEditor1();
        initEditor1();
    });
    it('language function', () => {
        destroyEditor1();
        var lnFunction = (str) => {
            return str === "bold" ? "boldy" : str;
        }
        initEditor1({ln : lnFunction});
        chai.expect(editor1.ln("bold")).to.equal( "boldy");
        chai.expect(editor1.ln("new_string")).to.equal( "new_string");
        destroyEditor1();
        initEditor1();
    });
    it('static new language', () => {
        
        destroyEditor1();
        var eny = Object.assign({}, SubEditor.langList.en, {
            "bold" : "boldy",
            "italic" : "italicy",
        });
        SubEditor.presetLang({eny : eny});
        initEditor1({lang : "eny"});
        chai.expect(editor1.ln("bold")).to.equal( "boldy");
    });
    it('static replace language', () => {
        var eny = Object.assign({}, SubEditor.langList.en, {
            "bold" : "boldyy",
            "italic" : "italicyy",
        });
        SubEditor.presetLang({eny : eny});
        chai.expect(editor1.ln("bold")).to.equal( "boldyy");
    });
    
    
});
describe('onChange', () => {
    var changed = null;
    changeFn = (change) => { changed = change;};
    editor2.refContent.innerHTML = "change#1,key=1";
    editor2.triggerChange();
    
    it('change expected', () => {
        chai.expect(changed.key).to.equal(1);
        chai.expect(changed.content).to.equal("change#1,key=1");
        changeFn = (change) => {};
    });
    it('textarea should sync', () => {
        chai.expect(editor2.refContent.innerHTML).to.equal(editor2.refTextarea.value);
    });
    
    
});

describe('selection changed', () => {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(editor2.refContent.childNodes[0], 0);
    range.setEnd(editor2.refContent.childNodes[editor2.refContent.childNodes.length - 1], editor2.refContent.childNodes[editor2.refContent.childNodes.length - 1].length);
    sel.removeAllRanges();
    sel.addRange(range);
        
    it('selection changed to editor1', (done) => {
        var range = document.createRange();
        var sel = window.getSelection();
        editor1.refContent.innerHTML = "xxxx";
        range.setStart(editor1.refContent.childNodes[0], 0);
        range.setEnd(editor1.refContent.childNodes[editor1.refContent.childNodes.length - 1], editor1.refContent.childNodes[editor1.refContent.childNodes.length - 1].length);
        sel.removeAllRanges();
        sel.addRange(range);
        setTimeout(() => {
            chai.expect(editor2.selection).to.equal(undefined);
            done();
        }, 0);
    });
    it('selection changed to editor2', (done) => {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[editor2.refContent.childNodes.length - 1], editor2.refContent.childNodes[editor2.refContent.childNodes.length - 1].length);
        sel.removeAllRanges();
        sel.addRange(range);
        setTimeout(() => {
            chai.expect(editor1.selection).to.equal(undefined);
            editor1.refContent.innerHTML = "";
            done();
        }, 0);
    });    
    
});

describe('footer', () => {
    
    it('show footer', () => {
        editor1.enableFooter(15);
        chai.expect(editor1.refFooter.style.height).to.equal("15px");
        chai.expect(editor1.refFooter.style.display).to.equal("block");
    });
    it('hide footer', () => {
        editor1.disableFooter();
        chai.expect(editor1.refFooter.style.display).to.equal("none");
    });
    
    
});
describe('autogrow', () => {
    
    it('editor1 auto grow - defined hight', () => {
        editor1.refContent.innerHTML = '';
        editor1.refContent.appendChild(document.createElement("div"));
        editor1.refContent.childNodes[0].style.height = "1000px";
        editor1.refContent.childNodes[0].style.width = "100%";
        editor1.refContent.childNodes[0].innerHTML = "111";
        editor1.setAutoGrow(true);
        editor1.refContent.dispatchEvent(new Event("input"));
        chai.expect(editor1.refContent.parentElement.style.height).to.equal("1000px");
    });
    it('editor1 disable auto grow - defined hight', () => {
        editor1.setAutoGrow(false);
        //config height=250-2border
        chai.expect(editor1.refEditor.clientHeight).to.equal(248);
        
    });

    var cached_height = 0;
    it('editor2 auto grow - defined textarea height', () => {
        cached_height = editor2.refEditor.clientHeight;
        editor2.refContent.innerHTML = '';
        editor2.refContent.appendChild(document.createElement("div"));
        editor2.refContent.childNodes[0].style.height = "1000px";
        editor2.refContent.childNodes[0].style.width = "100%";
        editor2.refContent.childNodes[0].innerHTML = "111";
        editor2.setAutoGrow(true);
        editor2.refContent.dispatchEvent(new Event("input"));
        chai.expect(editor2.refContent.parentElement.style.height).to.equal("1000px");
    });
    it('editor2 disable auto grow - defined textarea height', () => {
        editor2.setAutoGrow(false);
        chai.expect(editor2.refEditor.clientHeight).to.equal(cached_height);
        editor2.changeValue('');
        
    });
    
    
});

describe('preset plugin', () => {
    it('add new preset plugin', (done) => {
        var log = [{
            event : "onCommand",
            target : ["log"],
            callback : (editor, cmd, value)  => {
                chai.expect(value).to.equal("logme");
            }
        },{
            event : "onCommand",
            target : ["log2"],
            callback : (editor, cmd, value)  => {
                chai.expect(value).to.equal("logme2");
                done();
            }
        }];
        SubEditor.presetPlugin("log", log);
        destroyEditor1();
        initEditor1({pluginList : ["log"]});
        editor1.command("log", ["logme"]);
        editor1.command("log2", ["logme2"]);

    });
});

describe('preset toolbar', () => {
    it('add new preset toobar item', () => {
        var boldx = function(editor) {
            return {
                command : "boldx",
                svg : SubEditor.svgList["b"],
                tips : "bold",
                onRender : (_editor, el) => {
                    el.addEventListener('click', (e) => {
                    const cmd = el.getAttribute("data-command");
                    _editor.command(cmd,[]);
                    });
                }
            }
        };
        SubEditor.presetToolbarItem("boldx", boldx);
        destroyEditor1();
        initEditor1({toolbarList : ["boldx"]});
        chai.expect(editor1.refToolbar.querySelector(".se-ToolbarItem").getAttribute("data-command")).to.equal("boldx");
    });
});

describe('preset css', () => {
    it('add new preset css', () => {
        SubEditor.presetCss(".newcssstyle{color:red}");
        destroyEditor1();
        initEditor1();
        chai.expect(document.querySelector("#SubEditorStyle").innerHTML.indexOf(".newcssstyle")).not.to.equal(-1);
    });
});