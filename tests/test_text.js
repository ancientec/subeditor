describe('text', () => {
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
       
        editor2.command("bold", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<strong><br></strong>');
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
       
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal("<strong>"+str+"</strong>");
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
       
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal("<strong>"+str+"</strong>");
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
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('plain <strong>text</strong><img><strong>text</strong> content');
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
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('plain <strong>text</strong><img><ol><li><strong>111</strong></li><li><strong>222</strong></li><li><strong>333</strong></li></ol><table><tbody><tr><td><strong>1.1</strong></td><td><strong>1.2</strong></td></tr><tr><td><strong>2.1</strong></td><td><strong>2.</strong></td></tr></tbody></table><strong>text</strong> content');

        //reset 
        editor2.selection = null;
    });
    it('unwrap', () => {
        const str = "<img><strong>plain text</strong><img>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[3], 4);
        sel.addRange(range);
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('<img>plain text<img>text content');
    });
    it('unwrap when first text node is bold', () => {
        const str = "<img><strong><u><i>plain text</i></u></strong><img>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("i").childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[3], 4);
        sel.addRange(range);
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('<img><u><i>plain text</i></u><img>text content');
    });
    it('wrap when format is before paragraph', () => {
        const str = "<img><strong><p><i>plain text</i></p></strong><img>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("i").childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[3], 4);
        sel.addRange(range);
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('<img><strong><p><i><strong>plain text</strong></i></p></strong><img><strong>text</strong> content');
    });
    it('merge tags', () => {
        const str = "<strong>bold text</strong>text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[1], 0);
        range.setEnd(editor2.refContent.childNodes[1], 4);
        sel.addRange(range);
        editor2.command("bold");
        chai.expect(editor2.value()).to.equal('<strong>bold texttext</strong> content');
    });
});