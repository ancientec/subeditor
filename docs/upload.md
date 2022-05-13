## Upload

Uploading requires extra config variables and server setup. Please visit /example for samples of server script in PHP and nodejs. This feature support drop and upload progress

## Config Variables

```js

//optional:
var elFunc = (o) => {
    //o is the result from your server, can be in any format but should contain the file type to determine which format to insert into editor
    if(o.Type.indexOf("image/") !== -1) {
        const _node = document.createElement("img");
        _node.setAttribute("data-action", "upload");
        _node.setAttribute("src", o.URL);
        _node.setAttribute("style","max-width:100%");
        return _node;
    } else {
        const _node = document.createElement("a");
        _node.setAttribute("data-action", "upload");
        _node.setAttribute("href", o.URL);
        _node.setAttribute("target","_blank");
        _node.innerHTML = o.Name;
        return _node;
    }
};

var cfg = {};
cfg["image.features"] = ["url","upload","library"];
cfg["image.accept.types"] = "text/plain, image/jpeg, image/jpg, image/png, image/apng, image/gif, image/webp";
cfg["image.upload.url"] = "upload.php";
cfg["image.drop.to.content.upload"] =  true;
cfg["image.upload.accept.files"] =  0;
cfg["image.upload.max.size"] = 2.5;
cfg["image.upload.max.size.per.file"] = 0.5;
cfg["image.upload.max.files"] = 3;
cfg["image.upload.handler"] =  (file, responseText, callback) => {
    var o = JSON.parse(responseText);
    callback(o.URL, o.Thumb, o, () => {return elFunc(o)});
};


new SubEditor(elem, {cfgList : cfg});

```

### image.features

Enable url, upload,or library features on submenu in toolbar.   

### image.drop.to.content.upload

Whether to allow uploading when directly dropping files into content. (true = allow, default=false)

### image.accept.types

Mime types accepted for upload.     


### image.upload.url

The server URL for uploading files. Each request will handle one file. 

### image.upload.accept.files

Limit number of files per batch, default 0 for unlimited. This value limits the number of files to be selected or dropped per batch.   

### image.upload.max.size

The total allowed file sizes in MB per batch. This value will also take into account of the existing uploaded files in content. By removing the element(link or image) from content will reduce the total uploaded size.   

### image.upload.max.size.per.file

The maximum file size in MB per single file.   

### image.upload.max.files

The maximum number of uploaded files to be included in content. This value takes into account of currently existing uploaded files in content, by removing the element(link or image) from content will reduce the number count.

### image.upload.handler

This function is designed to process server repsonse after upload, and update SubEditor.

#### Callback(url : string, thumb : string, obj : any, elFunc : Function | undefined)

- url: the url of uploaded file
- thumb(optional): thumbnail url of uploaded file
- obj(optional): the obj representation of uploaded file
- elFunc: the user-defined dom element for inserting into SubEditor. By default SubEditor will create image element and hyperlink for non image 