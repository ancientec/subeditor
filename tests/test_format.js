describe('format', () => {
    it('insert h1 when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("h1", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<h1><br></h1><p><br></p>');
    });
    it('wrap h1', () => {
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
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<h1>"+str+"</h1><br>");
    });
    it('replace h1 to h2', () => {
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("h1").childNodes[0], 0);
        range.setEnd(editor2.refContent.querySelector("h1").childNodes[0], 2);
        sel.addRange(range);
        editor2.command("h2");
        chai.expect(editor2.value()).to.equal("<h2>plain text content</h2><br>");
    });
    it('unwrap h2', () => {
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("h2").childNodes[0], 0);
        range.setEnd(editor2.refContent.querySelector("h2").childNodes[0], 2);
        sel.addRange(range);
        editor2.command("h2");
        chai.expect(editor2.value()).to.equal("plain text content<br>");
    });
    it('convert paragraph', () => {

        editor2.refContent.innerHTML = '<p>title</p>';
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 1);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 1);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal('<h1>title</h1>');
    });
    it('break paragraph 1', () => {

        editor2.refContent.innerHTML = '<p><img id="1">title<img id="2"> content</p>';
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[1], 1);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[1], 1);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal('<p><img id="1"></p><h1>title</h1><p><img id="2"> content</p>');
    });
    it('break paragraph 2', () => {

        editor2.refContent.innerHTML = "<p>title<img> content</p>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<h1>title</h1><p><img> content</p>");
    });
    it('paragraph partial text - middle', () => {

        editor2.refContent.innerHTML = "<p>abc title content</p>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 4);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 9);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<p>abc </p><h1>title</h1><p> content</p>");
    });
    it('paragraph partial text - start', () => {

        editor2.refContent.innerHTML = "<p>title content</p>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 5);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<h1>title</h1><p> content</p>");
    });
    it('paragraph partial text - end', () => {

        editor2.refContent.innerHTML = "<p>abc title</p>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 4);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 9);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<p>abc </p><h1>title</h1><p><br></p>");
    });
    it('partial text - middle', () => {

        editor2.refContent.innerHTML = "abc title content";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 4);
        range.setEnd(editor2.refContent.childNodes[0], 9);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("abc <h1>title</h1> content");
    });
    it('partial text - start', () => {

        editor2.refContent.innerHTML = "title content";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0], 5);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<h1>title</h1> content");
    });
    it('partial text - end', () => {

        editor2.refContent.innerHTML = "abc title";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 4);
        range.setEnd(editor2.refContent.childNodes[0], 9);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("abc <h1>title</h1><br>");
    });
    it('multiple wrap', () => {

        editor2.refContent.innerHTML = "title1<p><em>title2</em></p><hr><h2>replace title</h2><h1>retained title</h1><ol><li><em><strong><u>deep title</u></strong></em><hr></li><li><hr></li><li><img></li><li><h3>replace title</h3></li><li>normal title</li></ol>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.querySelectorAll("ol li").item(4).childNodes[0], 12);
        sel.addRange(range);
       
        editor2.command("h1");
        chai.expect(editor2.value()).to.equal("<h1>title1</h1><h1><em>title2</em></h1><hr><h1>replace title</h1><h1>retained title</h1><ol><li><h1><em><strong><u>deep title</u></strong></em></h1><hr></li><li><hr></li><li><img></li><li><h1>replace title</h1></li><li><h1>normal title</h1></li></ol>");
    });
    
});