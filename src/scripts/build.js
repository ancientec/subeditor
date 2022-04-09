
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, '../svg');


//read svg files:
fs.readdir(dir, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    const svgList = {};
    files.forEach(function (file) {
        if(file.indexOf(".svg") !== -1) {
            svgList[file.replace(".svg","")] = fs.readFileSync(dir + '/' + file, 'utf8');
        }
    });
    fs.writeFileSync(dir+"/index.ts", "export default " + JSON.stringify(svgList, null, 2));
});

//read css:
const cssFileList = ["editor","toolbar","dialog","image","color"];
let cssList = "";
cssFileList.forEach(function (file) {
        cssList += fs.readFileSync(path.join(__dirname, '../css/' + file + ".css"), 'utf8');
});
let r = new RegExp("(\n    )", "g");
cssList = cssList.replace(r, "").replace(/(\n)/g,"").replace(/(\t)/g,"");

fs.writeFileSync(path.join(__dirname, '../css/index.ts'), "export default " + JSON.stringify(cssList, null, 2));