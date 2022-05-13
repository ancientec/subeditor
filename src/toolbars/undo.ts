import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      undo : {
        command : "undo",
        svg : SubEditor.svgList["undo"],
        tips : "undo"
      }
    }
}