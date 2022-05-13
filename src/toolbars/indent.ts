import SubEditor from "../subeditor";


export default function(editor : SubEditor) {
    return {
      indent : {
        command : "indent",
        svg : SubEditor.svgList["indent"],
        tips : "indent"
      },
      outdent : {
        command : "outdent",
        svg : SubEditor.svgList["outdent"],
        tips : "outdent"
      }
    }
}