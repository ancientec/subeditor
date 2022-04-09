function mapAttr(source : HTMLElement, target : HTMLElement) {
    //console.log("map attr", source, target);
    let source_attributes : any = {};
    let i = 0, n = 0, atts;
    for (i = 0, atts = source.attributes, n = atts.length; i < n; i++){
        let name = atts[i].nodeName || atts[i].name, v : any = atts[i].value;
        //console.log("map attr source",i, name, v, target.getAttribute(name));
        if (!v) continue;
        source_attributes[name] = v;
        if (v === target.getAttribute(name)) continue;
        //new or change apply to target:
        target.setAttribute(name,v);
    }

    for (i = target.attributes.length - 1, atts = target.attributes; i >= 0; i--){
        let name = atts[i].nodeName || atts[i].name, v : any = atts[i].value;
        //console.log("map attr target",i, name, v);
        if (!v ) continue;
        if (typeof source_attributes[name] === "undefined") {
            //remove from target:
            target.removeAttribute(name);
            //console.log("map attr target remove",i, name, v);
        }
    }
}
export default function diffPatch(source : HTMLElement, target : HTMLElement, skipContainerAttr = true) : void {
    //console.log("diffPatch", source, target, skipContainerAttr);
    if (source.nodeType === 3 && target.nodeType === 3) {
        //text node:
        if ( source.textContent !== target.textContent ) {
            target.textContent = source.textContent;
        }
        return;
    }
    
    if (source.nodeType !== target.nodeType || source.nodeName !== target.nodeName) {
        target.replaceWith(source.cloneNode(true));
        return;
    }

    if(!skipContainerAttr) mapAttr(source, target);

    if ((!target.childNodes || target.childNodes.length === 0) && //target is empty
        (source.childNodes && source.childNodes.length !== 0)) { //source has childNodes
        Array.from(source.childNodes).forEach((node : ChildNode) => {
            target.appendChild(node.cloneNode(true));
        });
        return;
    }

    Array.from(source.childNodes).forEach((node : ChildNode, idx : number) => {

        if ( typeof target.childNodes[idx] === "undefined") { //targe has no child on the same index
            //append to target:
            target.appendChild(node.cloneNode(true));
            return;
        }
        if (node.nodeType !== target.childNodes[idx].nodeType) {
            target.childNodes[idx].replaceWith(node.cloneNode(true));
        }
        else if (node.nodeType === 3) {
            if (target.childNodes[idx].textContent !== node.textContent) {
                target.childNodes[idx].textContent = node.textContent;
            }
            return;
        } else {
            //element type !== 3:
            diffPatch(node as HTMLElement, target.childNodes[idx] as HTMLElement, false);
        }
    });
    
    //remove extras:
    while (target.lastChild && target.childNodes.length > source.childNodes.length) {
        target.removeChild(target.lastChild);
    }
}