
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, '../svg');

/**
 * 
 * local storage at https://yqnn.github.io/svg-path-editor/
 * variable name : storePaths
 */
//read svg files:
fs.readdir(dir, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    const date = (new Date()).toISOString();
    const storePaths = [];
    files.forEach(function (file) {
        if(file.indexOf(".svg") !== -1) {
            let svgpath = fs.readFileSync(dir + '/' + file, 'utf8');
            svgpath = svgpath.substring(svgpath.indexOf("<path d=\"")+9,svgpath.length - 15);
            storePaths.push({name : file.replace(".svg",""), path : svgpath, createDate : date, changeDate : date});
        }
    });
    fs.writeFileSync(dir+"/svg-path-editor.json", JSON.stringify(storePaths, null, 2));
});
