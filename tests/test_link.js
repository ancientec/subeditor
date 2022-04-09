describe('link', () => {
    it('insert link', () => {
        const str = "link";
        editor2.refContent.innerHTML = str;
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild, 2);
        range.setEnd(editor2.refContent.firstChild, 2);
        sel.addRange(range);
        editor2.command("link",['insert','https://google.com',"google.com","_blank"]);
        chai.expect(editor2.value()).to.equal('li<a href="https://google.com" target="_blank">google.com</a>nk');
    });
    it('update link', () => {
        
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[1].firstChild, 2);
        range.setEnd(editor2.refContent.childNodes[1].firstChild, 2);
        sel.addRange(range);
        editor2.command("link",['update','https://facebook.com',"facebook.com",""]);
        chai.expect(editor2.value()).to.equal('li<a href="https://facebook.com" target="">facebook.com</a>nk');
    });
    it('remove and insert link', () => {
        const str = "start<p>delete</p><ol><li>delete</li></ol>end";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild, 2);
        range.setEnd(editor2.refContent.lastChild, 2);
        sel.addRange(range);
        editor2.command("link",['insert','https://facebook.com',"facebook.com",""]);
        chai.expect(editor2.value()).to.equal('st<a href="https://facebook.com" target="">facebook.com</a>d');
    });
    it('remove', () => {
        editor2.refContent.innerHTML = 'text<a href="https://facebook.com" target="">facebook.com</a>text';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[1].firstChild, 2);
        range.setEnd(editor2.refContent.childNodes[1].firstChild, 2);
        sel.addRange(range);
        editor2.command("link",['remove']);
        chai.expect(editor2.value()).to.equal('textfacebook.comtext');
    });
    it('remove_link', () => {
        editor2.refContent.innerHTML = 'text<a href="https://facebook.com" target="">facebook.com</a>text';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[1].firstChild, 2);
        range.setEnd(editor2.refContent.childNodes[1].firstChild, 2);
        sel.addRange(range);
        editor2.command("remove_link",[]);
        chai.expect(editor2.value()).to.equal('textfacebook.comtext');
    });

});