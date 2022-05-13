import SubEditor from "../subeditor";

export default function(editor : SubEditor) {
    const o = {
        command : "",
        svg : "",
        tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem seperator"><span class="se-icon"><span></span>'
      };
    return {
      "|" : o, "seperator" : o
    }
}