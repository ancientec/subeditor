import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
        blockquote : {
            command : "blockquote",
            svg : SubEditor.svgList["blockquote"],
            tips : "blockquote"
          }
    }
}