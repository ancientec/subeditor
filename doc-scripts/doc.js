const http = require('http');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const mime = require('mime');
const { disposeEmitNodes } = require('typescript');
const md = require('markdown-it')({
    highlight: function (str,  lang ) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, {"language": lang, "ignoreIllegals" : true }).value;
        } catch (__) {}
      }
      return '';
    }
});
//console.log(process.argv[2], process.argv[3]);
if(!fs.existsSync(process.argv[2])) {
    console.log("please provide config json file");
    process.exit(1);
}
if(!["build","preview"].includes(process.argv[3])) {
    console.log("please specify build or preview action");
    process.exit(1);
}
const file_config = path.resolve(process.argv[2]);
const path_current = process.cwd();
let path_config = path.dirname(file_config);

let config = loadConfig();
const port = config.previewPort;

switch(process.argv[3]) {
  case "build": 
    build();
  break;
  case "preview":
    preview();
  break;
}



function preview() {
    http.createServer(async (req, res) => {
        config =loadConfig();
        const languages = Object.keys(config.lang);
        const url = new URL(req.url, `http://${req.headers.host}`);
        let lang = languages.find((element) => url.pathname === "/"+element || url.pathname.indexOf("/"+element+"/") === 0);
        const dir =  path_config+"/"+config.sourcePath;
        let file = "";
        if(typeof lang === "undefined") {
            lang = languages[0];
        }
        file += url.pathname;
    
        if(file.indexOf(".js") !== -1 || file.indexOf(".css") !== -1 && fs.existsSync(dir+file)){
            //serve the resource:
            fs.readFile(dir+file, function(err, data){
                if(err){
                  res.statusCode = 500;
                  res.end(`Error getting the file: ${err}.`);
                } else {
                  // if the file is found, set Content-type and send data
                  res.writeHead(200, {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": file.indexOf(".js") !== -1 ? "text/javascript" : "text/css"
                  });          
                  res.end(data);
                }
            });
    
        } else {
            
            if(["", "/", "/index.html", "/"+lang+"/" ,"/"+lang+"/index.html"].includes(file)) {
    
                if(fs.existsSync(dir+"/"+config.lang[lang].landing)) {
                    //index/landing page
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "text/html"
                    });          
                    res.end(replaceHTML(config, fs.readFileSync(dir+"/"+config.lang[lang].landing).toString(), lang));
                    return;
                } else {
                    file = Object.keys(config.lang[lang]["pages"])[0];
                }
                
            }
            let source = "";
            const pages = get_page_order(config, lang), exists = fs.existsSync(dir+file), ext = path.extname(dir+file).substring(1);
            let pageIndex = -1;
            //check if it is html or md
            //console.log(dir+file);
            if(exists) {
                if(ext !== "html") {
                    //serve file:
                    res.writeHead(200, {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": mime.getType(file)
                    }); 
                    res.end(fs.readFileSync(dir+file));
                    return;
                }
                source = fs.readFileSync(dir+file).toString();
                const f = file.substring(1);
                pageIndex = pages.findIndex(p => p.page === f);
            } else if(fs.existsSync(dir+file.substring(0,file.lastIndexOf(".html"))+".md")) {
                source = fs.readFileSync(dir+file.substring(0,file.lastIndexOf(".html"))+".md").toString();
                source = md.render(source, {});
                const f = (file.substring(0,file.lastIndexOf(".html"))+".md").substring(1);
                pageIndex = pages.findIndex(p => p.page === f);
            }
    
            if(source === "") {
                res.statusCode = 404;
                res.end("file not found");
                return;
            }
            if(source.indexOf("<html") === -1) {
                source = render_template(config, lang, source, pages, pageIndex);
            }
            
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/html"
            }); 
            res.end(replaceHTML(config, source, lang));
        }
        
    
    }).listen(port, () => {
        console.log('Listening for requests on '+port);
    });
}

function loadConfig() {
    return JSON.parse(fs.readFileSync(file_config).toString());
}
function replaceHTML(config, source, ln) {
    return source.toString().replaceAll("{name}", config.name)
                .replaceAll("{title}", config.title)
                .replaceAll("{title_suffix}", config.lang[ln].title_suffix)
                .replaceAll("{description}", config.description)
                .replaceAll("{version}", config.version)
                .replaceAll("{github}", config.github || "#")
                .replaceAll("{logo}", config.logo ? '<img src="'+config.logo+'" alt="'+config.name+'">' : '');
}
function render_template(config, ln, content, pages, pageIndex) {
    let prevTitle = "", prevLink = "#", nextTitle = "", nextLink = "#";
    if(pageIndex > 0) {
        prevTitle = pages[pageIndex-1]["title"];
        prevLink = pages[pageIndex-1]["page"].replace(".md", ".html");
    }
    if(pageIndex < pages.length -1) {
        nextTitle =  pages[pageIndex+1]["title"];
        nextLink = pages[pageIndex+1]["page"].replace(".md", ".html");
    }

    let langs = Object.keys(config.lang), has_translation = "", translations = "";
    if(langs.length > 1) {
        has_translation = "has-translation";
        langs.forEach(l => {//path need to be relative
            if(l === ln) {
                translations += '<a class="navbar-item" href="#">'+config.lang[l].name+'</a>';
                return;
            }
            if(ln === langs[0]) {
                //from en->zh
                translations += '<a class="navbar-item" href="'+l+'/">'+config.lang[l].name+'</a>';
            } else if(l === langs[0]) {
                //from zh->en
                translations += '<a class="navbar-item" href="../">'+config.lang[l].name+'</a>';
            } else {
                //from zh->fr
                translations += '<a class="navbar-item" href="../'+l+'/">'+config.lang[l].name+'</a>';
            }
            
        });
    }
    let str = fs.readFileSync(path_config+"/"+config.sourcePath+"/"+config["lang"][ln]["template"]).toString()
            .replace("{has_translation}", has_translation)
            .replace("{translations}", translations)
            .replace("{content}", content)
            .replace("{prev_title}", prevTitle)
            .replace("{prev_link}", prevLink)
            .replace("{next_title}", nextTitle)
            .replace("{next_link}", nextLink)
            .replace("{sidemenu}", render_sidemenu(config, ln)).toString();
    if(pageIndex > -1) {
        str = str.replace("{page_title}", pages[pageIndex]['title'])
            .replace("{title_suffix}", config.lang[ln].title_suffix);
    } else {
        str = str.replace("{page_title}{title_suffix}","{title}");
    }
    return str;
}
function get_page_order(config, ln) {
    let pages = [];
    config.lang[ln].sidemenu.forEach(b => {
        if(b.page) pages.push(b);
        if(typeof b.pages !== "undefined") {
            b.pages.forEach(subp => {
                if(subp.page) pages.push(subp);
            });
        }
    });
    return pages;
}
function convert_page_to_url(page) {
    let u = page;//(page.indexOf(ln+"/") === -1) ? ln+"/"+page : page;
    if(u.substring(u.lastIndexOf(".")) === ".md") u = u.substring(0,u.lastIndexOf("."))+".html";
    return u;
}
function render_sidemenu(config, ln) {
    let menu = '<ul class="menu-list">';
    config.lang[ln].sidemenu.forEach(b => {
        
        if(typeof b.pages !== "undefined") {
            
            if(b.page) menu += '<li><a href="'+convert_page_to_url(b.page)+'">'+b.title+'</a><ul>';
            b.pages.forEach(subp => {
                if(subp.page) {
                    menu += '<li><a href="'+convert_page_to_url(subp.page)+'">'+subp.title+'</a></li>';
                } else {
                    menu += '<li><a>'+subp.title+'</a></li>';
                }
            });
            menu += '</ul>';
        }else if(b.page) {
            menu += '<li><a href="'+convert_page_to_url(b.page)+'">'+b.title+'</a></li>';
        } else {
            menu += '<li><a>'+b.title+'</a></li>';
        }
    });
    menu += '</ul>';
    return menu;
}

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
function build() {
    if(!fs.existsSync(path_config+"/"+config.sourcePath) || !fs.existsSync(path_config+"/"+config.buildPath)) return;

    emptyBuildFolder(path_config+"/"+config.buildPath);
    const langs = Object.keys(config.lang);
    const readdirSync = (p, a = []) => {
        if (fs.statSync(p).isDirectory())
        fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a))
        return a
    }
    const files = readdirSync(path_config+"/"+config.sourcePath);

    const findFileLang = (f) => {
        let ln = langs.find(l => f.indexOf("/"+l+"/") !== -1);
        if(typeof ln === "undefined") ln = langs[0];
        return ln;
    };
    const pagesByLang = {};
    files.forEach(f => {
        let destPath = path_config+"/"+f.replace(path.resolve(path_config+"/"+config.sourcePath), config.buildPath), stat = fs.statSync(f);
        if(stat.isDirectory()) {
            
            if(!fs.existsSync(destPath) || !fs.statSync(destPath).isDirectory()) fs.mkdirSync(destPath);
            return;
            
        }
        //determine if need to apply template:
        const page = f.replace(path_config+"/"+config.sourcePath+"/", ""),lang = findFileLang("/"+page);
        let source = "", pageIndex = -1;
        if(typeof pagesByLang[lang] === "undefined") {
            pagesByLang[lang] = get_page_order(config, lang);
        }
        //skip template file
        if(f.indexOf(config.lang[lang]['template']) !== -1) return;
        //convert landing to index:
        if(f.indexOf(config.lang[lang]['landing']) !== -1) {
            const lastSlash = config.lang[lang]['landing'].lastIndexOf("/");
            if(lastSlash !== -1) {
                destPath = destPath.replace(config.lang[lang]['landing'].substring(lastSlash), "/index.html");
            } else {
                destPath = destPath.replace(config.lang[lang]['landing'], "index.html");
            }
            
        }

        if(path.extname(f) === ".md") {
            source = fs.readFileSync(f).toString();
            source =md.render(source, {});
        
            pageIndex = pagesByLang[lang].findIndex(p => p.page === page);
            source =  replaceHTML(config, render_template(config, lang, source, pagesByLang[lang], pageIndex), lang);

            fs.writeFileSync(destPath.substring(0, destPath.length-3)+".html", source);
            return;
        }
        if(path.extname(f) === ".html") {
            source = fs.readFileSync(f);
            if(source.indexOf("<html") === -1) {
                pageIndex = pagesByLang[lang].findIndex(p => p.page === page);
                source = replaceHTML(config, render_template(config, lang, source, pagesByLang[lang], pageIndex), lang);
            } else {
                source = replaceHTML(config, source, lang);
            }
            fs.writeFileSync(destPath, source);
            return;
        }
        fs.copyFileSync(f, destPath);

    });
}