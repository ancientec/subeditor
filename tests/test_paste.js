describe('paste', () => {
    //doesn't work with firefox
    if(navigator.userAgent.indexOf("Firefox") !== -1) return;
    it('paste with delete', () => {
        editor2.refContent.innerHTML = 'text text';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild, 3);
        range.setEnd(editor2.refContent.firstChild, 6);
        sel.addRange(range);
        var data = new DataTransfer();
        data.setData('text/html', "<p>1<br>2<br>3</p>");
        editor2.refContent.dispatchEvent(new ClipboardEvent('paste', {
            clipboardData : data
        }));
        chai.expect(editor2.value()).to.equal('tex<p>1<br>2<br>3</p>ext');
    });
    it('paste into code as string', () => {
        editor2.refContent.innerHTML = '<pre><code>text text</code></pre>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 3);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 6);
        sel.addRange(range);
        var data = new DataTransfer();
        data.setData('text/html', "<p>1<br>2<br>3</p>");

        editor2.refContent.dispatchEvent(new ClipboardEvent('paste', {
            clipboardData : data
        }));
        chai.expect(editor2.value()).to.equal('<pre><code>tex&lt;p&gt;1&lt;br&gt;2&lt;br&gt;3&lt;/p&gt;ext</code></pre>');
    });
    it('paste with cleanup', () => {
        editor2.refContent.innerHTML = 'text text';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.firstChild, 3);
        range.setEnd(editor2.refContent.firstChild, 6);
        sel.addRange(range);
        var data = new DataTransfer();
        data.setData('text/html', '<p class="remove" style="text-align:left;color:black;background-color:#fff"><b align="right">1<span>+1</span></b><br><span style="color:red">x</span><span style="color:red">+x</span><i>2</i><em>+2</em><br>3</p>');

        editor2.refContent.dispatchEvent(new ClipboardEvent('paste', {
            clipboardData : data
        }));
        chai.expect(editor2.value()).to.equal('tex<p style="text-align: left;color: black;"><strong>1+1</strong><br><span style="color: red;">x+x</span><em>2+2</em><br>3</p>ext');
    });
});