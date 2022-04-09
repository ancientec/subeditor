describe('remove format', () => {
    it('remove format', () => {
        const str = "<p>retain</p><h1>h1</h1><p style=\"color:#000000;background-color:#eeeeee\"><span><em><u><sub><sup><strong>bold text</strong></sup></sub></u></em></span></p>text content<ol><li><a href=\"link\"><u>link</u></a></li></ol>end";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild.childNodes[0], 0);
        range.setEnd(editor2.refContent.lastChild, 1);
        sel.addRange(range);
        editor2.command("remove_format");
        chai.expect(editor2.value()).to.equal('<p>retain</p>h1<p style="">bold text</p>text content<ol><li>link</li></ol>end');
    });
});