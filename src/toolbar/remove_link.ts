import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      remove_link : {
        command : "remove_link",
        svg : SubEditor.svgList["remove_link"],
        tips : "remove link"
      }
    }
}