describe('table', () => {
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
       
        editor2.command("table", ["3,3"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><br>');
    });
    it('insert when caret in blockquote', () => {
        editor2.refContent.innerHTML = "<blockquote>abc123</blockquote><p>next line</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("p").firstChild, 4);
        range.setEnd(editor2.refContent.querySelector("blockquote").firstChild, 3);
        //range.collapse(false);
        sel.addRange(range);
       
        editor2.command("table", ["3,3"]);
        chai.expect(editor2.value()).to.equal('<blockquote>abc123</blockquote><br><table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p>next line</p>');
    });
    it('insert when caret in code', () => {
        editor2.refContent.innerHTML = "<pre><code>abc123</code></pre><p>next line</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("code").firstChild, 3);
        range.setEnd(editor2.refContent.querySelector("code").firstChild, 3);
        sel.addRange(range);
       
        editor2.command("table", ["2,2"]);
        chai.expect(editor2.value()).to.equal('<pre><code>abc123</code></pre><br><table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p>next line</p>');
    });
    it('insert when caret in table', () => {
        editor2.refContent.innerHTML = "<table><tbody><tr><td>abc</td><td>123</td></tr></tbody></table><p>next line</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("td").firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("td").firstChild, 1);
        sel.addRange(range);
        //test toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="table_style"]')).to.not.equal(null);
        editor2.command("table", ["2,2"]);
        
        chai.expect(editor2.value()).to.equal('<table><tbody><tr><td>abc</td><td>123</td></tr></tbody></table><br><table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p>next line</p>');
        editor2.toolbar.hideDropdown();
    });
    it('insert when caret in ol list', () => {
        editor2.refContent.innerHTML = "<ol><li>abc</li><li>123</li></ol><p>next line</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("li").firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("li").firstChild, 1);
        sel.addRange(range);
       
        editor2.command("table", ["2,2"]);
        chai.expect(editor2.value()).to.equal('<ol><li>abc</li><li>123</li></ol><br><table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p>next line</p>');
    });
    it('insert when caret in ul list', () => {
        editor2.refContent.innerHTML = "<ul><li>abc</li><li>123</li></ul><p>next line</p>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("li").firstChild, 1);
        range.setEnd(editor2.refContent.querySelector("li").firstChild, 1);
        sel.addRange(range);
       
        editor2.command("table", ["2,2"]);
        chai.expect(editor2.value()).to.equal('<ul><li>abc</li><li>123</li></ul><br><table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p>next line</p>');
    });
    it('in table header toolbar menu', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        //test toolbar menu:
        editor2.refToolbar.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        //has delete header
        chai.expect(editor2.refToolbar.querySelector('div[data-tips="table"] button[data-command="delete_header"]').style.display).to.equal("");
        //no merge down
        chai.expect(editor2.refToolbar.querySelector('div[data-tips="table"] button[data-command="merge_down"]').style.display).to.equal("none");
        //no insert_row_above
        chai.expect(editor2.refToolbar.querySelector('div[data-tips="table"] button[data-command="insert_row_above"]').style.display).to.equal("none");
        //no insert_row_below
        chai.expect(editor2.refToolbar.querySelector('div[data-tips="table"] button[data-command="insert_row_below"]').style.display).to.equal("none");
        editor2.toolbar.hideDropdown();
        
    });
    it('change table style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["table_style", "color:red"]);
        chai.expect(editor2.value()).to.equal('<table style="color:red"><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('edit table style', (done) => {
        editor2.refContent.innerHTML = "<table style=\"color:red\"><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        //test toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="table_style"]').click();
        var input = editor2.refEditor.querySelector('div[data-tips="table"] #dropdown-menu-table input');
        chai.expect(input.value).equal("color:red");
        input.value = "color:blue";

        setTimeout(() => {
            editor2.refEditor.querySelector('div[data-tips="table"] #dropdown-menu-table .se-dropdown-content button').click();
            chai.expect(editor2.value()).to.equal('<table style="color:blue"><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
        done();},0);
    });
    
    it('change header cell style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["cell_style", "color:red", "cell"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th style="color:red">header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('change header cell row style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["cell_style", "color:red", "row"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th style="color:red">header 1</th><th style="color:red">header 2</th><th style="color:red">header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('change cell style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["cell_style", "color:red", "cell"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td style="color:red">1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('change row cell style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["cell_style", "color:red", "row"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td style="color:red">1</td><td style="color:red">2</td><td style="color:red">3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('change all body cell style', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["cell_style", "color:red", "all"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td style="color:red">1</td><td style="color:red">2</td><td style="color:red">3</td></tr><tr><td style="color:red">4</td><td style="color:red">5</td><td style="color:red">6</td></tr><tr><td style="color:red">7</td><td style="color:red">8</td><td style="color:red">9</td></tr></tbody></table>');
    });
    it('edit body cell style', (done) => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td style="color:red">1</td><td style="color:red">2</td><td style="color:red">3</td></tr><tr><td style="color:red">4</td><td style="color:red">5</td><td style="color:red">6</td></tr><tr><td style="color:red">7</td><td style="color:red">8</td><td style="color:red">9</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        //test toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="cell_style"]').click();
        var input = editor2.refEditor.querySelector('div[data-tips="table"] #dropdown-menu-table input');
        chai.expect(input.value).equal("color:red");
        input.value = "color:blue";

        setTimeout(() => {
            editor2.refEditor.querySelector('div[data-tips="table"] #dropdown-menu-table .se-dropdown-content button[data-value="cell"]').click();
            chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td style="color:blue">1</td><td style="color:red">2</td><td style="color:red">3</td></tr><tr><td style="color:red">4</td><td style="color:red">5</td><td style="color:red">6</td></tr><tr><td style="color:red">7</td><td style="color:red">8</td><td style="color:red">9</td></tr></tbody></table>');
        done();},0);
    });
    it('insert column left, from first td', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th><br></th><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td><br></td><td>1</td><td>2</td><td>3</td></tr><tr><td><br></td><td>4</td><td>5</td><td>6</td></tr><tr><td><br></td><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert column left, from last td', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th><br></th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td><br></td><td>3</td></tr><tr><td>4</td><td>5</td><td><br></td><td>6</td></tr><tr><td>7</td><td>8</td><td><br></td><td>9</td></tr></tbody></table>');
    });
    it('insert column left with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody td")[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody td")[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th><br></th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td><br></td><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="6">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td><br></td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('insert column right, from first td', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th><br></th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td><br></td><td>2</td><td>3</td></tr><tr><td>4</td><td><br></td><td>5</td><td>6</td></tr><tr><td>7</td><td><br></td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert column right, from last td', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th><br></th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td><td><br></td></tr><tr><td>4</td><td>5</td><td>6</td><td><br></td></tr><tr><td>7</td><td>8</td><td>9</td><td><br></td></tr></tbody></table>');
    });

    it('insert column left, from first th', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th><br></th><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td><br></td><td>1</td><td>2</td><td>3</td></tr><tr><td><br></td><td>4</td><td>5</td><td>6</td></tr><tr><td><br></td><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert column left, from last th', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead tr").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead tr").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th><br></th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td><br></td><td>3</td></tr><tr><td>4</td><td>5</td><td><br></td><td>6</td></tr><tr><td>7</td><td>8</td><td><br></td><td>9</td></tr></tbody></table>');
    });
    it('insert column right, from first th', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th><br></th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td><br></td><td>2</td><td>3</td></tr><tr><td>4</td><td><br></td><td>5</td><td>6</td></tr><tr><td>7</td><td><br></td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert column right, from last th', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead tr").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead tr").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th><br></th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td><td><br></td></tr><tr><td>4</td><td>5</td><td>6</td><td><br></td></tr><tr><td>7</td><td>8</td><td>9</td><td><br></td></tr></tbody></table>');
    });
    it('insert column right with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody td")[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody td")[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th><br></th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td><br></td><td>4.</td><td>5.</td></tr><tr><td colspan="6">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td><br></td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('delete column first', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>2</td><td>3</td></tr><tr><td>5</td><td>6</td></tr><tr><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('delete column middle', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>3</td></tr><tr><td>4</td><td>6</td></tr><tr><td>7</td><td>9</td></tr></tbody></table>');
    });
    it('delete column end', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>4</td><td>5</td></tr><tr><td>7</td><td>8</td></tr></tbody></table>');
    });
    it('delete column first, caret at header', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead tr").childNodes[0].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead tr").childNodes[0].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>2</td><td>3</td></tr><tr><td>5</td><td>6</td></tr><tr><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('delete column middle, caret at header', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead tr").childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead tr").childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>3</td></tr><tr><td>4</td><td>6</td></tr><tr><td>7</td><td>9</td></tr></tbody></table>');
    });
    it('delete column end, caret at header', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>4</td><td>5</td></tr><tr><td>7</td><td>8</td></tr></tbody></table>');
    });
    it('delete header', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead tr").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead tr").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_header"]);
        chai.expect(editor2.value()).to.equal('<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('delete row', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_row"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('delete row with merged rowspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td colspan="2" rowspan="3"><br><br><br><br>1.2.</td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[2].firstChild.firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[2].firstChild.firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_row"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td colspan="2" rowspan="2"><br><br><br><br>1.2.</td><td><br></td><td><br></td><td><br></td></tr><tr><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('insert row above', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_row_above"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert row above with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td colspan="2">4.5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_row_above"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2"><br></td><td><br></td><td colspan="2"><br></td></tr><tr><td colspan="2">1.2.</td><td>3.</td><td colspan="2">4.5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('insert row below', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").lastChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").lastChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_row_below"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
    });
    it('insert row below with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td colspan="2">4.5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_row_below"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td colspan="2">4.5.</td></tr><tr><td colspan="2"><br></td><td><br></td><td colspan="2"><br></td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('has merge down and merge right button', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        //show toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        //merge down
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_down"]').style.display).to.equal("");
        //merge right
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_right"]').style.display).to.equal("");
        editor2.toolbar.hideDropdown();
    });
    it('has merge down and no merge right button', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody tr").childNodes[2].firstChild, 0);
        sel.addRange(range);
        //show toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        //merge down
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_down"]').style.display).to.equal("");
        //merge right
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_right"]').style.display).to.equal("none");
        editor2.toolbar.hideDropdown();
    });
    it('no merge down and no merge right button', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[2].childNodes[2].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[2].childNodes[2].firstChild, 0);
        sel.addRange(range);
        //show toolbar menu:
        editor2.refEditor.querySelector('div[data-tips="table"] .se-dropdown-trigger button').click();
        //merge down
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_down"]').style.display).to.equal("none");
        //merge right
        chai.expect(editor2.refEditor.querySelector('div[data-tips="table"] button[data-command="merge_right"]').style.display).to.equal("none");
        editor2.toolbar.hideDropdown();
    });
    it('merge right header', () => {
        editor2.refContent.innerHTML = "<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>";
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["merge_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th colspan="2">header 1header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');
        editor2.command("table", ["merge_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th colspan="3">header 1header 2header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');

    });
    it('unmerge header', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th colspan="3">header 1header 2header 3</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("thead th").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("thead th").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["unmerge"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1header 2header 3</th><th><br></th><th><br></th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');

    });
    it('unmerge', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td colspan="2" rowspan="2">1245</td><td>3</td></tr><tr><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["unmerge"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead><tbody><tr><td>1245</td><td><br></td><td>3</td></tr><tr><td><br></td><td><br></td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></tbody></table>');

    });
    it('merge down 1x1 merge 1x1', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["merge_down"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th></tr></thead><tbody><tr><td>12</td></tr><tr><td>3</td></tr></tbody></table>');
    });
    
    
    it('merge down 1x2 merge 1x2', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2">1.2.</td><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="2">6.7.</td><td>8.</td><td>9.</td><td>10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelector("tbody td").firstChild, 0);
        range.setEnd(editor2.refContent.querySelector("tbody td").firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["merge_down"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td colspan="2" rowspan="2">1.2.6.7.</td><td>3.</td><td>4.</td><td>5.</td></tr><tr><td>8.</td><td>9.</td><td>10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });

    it('delete col with merged colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td colspan="2">y1y2</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td>x1</td><td><br></td><td><br></td></tr><tr><td colspan="2" rowspan="3"><br><br><br><br>1.2.</td><td>x2</td><td><br></td><td><br></td></tr><tr><td>x3</td><td><br></td><td><br></td></tr><tr><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td>y1y2</td><td><br></td><td><br></td></tr><tr><td><br></td><td>x1</td><td><br></td><td><br></td></tr><tr><td rowspan="3"><br><br><br><br>1.2.</td><td>x2</td><td><br></td><td><br></td></tr><tr><td>x3</td><td><br></td><td><br></td></tr><tr><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="4">6.7.8.9.10.</td></tr><tr><td>11.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('delete merged col', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td colspan="2">y1y2</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td>x1</td><td><br></td><td><br></td></tr><tr><td colspan="2" rowspan="3"><br><br><br><br>1.2.</td><td>x2</td><td><br></td><td><br></td></tr><tr><td>x3</td><td><br></td><td><br></td></tr><tr><td>3.</td><td>4.</td><td>5.</td></tr><tr><td colspan="5">6.7.8.9.10.</td></tr><tr><td>11.</td><td>12.</td><td>13.</td><td>14.</td><td>15.</td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["delete_column"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 4</th><th>header 5</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td rowspan="3"><br><br><br><br>1.2.</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td>4.</td><td>5.</td></tr><tr><td colspan="4">6.7.8.9.10.</td></tr><tr><td>11.</td><td>14.</td><td>15.</td></tr></tbody></table>');
    });
    it('insert column left, with rowspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th><br></th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3"><br></td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>');
    });
    it('insert column right, with rowspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[1].childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th><br></th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td rowspan="3"><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>');
    });
    it('insert column left, with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[2].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[2].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_left"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th><br></th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="3">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>');
    });
    it('insert column right, with colspan', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[1].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[1].firstChild, 0);
        sel.addRange(range);
        editor2.command("table", ["insert_column_right"]);
        chai.expect(editor2.value()).to.equal('<table><thead><tr><th>header 1</th><th>header 2</th><th><br></th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="3">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>');
    });
    it('default table style cfg', () => {
        destroyEditor1();
        var en = Object.assign({}, SubEditor.langList.en, {
        });
        var cfgList = {
            "table.default.table.style" : "border: none;border-collapse: collapse;empty-cells: show;max-width: 100%;",
            "table.default.header.cell.style" : "background-color: #efefef;min-width: 20px;min-height: 20px;border: 1px solid #dedede;",
            "table.default.cell.style" : "min-width: 20px;min-height: 20px;border: 1px solid #dedede;"
        }
        initEditor1({langList : {en : en}, lang : "en", cfgList : cfgList });
        editor1.command("table", ["3,3"]);
        
        var table = editor1.refContent.querySelector("TABLE");
        chai.expect(table.getAttribute("style")).to.equal('border: none;border-collapse: collapse;empty-cells: show;max-width: 100%;');
        chai.expect(table.querySelector("TH").getAttribute("style")).to.equal('background-color: #efefef;min-width: 20px;min-height: 20px;border: 1px solid #dedede;');
        chai.expect(table.querySelector("TD").getAttribute("style")).to.equal('min-width: 20px;min-height: 20px;border: 1px solid #dedede;');
        destroyEditor1();
        initEditor1();
    });
    it('default table style cfg, set by language', () => {
        destroyEditor1();
        var en = Object.assign({}, SubEditor.langList.en, {
            "table.default.table.style" : "color: red;",
            "table.default.header.cell.style" : "color: blue;",
            "table.default.cell.style" : "color: green;"
        });
        var cfgList = {
            "table.default.table.style" : "border: none;border-collapse: collapse;empty-cells: show;max-width: 100%;",
            "table.default.header.cell.style" : "background-color: #efefef;min-width: 20px;min-height: 20px;border: 1px solid #dedede;",
            "table.default.cell.style" : "min-width: 20px;min-height: 20px;border: 1px solid #dedede;"
        }
        initEditor1({langList : {en : en}, lang : "en", cfgList : cfgList });
        editor1.command("table", ["3,3"]);
        var table = editor1.refContent.querySelector("TABLE");
        chai.expect(table.getAttribute("style")).to.equal('color: red;');
        chai.expect(table.querySelector("TH").getAttribute("style")).to.equal('color: blue;');
        chai.expect(table.querySelector("TD").getAttribute("style")).to.equal('color: green;');
        delete SubEditor.langList.en["table.default.table.style"];
        delete SubEditor.langList.en["table.default.header.cell.style"];
        delete SubEditor.langList.en["table.default.cell.style"];
        destroyEditor1();
        initEditor1();
    });
    it('dynamic update table style cfg', () => {
        editor1.setCfg("table.default.table.style", "color: black;");
        editor1.setCfg("table.default.header.cell.style", "color: grey;");
        editor1.setCfg("table.default.cell.style", "color: purple;");
        editor1.command("table", ["3,3"]);
        var table = editor1.refContent.querySelector("TABLE");
        chai.expect(table.getAttribute("style")).to.equal('color: black;');
        chai.expect(table.querySelector("TH").getAttribute("style")).to.equal('color: grey;');
        chai.expect(table.querySelector("TD").getAttribute("style")).to.equal('color: purple;');

        destroyEditor1();
        initEditor1();
    });
    it('test tab to next cell', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[0].firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[0].firstChild, 0);
        sel.addRange(range);
        
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Tab",
            keyCode: 9, // example values.
            code: "Tab", // put everything you need in this object.
            which: 9,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        sel = document.getSelection();
        range = sel.getRangeAt(0);

        chai.expect(range.startContainer).to.equal(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[1]);
    });
    it('test tab in last header to fist td cell', () => {
        editor2.refContent.innerHTML = '<table><thead><tr><th>header 1</th><th>header 2</th><th>header 3</th><th>header 4</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>1</td><td rowspan="3" colspan="2">258369<br><br></td><td><br></td></tr><tr><td>4</td><td><br></td></tr><tr><td>7</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>';
        editor2.selection = null;
        var sel = document.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(editor2.refContent.querySelectorAll("tr")[0].lastChild.firstChild, 0);
        range.setEnd(editor2.refContent.querySelectorAll("tr")[0].lastChild.firstChild, 0);
        sel.addRange(range);
        
        editor2.refContent.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Tab",
            keyCode: 9, // example values.
            code: "Tab", // put everything you need in this object.
            which: 9,
            shiftKey: false, // you don't need to include values
            ctrlKey: false,  // if you aren't going to use them.
            metaKey: false   // these are here for example's sake.
        }));
        sel = document.getSelection();
        range = sel.getRangeAt(0);

        chai.expect(range.startContainer).to.equal(editor2.refContent.querySelectorAll("tbody tr")[0].childNodes[0]);
    });
    
});