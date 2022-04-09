const path = require('path');
const fs = require('fs');

emptyBuildFolder(__dirname+"/../../example/nodejs/upload");
emptyBuildFolder(__dirname+"/../../example/php/upload");
emptyBuildFolder(__dirname+"/../../dist");

function emptyBuildFolder(dirPath) {
    const dirContents = fs.readdirSync(dirPath);
  
    for (const fileOrDirPath of dirContents) {
      try {
        // Get Full path
        const fullPath = path.join(dirPath, fileOrDirPath);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          // It's a sub directory
          if (fs.readdirSync(fullPath).length) emptyBuildFolder(fullPath);
          // If the dir is not empty then remove it's contents too(recursively)
          fs.rmdirSync(fullPath);
        } else fs.unlinkSync(fullPath); // It's a file
      } catch (ex) {
        console.error(ex.message);
      }
    }
  }