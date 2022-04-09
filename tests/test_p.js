describe('format - p', () => {
    it('insert p when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("p", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<p><br></p>');
    });
    it('wrap p', () => {
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
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<p>"+str+"</p>");
    });
    it('wrap partial text in p', () => {
        const str = "plain text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("plain <p>text</p> content");
    });
    it('end of element and doc, go to next paragraph', () => {
        const str = "<p>plain text content</p>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 18);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 18);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<p>plain text content</p><p><br></p>");
    });
    it('break p when select partial text in p', () => {
        const str = "<p>plain text content</p>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<p>plain </p><p>text</p><p> content</p>");
    });
    it('wrap p when select partial text in span', () => {
        const str = "<span>plain text content</span>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<span>plain <p>text</p> content</span>");
    });
    it('wrap p when select partial text in div', () => {
        const str = "<div>plain text content</div>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<div>plain <p>text</p> content</div>");
    });
    it('partial & multiple parts', () => {
        const str = "<h1>title123</h1><p>paragraph</p><code>code</code><ol><li>1</li><li>2</li></ol><pre><code>pre+code</code></pre><h2>123title2</h2>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("h1").childNodes[0], 5);
        range.setEnd(editor2.refContent.querySelector("h2").childNodes[0], 3);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<h1>title</h1><p>123</p><p>paragraph</p><p>code</p><ol><li><p>1</p></li><li><p>2</p></li></ol><p>pre+code</p><p>123</p><h2>title2</h2>");
    });
    it('end of h1, append new p', () => {
        editor2.refContent.innerHTML = "<h1>plain text content</h1>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 18);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 18);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<h1>plain text content</h1><p><br></p>");
    });
    it('replace h1', () => {
        editor2.refContent.innerHTML = "<h1>plain text content</h1>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 3);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 3);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<p>plain text content</p>");
    });
    it('break h1', () => {
        editor2.refContent.innerHTML = "<h1>plain text content</h1>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<h1>plain </h1><p>text</p><h1> content</h1>");
    });
    it('end of code, append new p', () => {
        editor2.refContent.innerHTML = "<pre><code>plain text content</code></pre>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 18);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 18);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<pre><code>plain text content</code></pre><p><br></p>");
    });
    it('replace code', () => {
        editor2.refContent.innerHTML = "<pre><code>plain text content</code></pre>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 3);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 3);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<p>plain text content</p>");
    });
    it('break code', () => {
        editor2.refContent.innerHTML = "<pre><code>plain text content</code></pre>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<pre><code>plain </code></pre><p>text</p><pre><code> content</code></pre>");
    });
    it('skip hr', () => {
        editor2.refContent.innerHTML = "<hr>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNode(editor2.refContent.childNodes[0]);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<hr><p><br></p>");
    });
    it('wrap selected text in blockquote', () => {
        editor2.refContent.innerHTML = "<blockquote>plain text content</blockquote>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<blockquote>plain <p>text</p> content</blockquote>");
    });
    it('wrap whole text in blockquote', () => {
        editor2.refContent.innerHTML = "<blockquote>plain text content<img></blockquote>";
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 6);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("p");
        chai.expect(editor2.value()).to.equal("<blockquote><p>plain text content</p><img></blockquote>");
    });
});