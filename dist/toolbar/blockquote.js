"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        blockquote: {
            command: "blockquote",
            svg: subeditor_1.default.svgList["blockquote"],
            tips: "blockquote"
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=blockquote.js.map