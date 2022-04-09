import SubEditor from "../subeditor";


export default function(editor :SubEditor) {
    return {
      underline : {
        command : "underline",
        svg : SubEditor.svgList["u"],
        tips : "underline"
    }}
}