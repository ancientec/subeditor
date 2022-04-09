import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      italic : {
        command : "italic",
        svg : SubEditor.svgList["i"],
        tips : "italic"
      }
    }
}