describe('align', () => {
    it('insert when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("align", ["center"]);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<p style="text-align:center"><br></p>');
    });
    it('end in root div', () => {
        const str = "plain text content";
        const length = str.length;
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], length);
        range.setEnd(editor2.refContent.childNodes[0], length);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("align", ["center"]);
        chai.expect(editor2.value().replace("center;","center")).to.equal("<p style=\"text-align:center\">"+str+"</p>");
    });
    it('middle in root div', () => {
        const str = "plain text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0], 10);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("align", ["center"]);
        chai.expect(editor2.value().replace("center;","center")).to.equal("<p style=\"text-align:center\">"+str+"</p>");
    });
    it('partial both', () => {
        const str = "plain text<img>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[2], 4);
        sel.addRange(range);
        editor2.command("align", ["center"]);
        chai.expect(editor2.value().replace("center;","center")).to.equal('<p style="text-align:center">plain text<img>text content</p>');
    });
    it('multiple level', () => {
        const str = "plain text<img><ol><li>111</li><li>222</li><li>333</li></ol><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.</td></tr></tbody></table>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[4], 4);
        sel.addRange(range);
        editor2.command("align", ["center"]);
        chai.expect(editor2.value().replace("center;","center")).to.equal('<p style="text-align:center">plain text<img></p><ol><li style="text-align:center">111</li><li style="text-align:center;">222</li><li style="text-align:center;">333</li></ol><table><tbody><tr><td style="text-align:center;">1.1</td><td style="text-align:center;">1.2</td></tr><tr><td style="text-align:center;">2.1</td><td style="text-align:center;">2.</td></tr></tbody></table><p style="text-align:center">text content</p>');

        //reset 
        editor2.selection = null;
    });
});