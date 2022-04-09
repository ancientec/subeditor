## Language

Default language for SubEditor is en. You may provide your own translation by translating the following json.   

```js

{
    "bold" : "bold",
    "italic" : "italic",
    "underline" : "underline",
    "blockquote" : "blockquote",
    "paragraph" : "paragraph",
    "Normal" : "Normal",
    "Heading 1" : "Heading 1",
    "Heading 2" : "Heading 2",
    "Heading 3" : "Heading 3",
    "Heading 4" : "Heading 4",
    "Heading 5" : "Heading 5",
    "Heading 6" : "Heading 6",
    "Code" : "Code",
    "text color" : "text color",
    "background color" : "background color",
    "SET TEXT COLOR" : "SET COLOR",
    "SET BACKGROUND COLOR" : "SET COLOR",
    "fullscreen" : "fullscreen",
    "exit fullscreen" : "exit fullscreen",
    "table" : "table",
    "align" : "align",
    "align left" : "align left",
    "align center" : "align center",
    "align right" : "align right",
    "align justify" : "align justify",
    "horizontal line" : "horizontal line",
    "view source" : "view source",
    "strikethrough" : "strikethrough",
    "superscript" : "superscript",
    "subscript" : "subscript",
    "indent" : "indent",
    "outdent" : "outdent",
    "format" : "format",
    "remove format" : "remove format",
    "link" : "link",
    "url" : "URL",
    "text" : "TEXT",
    "link target" : "TARGET",
    "remove" : "REMOVE",
    "insert" : "INSERT",
    "update" : "UPDATE",
    "open in new tab" : " (open in new tab)",
    "list" : "list",
    "ordered list" : "ordered list",
    "unordered list" : "unordered list",
    "remove list" : "remove list",
    "image" : "image",
    "uploading" : "uploading",
    "upload failed" : "upload failed",
    "drop or click to upload image" : "drop or click to upload image",
    "please select the appropriate file types:" : "please select the appropriate file types:",
    "max allowed size per file should be " : "max allowed size per file should be ",
    "max allowed size of all files in total should be " : "max allowed size of all files in total should be ",
    "UPLOADING..." : "UPLOADING...",
    "START OVER" : "START OVER"
    
}

```

### presetLang(langList : {[key: string]:{[key: string]: string}})
   
*method: static*   
*params: (langList : {[key: string]:{[key: string]: string}})*  


add or change language, this will affect all instances.   

```js
SubEditor.presetLang({ 
    fr : {
        //some translations
        }
});

//creating an instance of SubEditor using fr as display language
var subeditor = new SubEditor(elm, {lang : "fr"});

```