function is(node, tag) {
    //let prop = "";
    switch(tag){
        case "b":
        case "bold":
        const style1 = window.getComputedStyle(node).fontWeight || "";
        return style1 && (parseInt(style1, 10) >= 700 || style2.indexOf('bold') !== -1); 
        case "i":
        case "italic":
        const style2 = window.getComputedStyle(node).fontStyle || "";
        return style2.indexOf('italic') !== -1;
        case "u":
        case "underline":
        const style3 = window.getComputedStyle(node).fontStyle || "";
        return style3.indexOf('underline') !== -1;
        default:
        return false;

    }
}

const exp = {
    is : is
};
export default exp;