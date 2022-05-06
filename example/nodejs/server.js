const { randomFillSync } = require('crypto');
const fs = require('fs');
const http = require('http');
const url = require('url');
const https = require('https');
const path = require('path');
const port = process.argv[2] || 8000;


const busboy = require('busboy');

const random = (() => {
  const buf = Buffer.alloc(8);
  return () => randomFillSync(buf).toString('hex');
})();

//samples for library:
let library_data = [];
async function httpsGet(hostname, urlpath) {
    return new Promise(async (resolve, reject) => {
      let body = [];  
      const req = https.request({
        hostname: hostname,
        path: urlpath,
        port: 443,
        method: 'GET'
      }, res => {
        res.on('data', chunk => body.push(chunk));
        res.on('end', () => {
          const d = Buffer.concat(body).toString();
          resolve(d);
        });
      });
      req.on('error', e => {
        console.log(e);
      });
      req.end();
    });
  
}
async function library(page, perpage, keyword) {
    if(library_data.length === 0) {
      library_data = JSON.parse(await httpsGet("picsum.photos", "/v2/list?page=1&limit=100"));
    }
    //filter
    let dataKeyworded = [];
    if(keyword) {
      const kw = keyword.toLowerCase();
      library_data.forEach(d => {
        if(d.author.toLowerCase().indexOf(kw) !== -1) dataKeyworded.push(d);
      });
    } else dataKeyworded = library_data;

    //paging:
    const start = (page - 1) * perpage;
    let dataResult = [];
    for(var i = start; i < start + perpage; i++) {
      if(i >= dataKeyworded.length) break;
      dataResult.push(dataKeyworded[i]);
    }
    return {Pages : {Total : dataKeyworded.length, TotalPages : Math.ceil(dataKeyworded.length/perpage), Page : page, PerPage : perpage}, Data : dataResult};
}


http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    const bb = busboy({ headers: req.headers });
    //output file format:
    let result = {
        Name : "", //filename
        File : "",//filename with path from web root
        URL : "", //full url
        Type : "", // mime type
        Thumb : "", //thumbnail for image
        Size : 0, //file size
        Ext : "" //file extension without dot
    };
    bb.on('file', (name, file, info) => {
      const _Name = `uploaded-${random()}-${info.filename}`;
      result.Name = `${info.filename}`;
      result.URL = "http://localhost:"+port+"/upload/"+_Name;
        if(info.mimeType.indexOf("image/") !== -1) {
            //should be a thumbnail but not implemented here
            result.Thumb = "http://localhost:"+port+"/upload/"+_Name;
        }
        result.File = "/upload/"+_Name;
        result.Type = info.mimeType;
        result.Size = info.Size;
        result.Ext = path.extname(info.filename).substring(1);
        const saveTo = path.join(__dirname+"/upload/", _Name);
        fs.writeFileSync(__dirname+"/upload/"+_Name+".json", JSON.stringify(result));
        file.pipe(fs.createWriteStream(saveTo));
    });
    bb.on('close', () => {
      if(result.Name.indexOf("test-fail") !== -1) {
        //simulate upload error:
        res.statusCode = 500;
        res.end("upload error");
        return;
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(result));
    });
    req.pipe(bb);
    return;
  }
  //render image:
  if(req.method === "GET" && req.url.indexOf("/upload/") === 0 && fs.existsSync(__dirname+"/"+req.url)) {
    //get the mimetype
    const result = JSON.parse(fs.readFileSync(__dirname+"/"+req.url+".json"));
    // read file from file system
    fs.readFile(__dirname+"/"+req.url, function(err, data){
        if(err){
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": result.Type
          });          
          res.end(data);
        }
      });
    return;
  }
  //render library:
  if(req.method === "GET" && req.url.indexOf("/library") === 0) {
    const q = url.parse(req.url,true).query;
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type" : "application/json"
    });
    const result = await library(parseInt(q.page,10) || 1,parseInt(q.perpage,10) || 20, q.keyword || '');      
    res.end(JSON.stringify(result));
    return;
  }
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain"
  });

  res.end("ready for test");
}).listen(port, () => {
  console.log('Listening for requests on '+port);
});