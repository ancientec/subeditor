
interface FeatureLink {
    href : string,
    target : string,
    node : HTMLElement | undefined,
}
interface FeatureImage {
    src : string,
    width : string,
    height : string,
    node : HTMLElement | undefined,
}
interface FeatureSource {
    src : string,
    type : string
}
interface FeatureVideo {
    controls : boolean,
    autoplay : boolean,
    width : "",
    height : "",
    node : HTMLElement | undefined,
    sources : FeatureSource[]
}
interface FeatureAudio {
    controls : boolean,
    autoplay : boolean,
    width : "",
    height : "",
    node : HTMLElement | undefined,
    sources : FeatureSource[]
}

export class Feature {
    path : string[] = [];
    pathNode : HTMLElement[] = [];
    node : HTMLElement | undefined = undefined;
    nodeName : string = "";
    formatEL : string = "";
    
    color : string = "";
    background : string = "";
    indent : string = "";
    align : string = "";

    bold = false;
    italic = false;
    underline = false;
    strikethrough = false;
    subscript = false;
    superscript = false;

    a : FeatureLink = {
        href : "",
        target : "",
        node : undefined,
    };
    img : FeatureImage = {
        src : "",
        width : "",
        height : "",
        node : undefined
    };
    video? : FeatureVideo = undefined;
    audio? : FeatureAudio = undefined;
    
}

function nodeAttrStyle(el : HTMLElement, tag? : string) {
    let styles : any = {};
    if (!el || !el.style) return styles;
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim()) return;
        const idx = pair.indexOf(":");
        if (idx === -1) return;
        let p = [pair.substring(0, idx).trim(),(pair.substring(idx+1) || "").trim()];
        styles[p[0]] = p[1];
        if (p[0] === "background" && p[1].indexOf('url(') === 0) {
            styles[p[0]] = el.style.background;
        }
    });
    if (tag) return styles[tag] || "";
    return styles;
}
function parseFeature(n : Node, container : HTMLElement) : Feature {
    //get the tag name & style
    let f  = new Feature();
    if (!n || !container) return f;

    let styles : any = {},style : any = {};
    
    f.node = n.nodeType === Node.TEXT_NODE ? n.parentElement! : n as HTMLElement;
    f.nodeName = f.node.nodeName;

    let el = f.node;
    while (el && el !== container) {
        f.path.push(el.nodeName);
        f.pathNode.push(el);
        //get style attribute:
        let s = nodeAttrStyle(el);
        Object.keys(s).forEach(key => {
            if (typeof styles[key] === "undefined") {
                styles[key] = s[key];
            }
        });
        el = el.parentElement!;
    }

    
    const formats = ['P','H1','H2','H3','H4','H5','H6','CODE','PRE'];
    let formatEL = "";
    for(let i = 0; i < f.path.length;i++) {
        if (formatEL === "" && formats.indexOf(f.path[i]) !== -1) {
            formatEL = f.path[i];
            break;
        }
    }
    if (formatEL === "PRE") formatEL = "CODE";
    f.formatEL = formatEL;
    f.bold = f.path.indexOf('STRONG') !== -1;
    f.italic = f.path.indexOf('EM') !== -1;
    f.underline = f.path.indexOf('U') !== -1;
    f.strikethrough = f.path.indexOf('STRIKE') !== -1;
    f.subscript = f.path.indexOf('SUB') !== -1;
    f.superscript = f.path.indexOf('SUP') !== -1;

    //parse img, use mouse over instead:
    //parse link:
    if (f.path.indexOf('A') !== -1) {
        const node = f.pathNode[f.path.indexOf('A')];
        f.a = {
            href : node.getAttribute('href') || "",
            target : node.getAttribute('target') || "",
            node : node,
        }
    }
    //parse img:
    if (f.path[0] === "IMG") {
        
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        f.img = {
            src : node.getAttribute('src') || "",
            width : styleimg['width'] || '',
            height : styleimg['height'] || '',
            node : node,
        }
    }
    //parse video:
    if (f.path[0] === "VIDEO") {
        
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        
        f.video = {
            controls : node.hasAttribute("controls"),
            autoplay : node.hasAttribute("autoplay"),
            width : styleimg['width'] || '',
            height : styleimg['height'] || '',
            node : node,
            sources : []
        }
        node.querySelectorAll("source").forEach((source) => {
            f.video?.sources.push({src : source.getAttribute("src") as string || "", type : source.getAttribute("type") as string || "" });
        });
    }
    //parse audio:
    if (f.path[0] === "AUDIO") {
        
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        
        f.video = {
            controls : node.hasAttribute("controls"),
            autoplay : node.hasAttribute("autoplay"),
            width : styleimg['width'] || '',
            height : styleimg['height'] || '',
            node : node,
            sources : []
        }
        node.querySelectorAll("source").forEach((source) => {
            f.video?.sources.push({src : source.getAttribute("src") as string || "", type : source.getAttribute("type") as string || "" });
        });

    }

    if (f.node && f.node !== container) {
        //parse immediate style:
        style = nodeAttrStyle(f.node);
        //console.log("nodeParseFeatures", nodes);
        //parse color:
        f.color = style['color'] ? style['color'] : "";
        f.background = style['background-color'] ?  style['background-color'] : "";
        f.indent = style['padding-left'] ? style['padding-left'] : "";
        f.align = style['text-align'] ? style['text-align'] : "";
    }

    return f;
}

export default parseFeature;