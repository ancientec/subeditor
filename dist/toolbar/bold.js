"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        bold: {
            command: "bold",
            svg: subeditor_1.default.svgList["b"],
            tips: "bold"
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=bold.js.map