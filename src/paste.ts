
export function getType(transfer : DataTransfer, type : string) {
    if (!transfer.types || !transfer.types.length) {
      // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
      // is supported`. (2017/06/23)
      return type === "text/plain" ? transfer.getData('Text') || null : null
    }
  
    // COMPAT: In Edge, transfer.types doesn't respond to `indexOf`. (2017/10/25)
    const types = Array.from(transfer.types)
  
    return types.indexOf(type) !== -1 ? transfer.getData(type) || null : null
}
export function mergeTag(nodes : Element[], tag : string) {
  const length = nodes.length;
  if (length === 0) return;
  for(let i = length - 1; i  >= 0; i--) {
    let cur = nodes[i], prev = cur.previousSibling;
    //is text or span
    if (prev && prev.nodeName.toLowerCase() === tag) {
      prev.textContent += cur.textContent || "";
      cur.parentNode?.removeChild(cur);
    }
  }
}
export function cleanupHtml(html : string) {
  if(!html.trim()) return html;
  let parser = new DOMParser();
  let doc = parser.parseFromString('<html><head><meta charset="utf-8"></head><body>'+ html+'</body></html>', "text/html");
  let els = doc.querySelectorAll("*"), length = els.length;
  for(let i = 1; i < length; i++) {
      let el = els[i];
      normalizeStyle(el);
  }
  
  let body = doc.querySelector("body")!;
  body.normalize();
  //merge multiple spans:
  let spans = doc.querySelectorAll("body span");
  length = spans.length;
  for(let i = length - 1; i  >= 0; i--) {
    let cur = spans[i], prev = cur.previousSibling, curStyle = cur.getAttribute("style");
    //is text or span
    if (prev && (
      (prev.nodeType === 3 && !curStyle) //span with no style can merge with text node
       || 
      (prev.nodeName === "SPAN" && curStyle === (prev as HTMLElement).getAttribute("style")) //span with exact style can merge together
      )) {
      prev.textContent += cur.textContent || "";
      cur.parentNode?.removeChild(cur);
    }
  }
  //conver b = strong
  let bs = doc.querySelectorAll("body b");
  for(let i = bs.length - 1; i  >= 0; i--) {
      let n = bs[i], el = document.createElement("strong");
      el.innerHTML = n.innerHTML;
      n.replaceWith(el);
  }
   //conver i = em
   bs = doc.querySelectorAll("body i");
   for(let i = bs.length - 1; i  >= 0; i--) {
       let n = bs[i], el = document.createElement("em");
       el.innerHTML = n.innerHTML;
       n.replaceWith(el);
   }
  //clean up and merge tags in two level deep
  const mergerTags = ['strong','em','u','strike','sub','sup','strong','em','u','strike','sub','sup'];
  mergerTags.forEach( (tag) => {
    mergeTag(Array.from(doc.querySelectorAll("body "+tag)), tag);
  });
  //console.log("paste processed html", body.innerHTML);
  //console.log(doc, doc.querySelectorAll("body span"), body);
  
  //remove header information pasted from wechat
  let nodes = doc.querySelectorAll("body > meta, body > title, body > style");
  for (let i = nodes.length -1; i >= 0; i--) {
    if(nodes[i]) nodes[i].parentNode?.removeChild(nodes[i]);
  }
  return body.innerHTML;
}

function normalizeStyle(el : Element) {
    let cssText = "", tag = el.nodeName.toLowerCase(),str = el.getAttribute("style");
    el.removeAttribute('class');
    if (!str) return;
    //skip elements:
    if (['tr','td','th','tbody','tfoot'].indexOf(tag) !== -1 ) {
      el.removeAttribute('style');
      return;
    }

    //convert attr to style:
    let attr = el.getAttribute("align");
    if (attr) {
      attr = attr.trim().toLowerCase();
      if (attr !== "start") {
        str =  "text-align:"+attr+";" + str;
      }
      el.removeAttribute("align");
    }
    const s = str.split(';');
    
    s.forEach(pair => {
      if (!pair.trim()) return;
      const p = pair.split(":");
      if (p.length === 1) return;
      const y = p[0].trim().toLowerCase();
      const v = p[1].trim();
      if (['inherit','auto','none','0px'].indexOf(v) !== -1) {
        return;
      }
        switch(y) {
          //case "lineHeight":
          case "width":
          case "height":
          case "padding-left":
          /*case "paddingRight":
          case "paddingTop":
          case "paddingBottom":
          case "marginLeft":
          case "marginRight":
          case "marginTop":
          case "marginBottom":*/
          if(parseFloat(v) !== 0) {
            cssText += y + ": "+v + ";";
           }
          break;
          case "color":
            cssText += y + ": "+ v + ";";
          break;
          case "text-align":
            attr = v.toLowerCase();
            if (attr !== "start") {
              cssText += y + ": "+ attr + ";";
            }
          break;
          case "border":
           if(v.indexOf('0px') !== -1) {
            cssText += y + ": "+ v + ";";
           }
          break;
          case "background":
           if(v && v.indexOf('url(') === 0) {
            cssText += y + ": "+(el as HTMLElement).style.background + ";";
           }
          break;
          case "background-color":
           if(v && v.indexOf('transparent') === -1 && v.toLowerCase() !== '#fff' && v.toLowerCase() !== '#ffffff') {
            cssText += y + ": "+v + ";";
           }
          break;
          default:
          break;
  
        }
        
    });
    if(cssText) el.setAttribute('style', cssText);
    else el.removeAttribute('style');
}
