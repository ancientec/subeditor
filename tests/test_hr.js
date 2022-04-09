describe('hr', () => {
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
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<hr><br>");
    });
    it('insert at the end', () => {
        editor2.refContent.innerHTML = "editor2 content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 15);
        range.setEnd(editor2.refContent.childNodes[0], 15);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 content<hr><br>");
    });
    it('insert at the beginning', () => {
        editor2.refContent.innerHTML = "editor2 content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0], 0);
        sel.addRange(range);
        sel.collapseToStart();
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<hr>editor2 content");
    });
    it('insert at the middle', () => {
        editor2.refContent.innerHTML = "editor2 content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 8);
        range.setEnd(editor2.refContent.childNodes[0], 8);
        sel.addRange(range);
        sel.collapseToStart();
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <hr>content");
    });
    it('insert at the middle with selected text', () => {
        editor2.refContent.innerHTML = "editor2 content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 7);
        range.setEnd(editor2.refContent.childNodes[0], 8);
        sel.addRange(range);
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2<hr>content");
    });
    it('insert at the middle with selected html', () => {
        editor2.refContent.innerHTML = "editor2 <img><ol><li>1</li><li>2</li><li>3</li></ol><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table><img>content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 7);
        range.setEnd(editor2.refContent.childNodes[5], 1);
        sel.addRange(range);
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2<hr>ontent");
    });
    it('insert after table', () => {
        editor2.refContent.innerHTML = "editor2 content<table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table><br>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNode(editor2.refContent.childNodes[1])
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 content<table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table><hr><br>");
    });
    it('insert with selected partial table', () => {
        editor2.refContent.innerHTML = "editor2 content<img><code>abc</code><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 8);
        //first td:
        //refContent:table:tbody:tr:td:text
        range.setEnd(editor2.refContent.childNodes[3].childNodes[0].childNodes[0].childNodes[0].childNodes[0], 3);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <hr><table><tbody><tr><td></td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table>");
    });
    it('insert with selected partial table - remove td', () => {
        editor2.refContent.innerHTML = "editor2 content<img><code>abc</code><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 8);
        //first td:
        //refContent:table:tbody:tr:td
        range.setEndAfter(editor2.refContent.childNodes[3].childNodes[0].childNodes[0].childNodes[0]);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <hr><table><tbody><tr><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table>");
    });
    it('insert with selected partial end table', () => {
        editor2.refContent.innerHTML = "editor2 <table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.2</td></tr></tbody></table><img><code>abc</code>content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("table tr:last-child td:last-child").childNodes[0], 2);
        //first td:
        //refContent:table:tbody:tr:td:text
        range.setEnd(editor2.refContent.childNodes[editor2.refContent.childNodes.length -1], 1);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.</td></tr></tbody></table><hr>ontent");
    });
    it('insert with selected partial list', () => {
        editor2.refContent.innerHTML = "editor2 content<img><code>abc</code><ol><li>111</li><li>222</li><li>333</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 8);
        //first td:
        //refContent:ol:li:text
        range.setEndAfter(editor2.refContent.childNodes[3].childNodes[1].childNodes[0]);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <hr><ol><li></li><li>333</li></ol>");
    });
    it('insert with selected partial list - remove li', () => {
        editor2.refContent.innerHTML = "editor2 content<img><code>abc</code><ol><li>111</li><li>222</li><li>333</li></ol>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 8);
        //first td:
        //refContent:ol:li
        range.setEndAfter(editor2.refContent.childNodes[3].childNodes[1]);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <hr><ol><li>333</li></ol>");
    });
    it('insert with selected partial end list', () => {
        editor2.refContent.innerHTML = "editor2 <ol><li>111</li><li>222</li><li>333</li></ol>content";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("ol li:last-child").childNodes[0], 1);
        //first td:
        //refContent:table:tbody:tr:td:text
        range.setEnd(editor2.refContent.childNodes[editor2.refContent.childNodes.length -1], 1);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("editor2 <ol><li>111</li><li>222</li><li>3</li></ol><hr>ontent");

        editor2.selection = null;
    });
    it('insert breaks paragraph', () => {
        editor2.refContent.innerHTML = "<p>text content<img><img><em>em</em></p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p").childNodes[0], 5);
        range.setEnd(editor2.refContent.querySelector("p").childNodes[0], 5);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<p>text </p><hr><p>content<img><img><em>em</em></p>");

        editor2.selection = null;
    });
    it('insert breaks paragraph and formats', () => {

        editor2.refContent.innerHTML = "<p><strong><em><u>text content<u></em></strong><img><em>em</em></p>";

        editor2.selection = null;

        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p u ").childNodes[0], 5);
        range.setEnd(editor2.refContent.querySelector("p u").childNodes[0], 5);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<p><strong><em><u>text </u></em></strong></p><hr><p><strong><em><u>content<u></u></u></em></strong><u><u><img><em>em</em></u></u></p>");

        editor2.selection = null;
    });
    it('insert at the end of paragraph', () => {
        editor2.refContent.innerHTML = "<p>text content</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p").childNodes[0], 12);
        range.setEnd(editor2.refContent.querySelector("p").childNodes[0], 12);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<p>text content</p><hr><p><br></p>");

        editor2.selection = null;
    });
    it('inside code', () => {
        editor2.refContent.innerHTML = "<code>code content</code>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").childNodes[0], 4);
        range.setEnd(editor2.refContent.querySelector("code").childNodes[0], 5);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<code>code content</code><hr>");

        editor2.selection = null;
    });
    it('inside pre+code', () => {
        editor2.refContent.innerHTML = "<pre><code>code content</code></pre>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").childNodes[0], 4);
        range.setEnd(editor2.refContent.querySelector("code").childNodes[0], 5);
        sel.addRange(range);
        editor2.command("hr", []);
        chai.expect(editor2.value()).to.equal("<pre><code>code content</code></pre><hr>");

        editor2.selection = null;
    });
});