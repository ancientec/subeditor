"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTag = exports.ALL_TAGS = exports.MARK_TAGS = exports.BLOCK_TAGS = void 0;
exports.BLOCK_TAGS = {
    p: 'p',
    li: 'li',
    ul: 'ul',
    ol: 'ol',
    blockquote: 'blockquote',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
};
/**
 * Tags to marks.
 *
 * @type {Object}
 */
exports.MARK_TAGS = {
    bold: 'strong',
    italic: 'em',
    underline: 'u',
    strikethrough: 'strike',
    subscript: 'sub',
    superscript: 'sup'
};
exports.ALL_TAGS = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "g", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"];
let ALL_TAGS_MAP = {};
exports.ALL_TAGS.forEach(val => ALL_TAGS_MAP[val] = val);
function isTag(tag) {
    if (exports.BLOCK_TAGS[tag])
        return 'block';
    if (exports.MARK_TAGS[tag])
        return 'mark';
    if (ALL_TAGS_MAP[tag])
        return 'all';
    return false;
}
exports.isTag = isTag;
//# sourceMappingURL=tags.js.map