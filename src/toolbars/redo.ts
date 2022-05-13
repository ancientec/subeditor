import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      redo : {
        command : "redo",
        svg : SubEditor.svgList["redo"],
        tips : "redo"
      }
    }
}