describe('fullscreen', () => {

    let rect_original = editor2.refEditor.getBoundingClientRect();
    editor1.setAutoGrow(false);
    let top_original =  editor2.refEditor.offsetTop;
    it('enter fullscreen', () => {
        //make sure we are using the most current value to be tested in exit
        editor1.setAutoGrow(false);
        rect_original = editor2.refEditor.getBoundingClientRect();
        top_original =  editor2.refEditor.offsetTop;

        editor2.command("fullscreen",["1"]);
        const rect1 = editor2.refEditor.getBoundingClientRect();
        chai.expect(editor2.refEditor.offsetTop).to.equal(0);
        chai.expect(rect1.left).to.equal(0);
        chai.expect(rect1.width).to.equal(document.querySelector("html").clientWidth);
        chai.expect(rect1.height).to.greaterThanOrEqual(document.querySelector("html").clientHeight);
    });
    it('exit fullscreen', () => {
        editor2.command("fullscreen",[""]);
        const rect1 = editor2.refEditor.getBoundingClientRect();
        chai.expect(editor2.refEditor.offsetTop).to.equal(top_original);
        chai.expect(rect1.left).to.equal(rect_original.left);
        chai.expect(rect1.width).to.equal(rect_original.width);
        chai.expect(rect1.height).to.equal(rect_original.height);
        
    });
});