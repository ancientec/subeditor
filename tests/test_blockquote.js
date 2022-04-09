describe('format - blockquote', () => {
    it('insert blockquote when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("blockquote", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<blockquote><br></blockquote><p><br></p>');
    });
    it('append blockquote', () => {
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
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("plain text content<blockquote><br></blockquote><br>");
    });
    it('append blockquote in paragraph', () => {
        const str = "<p>plain text content</p>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p").firstChild, editor2.refContent.querySelector("p").firstChild.textContent.length);
        range.setEnd(editor2.refContent.querySelector("p").firstChild, editor2.refContent.querySelector("p").firstChild.textContent.length);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("<p>plain text content</p><blockquote><br></blockquote><p><br></p>");
    });
    it('wrap partial string', () => {
        const str = "plain text content";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 6);
        range.setEnd(editor2.refContent.childNodes[0], 10);
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("plain <blockquote>text</blockquote> content");
    });
    it('replace code', () => {
        const str = "<pre><code>code</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.firstChild.firstChild, 3);
        range.setEnd(editor2.refContent.firstChild.firstChild.firstChild, 3);
        range.collapse();
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("<blockquote>code</blockquote><br>");
    });
    it('wrap partial string in code', () => {
        const str = "<pre><code>plain text content</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.firstChild.firstChild, 6);
        range.setEnd(editor2.refContent.firstChild.firstChild.firstChild, 10);
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("<pre><code>plain </code></pre><blockquote>text</blockquote><pre><code> content</code></pre>");
    });
    it('partial end', () => {
        const str = "<p>plain text content</p><h3>code<img>title</h3>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p").firstChild, 6);
        range.setEnd(editor2.refContent.querySelector("h3").firstChild, 4);
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("<p>plain </p><blockquote>text content</blockquote><blockquote>code</blockquote><h3><img>title</h3>");
    });
    it('ignore blockquote', () => {
        const str = "<blockquote>plain text content</blockquote>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("blockquote").firstChild, 6);
        range.setEnd(editor2.refContent.querySelector("blockquote").firstChild, 10);
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal("<blockquote>plain text content</blockquote>");
    });
    it('multiple all', () => {
        const str = "<p>start1blockquote</p><span>span</span><ol><li>li</li></ol><pre><code>code</code></pre><h1>h1</h1><h2>h2</h2><blockquote>ingoredblockquote</blockquote><hr><p>p1<img id=1><img id=11>p2<img id=2>p3<img id=3>p4</p>blockquoteendend";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.firstChild, 5);
        range.setEnd(editor2.refContent.lastChild, 13);
        sel.addRange(range);
       
        editor2.command("blockquote");
        chai.expect(editor2.value()).to.equal('<p>start</p><blockquote>1blockquote</blockquote><span><blockquote>span</blockquote></span><ol><li><blockquote>li</blockquote></li></ol><blockquote>code</blockquote><blockquote>h1</blockquote><blockquote>h2</blockquote><blockquote>ingoredblockquote</blockquote><blockquote><hr></blockquote><blockquote>p1<img id="1"><img id="11">p2<img id="2">p3<img id="3">p4</blockquote><blockquote>blockquoteend</blockquote>end');
    });
    it('enter add br', () => {
        const str = "<blockquote>blockquote</blockquote>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("blockquote").firstChild, 5);
        range.setEnd(editor2.refContent.querySelector("blockquote").firstChild, 5);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            keyCode: 13, // example values.
            code: "Enter", // put everything you need in this object.
            which: 13,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        chai.expect(editor2.value()).to.equal("<blockquote>block<br>quote</blockquote>");
    });
    it('enter add br 2', () => {
        const str = "<blockquote>blockquote</blockquote>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("blockquote").firstChild, 4);
        range.setEnd(editor2.refContent.querySelector("blockquote").firstChild, 6);
        sel.addRange(range);
       
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            keyCode: 13, // example values.
            code: "Enter", // put everything you need in this object.
            which: 13,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        chai.expect(editor2.value()).to.equal("<blockquote>bloc<br>uote</blockquote>");
    });
});