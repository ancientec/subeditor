describe('color', () => {
    it('insert when empty, extra br', () => {
        editor2.refContent.innerHTML = "";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent, 0);
        range.setEnd(editor2.refContent, 0);
        range.collapse(false);
        sel.addRange(range);
       
        editor2.command("color", ["#0000ff"]);editor2.refContent.focus();
        chai.expect(editor2.value()).to.equal('<span style="color:#0000ff"><br></span>');
    });
    it('end in root div', () => {
        const str = "editor2 blue content";
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
       
        editor2.command("color", ["#0000ff"]);
        chai.expect(editor2.value().replace("color:#0000ff;","color:#0000ff")).to.equal("<span style=\"color:#0000ff\">"+str+"</span>");
    });

    it('beginning in root div', () => {
        const str = "editor2 green content";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0], 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("color", ["#00ff00"]);
        chai.expect(editor2.value().replace("color:#00ff00;","color:#00ff00")).to.equal("<span style=\"color:#00ff00\">"+str+"</span>");
    });
    it('middle in root div', () => {
        const str = "editor2 <p>green</p><ol><li>list</li></ol> content";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 3);
        range.setEnd(editor2.refContent.childNodes[0], 3);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("color", ["#00ff00"]);
        chai.expect(editor2.value().replace("color:#00ff00;","color:#00ff00")).to.equal("<span style=\"color:#00ff00\">editor2 </span><p>green</p><ol><li>list</li></ol> content");
    });
    it('in paragraph', () => {
        const str = "<p>editor2 red content</p>";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("color", ["#ff0000"]);
        chai.expect(editor2.value().replace("color:#ff0000;","color:#ff0000")).to.equal("<p style=\"color:#ff0000\">editor2 red content</p>");
    });
    it('partial text', () => {
        const str = "<p>editor2 purple content</p>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 13);//r2 purpl
        sel.addRange(range);
       
        editor2.command("color", ["#800080"]);
        chai.expect(editor2.value().replace("color:#800080;","color:#800080")).to.equal("<p>edito<span style=\"color:#800080\">r2 purpl</span>e content</p>");
    });
    it('partial beginning, end with hr', () => {
        const str = "<section>editor2<img><ol><li>1</li><li>2</li><li>3</li></ol><hr>content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0], 4);//r2 -> hr
        sel.addRange(range);
        
       
        editor2.command("color", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal("<section>edito<span style=\"color:#0000ff\">r2</span><img><ol><li style=\"color:#0000ff\">1</li><li style=\"color:#0000ff\">2</li><li style=\"color:#0000ff\">3</li></ol><hr>content</section>");
    });
    it('partial beginning, end with table', () => {
        
        const str = "<section>editor2<img><ol><li>1</li><li>2</li><li>3</li></ol><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.</td></tr></tbody></table>content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0], 4);//r2 -> hr
        sel.addRange(range);
        editor2.command("color", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal(
            '<section>edito<span style="color:#0000ff">r2</span><img><ol><li style="color:#0000ff">1</li><li style="color:#0000ff">2</li><li style="color:#0000ff">3</li></ol><table><tbody><tr><td style="color:#0000ff">1.1</td><td style="color:#0000ff">1.2</td></tr><tr><td style="color:#0000ff">2.1</td><td style="color:#0000ff">2.</td></tr></tbody></table>content</section>'
        );
    });
    it('partial both', () => {
        const str = "<section>editor2 begin<img><ol><li>1</li><li>2</li><li>3</li></ol><hr>end content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 8);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[4], 3);//begin -> end
        sel.addRange(range);
       
        editor2.command("color", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal('<section>editor2 <span style="color:#0000ff">begin</span><img><ol><li style="color:#0000ff">1</li><li style="color:#0000ff">2</li><li style="color:#0000ff">3</li></ol><hr><span style="color:#0000ff">end</span> content</section>');

        editor2.selection = null;
    });
    it('test merge tags', () => {
        const str = "<section>editor2 begin<img><ol><li><span>1a</span><span>2b</span></li><li>2</li><li>3</li></ol><hr>end content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 8);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[4], 3);//begin -> end
        sel.addRange(range);
       
        editor2.command("color", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal('<section>editor2 <span style="color:#0000ff">begin</span><img><ol><li><span style="color:#0000ff">1a2b</span></li><li style="color:#0000ff">2</li><li style="color:#0000ff">3</li></ol><hr><span style="color:#0000ff">end</span> content</section>');

        editor2.selection = null;
    });

});



describe('background color', () => {
    it('end in root div', () => {
        const str = "editor2 blue content";
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
       
        editor2.command("backgroundcolor", ["#0000ff"]);
        chai.expect(editor2.value().replace("background-color:#0000ff;","background-color:#0000ff")).to.equal("<span style=\"background-color:#0000ff\">"+str+"</span>");
    });

    it('beginning in root div', () => {
        const str = "editor2 green content";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0], 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("backgroundcolor", ["#00ff00"]);
        chai.expect(editor2.value().replace("background-color:#00ff00;","background-color:#00ff00")).to.equal("<span style=\"background-color:#00ff00\">"+str+"</span>");
    });
    it('middle in root div', () => {
        const str = "editor2 <p>green</p><ol><li>list</li></ol> content";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0], 3);
        range.setEnd(editor2.refContent.childNodes[0], 3);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("backgroundcolor", ["#00ff00"]);
        chai.expect(editor2.value().replace("background-color:#00ff00;","background-color:#00ff00")).to.equal("<span style=\"background-color:#00ff00\">editor2 </span><p>green</p><ol><li>list</li></ol> content");
    });
    it('in paragraph', () => {
        const str = "<p>editor2 red content</p>";
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 0);
        range.collapse(false);
        sel.addRange(range);
        sel.collapseToEnd();
       
        editor2.command("backgroundcolor", ["#ff0000"]);
        chai.expect(editor2.value().replace("background-color:#ff0000;","background-color:#ff0000")).to.equal("<p style=\"background-color:#ff0000\">editor2 red content</p>");
    });
    it('partial text', () => {
        const str = "<p>editor2 purple content</p>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[0], 13);//r2 purpl
        sel.addRange(range);
       
        editor2.command("backgroundcolor", ["#800080"]);
        chai.expect(editor2.value().replace("background-color:#800080;","background-color:#800080")).to.equal("<p>edito<span style=\"background-color:#800080\">r2 purpl</span>e content</p>");
    });
    it('partial beginning, end with hr', () => {
        const str = "<section>editor2<img><ol><li>1</li><li>2</li><li>3</li></ol><hr>content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0], 4);//r2 -> hr
        sel.addRange(range);
        
       
        editor2.command("backgroundcolor", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal("<section>edito<span style=\"background-color:#0000ff\">r2</span><img><ol><li style=\"background-color:#0000ff\">1</li><li style=\"background-color:#0000ff\">2</li><li style=\"background-color:#0000ff\">3</li></ol><hr>content</section>");
    });
    it('partial beginning, end with table', () => {
        
        const str = "<section>editor2<img><ol><li>1</li><li>2</li><li>3</li></ol><table><tbody><tr><td>1.1</td><td>1.2</td></tr><tr><td>2.1</td><td>2.</td></tr></tbody></table>content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 5);
        range.setEnd(editor2.refContent.childNodes[0], 4);//r2 -> hr
        sel.addRange(range);
        editor2.command("backgroundcolor", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal(
            '<section>edito<span style="background-color:#0000ff">r2</span><img><ol><li style="background-color:#0000ff">1</li><li style="background-color:#0000ff">2</li><li style="background-color:#0000ff">3</li></ol><table><tbody><tr><td style="background-color:#0000ff">1.1</td><td style="background-color:#0000ff">1.2</td></tr><tr><td style="background-color:#0000ff">2.1</td><td style="background-color:#0000ff">2.</td></tr></tbody></table>content</section>'
        );
    });
    it('partial both', () => {
        const str = "<section>editor2 begin<img><ol><li>1</li><li>2</li><li>3</li></ol><hr>end content</section>";
        
        editor2.refContent.innerHTML = str;
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.childNodes[0].childNodes[0], 8);
        range.setEnd(editor2.refContent.childNodes[0].childNodes[4], 3);//begin -> end
        sel.addRange(range);
       
        editor2.command("backgroundcolor", ["#0000ff"]);
        chai.expect(editor2.value().replace(/color:#0000ff;/g,"color:#0000ff")).to.equal('<section>editor2 <span style="background-color:#0000ff">begin</span><img><ol><li style="background-color:#0000ff">1</li><li style="background-color:#0000ff">2</li><li style="background-color:#0000ff">3</li></ol><hr><span style="background-color:#0000ff">end</span> content</section>');

        editor2.selection = null;
    });

});