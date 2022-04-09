describe('list', () => {
    it('insert', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        editor2.command("ol", []);
        
        chai.expect(editor2.value()).to.equal("<ol><li></li></ol>");
    });
    it('change ol->ul', () => {
        editor2.refContent.innerHTML = "<ol><li>111</li><li>222</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol").firstChild.firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("ol").firstChild.firstChild, 1);
        range.collapse(false);
        sel.addRange(range);
        editor2.command("ul", []);
        
        chai.expect(editor2.value()).to.equal("<ul><li>111</li><li>222</li></ul>");
    });
    it('unwrap one li', () => {
        editor2.refContent.innerHTML = "<ol><li>111</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol").firstChild.firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("ol").firstChild.firstChild, 1);
        range.collapse(false);
        sel.addRange(range);
        editor2.command("ol", []);
        
        chai.expect(editor2.value()).to.equal("111");
    });
    it('unwrap all li', () => {
        editor2.refContent.innerHTML = "<ol><li>111</li><li>222</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol").firstChild.firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("ol").lastChild.firstChild, 1);
        sel.addRange(range);
        editor2.command("ol", []);
        
        chai.expect(editor2.value()).to.equal("111<br>222");
    });
    it('unwrap some li', () => {
        editor2.refContent.innerHTML = "<ol><li>111</li><li>222</li><li>333</li><li>444</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol").childNodes[1].firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("ol").childNodes[2].firstChild, 1);
        sel.addRange(range);
        editor2.command("ol", []);
        
        chai.expect(editor2.value()).to.equal("<ol><li>111</li></ol>222<br>333<br><ol><li>444</li></ol>");
    });
    it('sublist', () => {
        editor2.refContent.innerHTML = "<ol><li>111</li><li>222</li><li>333</li><li>444</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol").childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("ol").childNodes[2].firstChild, 1);
        sel.addRange(range);
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Tab",
            keyCode: 9, // example values.
            code: "Tab", // put everything you need in this object.
            which: 9,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        
        chai.expect(editor2.value()).to.equal("<ol><li>111<ul><li>222</li><li>333</li></ul></li><li>444</li></ol>");
    });
    it('backspace to unwrap sublist', () => {
        editor2.refContent.innerHTML = "<ol><li>111<ul><li>222</li><li>333</li></ul></li><li>444</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ul").childNodes[0].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("ul").childNodes[1].firstChild, 1);
        sel.addRange(range);
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Backspace",
            keyCode: 8, // example values.
            code: "Backspace", // put everything you need in this object.
            which: 8,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        
        chai.expect(editor2.value()).to.equal("<ol><li>111</li><li>222</li><li>333</li><li>444</li></ol>");
    });
    
});