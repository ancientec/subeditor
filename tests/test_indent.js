describe('indent', () => {
    it('indent when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("indent", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<p style="padding-left: 40px;"><br></p>');
    });
    it('indent paragraph', () => {
        const str = "<p><span><strong>text content</strong></span><img></p>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("indent");
        chai.expect(editor2.value().replace("padding-left: 40px;","padding-left:40px").replace("padding-left:40px;","padding-left:40px")).to.equal("<p style=\"padding-left:40px\"><span><strong>text content</strong></span><img></p>");
    });
    it('indent again', () => {
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("indent");
        chai.expect(editor2.value().replace("padding-left: 80px;","padding-left:80px").replace("padding-left:80px;","padding-left:80px")).to.equal("<p style=\"padding-left:80px\"><span><strong>text content</strong></span><img></p>");
        
    });
    it('outdent', () => {
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("outdent");
        chai.expect(editor2.value().replace("padding-left: 40px;","padding-left:40px").replace("padding-left:40px;","padding-left:40px")).to.equal("<p style=\"padding-left:40px\"><span><strong>text content</strong></span><img></p>");
    });
    it('outdent again', () => {
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("outdent");
        chai.expect(editor2.value()).to.equal("<p style=\"\"><span><strong>text content</strong></span><img></p>");
    });
    it('outdent no effect', () => {
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("outdent");
        chai.expect(editor2.value()).to.equal("<p style=\"\"><span><strong>text content</strong></span><img></p>");
    });
    it('indent wrap paragraph', () => {
        const str = "<span><strong>text content</strong></span>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("indent");
        chai.expect(editor2.value().replace("padding-left: 40px;","padding-left:40px").replace("padding-left:40px;","padding-left:40px")).to.equal("<p style=\"padding-left:40px\"><span><strong>text content</strong></span></p>");
    });
    it('indent li', () => {
        const str = "<ol><li><strong>text content</strong></li></ol>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("indent");
        chai.expect(editor2.value().replace("padding-left: 40px;","padding-left:40px").replace("padding-left:40px;","padding-left:40px")).to.equal("<ol><li style=\"padding-left:40px\"><strong>text content</strong></li></ol>");
    });
    it('indent td', () => {
        const str = "<table><tbody><tr><td><strong>text content</strong></td></tr></tbody></table>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("indent");
        chai.expect(editor2.value().replace("padding-left: 40px;","padding-left:40px").replace("padding-left:40px;","padding-left:40px")).to.equal("<table><tbody><tr><td style=\"padding-left:40px\"><strong>text content</strong></td></tr></tbody></table>");
    });
    it('indent tds', () => {
        const str = "<table><tbody><tr><td><strong>text content</strong></td><td>text content</td><td>text content</td><td><em>text content</em></td><td>text content</td></tr></tbody></table>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("strong").childNodes[0], 5);
        range.setEnd(editor2.refContent.querySelector("em").childNodes[0], 5);
        sel.addRange(range);
       
        editor2.command("indent");
        chai.expect(editor2.value().replace(/padding-left: 40px;/g,"padding-left:40px").replace(/padding-left:40px;/g,"padding-left:40px")).to.equal('<table><tbody><tr><td style="padding-left:40px"><strong>text content</strong></td><td style="padding-left:40px">text content</td><td style="padding-left:40px">text content</td><td style="padding-left:40px"><em>text content</em></td><td>text content</td></tr></tbody></table>');
    });

    it('custom indent size', () => {
        editor1.destroy();
        initEditor1({cfgList : {"indent.size" : 30}});
        const str = "<p><span><strong>text content</strong></span><img></p>";
        editor1.refContent.innerHTML = str;
        
        editor1.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setEnd(editor1.refContent.querySelector("strong").childNodes[0], 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor1.command("indent");
        chai.expect(editor1.value().replace("padding-left: 30px;","padding-left:30px").replace("padding-left:30px;","padding-left:30px")).to.equal("<p style=\"padding-left:30px\"><span><strong>text content</strong></span><img></p>");
        editor1.destroy();
        initEditor1();
    });

});