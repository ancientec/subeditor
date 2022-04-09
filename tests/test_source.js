describe('test source', () => {
    
    it('source not enable', () => {
        editor2.selection = null;
        var btnSource = editor2.refEditor.querySelector(".se-ToolbarItem[data-command=source]");
        var btnFullscreen = editor2.refEditor.querySelector(".se-ToolbarItem[data-command=fullscreen]");
        chai.expect(editor2.toolbar.hasShadow()).to.equal(false);
        chai.expect(editor2.refToolbar.classList.contains("EnableShadow")).to.equal(false);
        chai.expect(btnSource.classList.contains("AboveShadow")).to.equal(false);
        chai.expect(btnFullscreen.classList.contains("AboveShadow")).to.equal(false);
        chai.expect(editor2.refEditor.querySelectorAll(".SubEditorSource").length).to.equal(0);
    });
    it('source enabled', () => {
        editor2.selection = null;
        //enable only fullscreen and source button
        var btnSource = editor2.refEditor.querySelector(".se-ToolbarItem[data-command=source]");
        var btnFullscreen = editor2.refEditor.querySelector(".se-ToolbarItem[data-command=fullscreen]");
        //editor2.command("source",[]);
        btnSource.click();
        chai.expect(editor2.toolbar.hasShadow()).to.equal(true);
        chai.expect(editor2.refToolbar.classList.contains("EnableShadow")).to.equal(true);
        chai.expect(btnSource.classList.contains("AboveShadow")).to.equal(true);
        chai.expect(btnFullscreen.classList.contains("AboveShadow")).to.equal(true);
        chai.expect(editor2.refEditor.querySelectorAll(".SubEditorSource").length).to.equal(1);
        btnSource.click();
        editor2.selection = null;
        
    });

});