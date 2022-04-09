import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      bold : {
        command : "bold",
        svg : SubEditor.svgList["b"],
        tips : "bold"
      }
    }
}