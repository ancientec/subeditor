import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      hr : {
        command : "hr",
        svg : SubEditor.svgList["hr"],
        tips : "horizontal line"
      }
    }
}