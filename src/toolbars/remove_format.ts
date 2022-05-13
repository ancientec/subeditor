import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      remove_format : {
        command : "remove_format",
        svg : SubEditor.svgList["remove_format"],
        tips : "remove format"
      }
    }
}