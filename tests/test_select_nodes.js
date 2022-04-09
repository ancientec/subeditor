describe('select nodes', () => {

    it('select text node', () => {
        editor2.refContent.innerHTML = "change#1,key=1";
        //clear selection of editor2
        SelectionSerializer.save(editor1.refContent);
        //set to end of editor2
        SelectionSerializer.save(editor2.refContent);
        const range = editor2.getSelectionRange().range.cloneRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const nodes = editor2.dom.selectDeepNodesInRange(editor2.getSelectionRange().range);
        chai.expect(nodes[0].collapsed).to.equal(false);
        chai.expect(nodes[0].startOffset).to.equal(0);
        chai.expect(nodes[0].endOffset).to.equal(14);
        chai.expect(nodes[0].node).to.equal(editor2.refContent.childNodes[0]);
        chai.expect(nodes[0].isVoid).to.equal(false);
        chai.expect(nodes[0].partial).to.equal(false);
    });
    it('select partial text node', () => {
        //clear selection of editor2
        SelectionSerializer.save(editor1.refContent);
        //set to end of editor2
        SelectionSerializer.save(editor2.refContent);
        const range = editor2.getSelectionRange().range.cloneRange();
        range.setStart(editor2.refContent.childNodes[0], 10);
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const nodes = editor2.dom.selectDeepNodesInRange(editor2.getSelectionRange().range);
        chai.expect(nodes[0].collapsed).to.equal(false);
        chai.expect(nodes[0].startOffset).to.equal(10);
        chai.expect(nodes[0].endOffset).to.equal(14);
        chai.expect(nodes[0].node).to.equal(editor2.refContent.childNodes[0]);
        chai.expect(nodes[0].isVoid).to.equal(false);
        chai.expect(nodes[0].partial).to.equal(true);
    });
    it('select partial middle text node', () => {
        //clear selection of editor2
        SelectionSerializer.save(editor1.refContent);
        //set to beginning of editor2
        SelectionSerializer.save(editor2.refContent);
        const range = editor2.getSelectionRange().range.cloneRange();
        range.setStart(editor2.refContent.childNodes[0], 2);
        range.setEnd(editor2.refContent.childNodes[0], 10);
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const nodes = editor2.dom.selectDeepNodesInRange(editor2.getSelectionRange().range);
        chai.expect(nodes[0].collapsed).to.equal(false);
        chai.expect(nodes[0].startOffset).to.equal(2);
        chai.expect(nodes[0].endOffset).to.equal(10);
        chai.expect(nodes[0].node).to.equal(editor2.refContent.childNodes[0]);
        chai.expect(nodes[0].isVoid).to.equal(false);
        chai.expect(nodes[0].partial).to.equal(true);
    });

});

describe('select ranges', () => {
    it('select 1 img node', () => {
        editor1.refContent.innerHTML = "editor2 <ol><li>begin<img id=\"img1\"><br id=\"br1\"><hr id=\"hr1\">end</li><li>222</li><li>333</li></ol>content";
        const range = document.createRange();
        const li = editor1.refContent.querySelector("li:first-child");
        range.setStart(li,1);
        range.setEnd(li,2);//img
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        editor1.getSelectionRange();
        const nodes = editor1.dom.selectDeepNodesInRange(range);
        chai.expect(editor1.refContent.querySelector("li:first-child img")).to.equal(nodes[0].node);
        chai.expect(nodes.length).to.equal(1);
    });
    it('select partial text and 1 img node', () => {
        editor1.refContent.innerHTML = "editor2 <ol><li>begin<img id=\"img1\"><br id=\"br1\"><hr id=\"hr1\">end</li><li>222</li><li>333</li></ol>content";
        const range = document.createRange();
        const li = editor1.refContent.querySelector("li:first-child");
        range.setStart(li.childNodes[0],2);//gin
        range.setEnd(li,2);//img
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        editor1.getSelectionRange();
        const nodes = editor1.dom.selectDeepNodesInRange(range);
        chai.expect(nodes[0].node.textContent.substring(nodes[0].startOffset)).to.equal("gin");
        chai.expect(editor1.refContent.querySelector("li:first-child img")).to.equal(nodes[1].node);
        chai.expect(nodes.length).to.equal(2);
    });
    it('select partial beginning and after', () => {
        editor1.refContent.innerHTML = "editor1 <ol><li>begin<img id=\"img1\"><br id=\"br1\"><hr id=\"hr1\">end</li><li></li><li></li></ol>content";
        const range = document.createRange();
        const li = editor1.refContent.querySelector("li:first-child");
        range.setStart(li.childNodes[0],2);//gin
        range.setEnd(li.childNodes[li.childNodes.length - 1],2);//en
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        editor1.getSelectionRange();
        const nodes = editor1.dom.selectDeepNodesInRange(range);
        chai.expect(nodes[0].node.textContent.substring(nodes[0].startOffset, nodes[0].endOffset)).to.equal("gin");
        chai.expect(editor1.refContent.querySelector("li:first-child img")).to.equal(nodes[1].node);
        chai.expect(nodes[4].node.textContent.substring(nodes[4].startOffset, nodes[4].endOffset)).to.equal("en");
        chai.expect(nodes.length).to.equal(5);

        editor2.selection = null;
    });
});