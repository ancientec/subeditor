"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
class Feature {
    constructor() {
        this.path = [];
        this.pathNode = [];
        this.node = undefined;
        this.nodeName = "";
        this.formatEL = "";
        this.color = "";
        this.background = "";
        this.indent = "";
        this.align = "";
        this.bold = false;
        this.italic = false;
        this.underline = false;
        this.strikethrough = false;
        this.subscript = false;
        this.superscript = false;
        this.a = {
            href: "",
            target: "",
            node: undefined,
        };
        this.img = {
            src: "",
            width: "",
            height: "",
            node: undefined
        };
        this.video = undefined;
        this.audio = undefined;
    }
}
exports.Feature = Feature;
function nodeAttrStyle(el, tag) {
    let styles = {};
    if (!el || !el.style)
        return styles;
    const s = (el.getAttribute("style") || "").split(';');
    s.forEach(pair => {
        if (!pair.trim())
            return;
        const idx = pair.indexOf(":");
        if (idx === -1)
            return;
        let p = [pair.substring(0, idx).trim(), (pair.substring(idx + 1) || "").trim()];
        styles[p[0]] = p[1];
        if (p[0] === "background" && p[1].indexOf('url(') === 0) {
            styles[p[0]] = el.style.background;
        }
    });
    if (tag)
        return styles[tag] || "";
    return styles;
}
function parseFeature(n, container) {
    //get the tag name & style
    let f = new Feature();
    if (!n || !container)
        return f;
    let styles = {}, style = {};
    f.node = n.nodeType === Node.TEXT_NODE ? n.parentElement : n;
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
        el = el.parentElement;
    }
    const formats = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE', 'PRE'];
    let formatEL = "";
    for (let i = f.path.length - 1; i >= 0; i--) {
        if (formatEL === "" && formats.indexOf(f.path[i]) !== -1) {
            formatEL = f.path[i];
            break;
        }
    }
    if (formatEL === "PRE")
        formatEL = "CODE";
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
            href: node.getAttribute('href') || "",
            target: node.getAttribute('target') || "",
            node: node,
        };
    }
    //parse img:
    if (f.path[0] === "IMG") {
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        f.img = {
            src: node.getAttribute('src') || "",
            width: styleimg['width'] || '',
            height: styleimg['height'] || '',
            node: node,
        };
    }
    //parse video:
    if (f.path[0] === "VIDEO") {
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        f.video = {
            controls: node.hasAttribute("controls"),
            autoplay: node.hasAttribute("autoplay"),
            width: styleimg['width'] || '',
            height: styleimg['height'] || '',
            node: node,
            sources: []
        };
        node.querySelectorAll("source").forEach((source) => {
            var _a;
            (_a = f.video) === null || _a === void 0 ? void 0 : _a.sources.push({ src: source.getAttribute("src") || "", type: source.getAttribute("type") || "" });
        });
    }
    //parse audio:
    if (f.path[0] === "AUDIO") {
        const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
        f.video = {
            controls: node.hasAttribute("controls"),
            autoplay: node.hasAttribute("autoplay"),
            width: styleimg['width'] || '',
            height: styleimg['height'] || '',
            node: node,
            sources: []
        };
        node.querySelectorAll("source").forEach((source) => {
            var _a;
            (_a = f.video) === null || _a === void 0 ? void 0 : _a.sources.push({ src: source.getAttribute("src") || "", type: source.getAttribute("type") || "" });
        });
    }
    if (f.node && f.node !== container) {
        //parse immediate style:
        style = nodeAttrStyle(f.node);
        //console.log("nodeParseFeatures", nodes);
        //parse color:
        f.color = style['color'] ? style['color'] : "";
        f.background = style['background-color'] ? style['background-color'] : "";
        f.indent = style['padding-left'] ? style['padding-left'] : "";
        f.align = style['text-align'] ? style['text-align'] : "";
    }
    return f;
}
exports.default = parseFeature;
//# sourceMappingURL=feature.js.map