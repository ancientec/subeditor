describe('format - code', () => {
    it('insert code when empty', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("code", []);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<pre><code>\n</code></pre><p><br></p>');
    });
    it('append code', () => {
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
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("plain text content<pre><code>\n</code></pre><br>");
    });
    it('append code in paragraph', () => {
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
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("<p>plain text content</p><pre><code>\n</code></pre><p><br></p>");
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
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("plain <br><pre><code>text</code></pre> content");
    });
    it('wrap partial string in paragraph', () => {
        const str = "<p>plain text content</p>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.firstChild, 6);
        range.setEnd(editor2.refContent.firstChild.firstChild, 10);
        sel.addRange(range);
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("<p>plain </p><br><pre><code>text</code></pre><p> content</p>");
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
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("<p>plain </p><br><pre><code>text content</code></pre><pre><code>code</code></pre><h3><img>title</h3>");
    });
    it('ignore code', () => {
        const str = "<pre><code>plain text content</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 6);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 10);
        sel.addRange(range);
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal("<pre><code>plain text content</code></pre>");
    });
    it('multiple all', () => {
        const str = "<p>start1code</p><span>span</span><ol><li>li</li></ol><pre><code>ignored</code></pre><h1>h1</h1><h2>h2</h2><blockquote>blockquote</blockquote><hr><p>p1<img id=1><img id=11>p2<img id=2>p3<img id=3>p4</p>codeendend";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.firstChild, 5);
        range.setEnd(editor2.refContent.lastChild, 7);
        sel.addRange(range);
       
        editor2.command("code");
        chai.expect(editor2.value()).to.equal('<p>start</p><br><pre><code>1code</code></pre><span><pre><code>span</code></pre></span><ol><li><pre><code>li</code></pre></li></ol><pre><code>ignored</code></pre><pre><code>h1</code></pre><pre><code>h2</code></pre><pre><code>blockquote</code></pre><hr><pre><code>p1</code></pre><p><img id="1"><img id="11"></p><pre><code>p2</code></pre><p><img id="2"></p><pre><code>p3</code></pre><p><img id="3"></p><pre><code>p4</code></pre><br><pre><code>codeend</code></pre>end');
    });
    it('enter for new line', () => {
        const str = "<pre><code>code</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 4);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 4);
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
        chai.expect(editor2.value()).to.equal("<pre><code>code\n</code></pre>");
    });
    it('enter for new line 2', () => {
        const str = "<pre><code>code</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 2);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 2);
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
        chai.expect(editor2.value()).to.equal("<pre><code>co\nde</code></pre>");
    });
    it('enter for new line 3', () => {
        const str = "<pre><code>code</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 3);
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
        chai.expect(editor2.value()).to.equal("<pre><code>c\ne</code></pre>");
    });
    it('backspace delete', () => {
        const str = "<pre><code>code</code></pre><pre><code>\n</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.lastChild.querySelector("code").firstChild, 0);
        range.setEnd(editor2.refContent.lastChild.querySelector("code").firstChild, 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "backspace",
            keyCode: 8, // example values.
            code: "backspace", // put everything you need in this object.
            which: 8,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        chai.expect(editor2.value()).to.equal("<pre><code>code</code></pre>");
    });
    it('backspace to previous', () => {
        const str = "<pre><code>code</code></pre><pre><code>123</code></pre>";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.lastChild.querySelector("code").firstChild, 0);
        range.setEnd(editor2.refContent.lastChild.querySelector("code").firstChild, 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "backspace",
            keyCode: 8, // example values.
            code: "backspace", // put everything you need in this object.
            which: 8,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        chai.expect(editor2.value()).to.equal("<pre><code>code</code></pre><pre><code>123</code></pre>");
        sel = document.getSelection();
        chai.expect(sel.focusNode).to.equal(editor2.refContent.querySelector("code").firstChild);
        chai.expect(sel.focusOffset).to.equal(4);
    });
});