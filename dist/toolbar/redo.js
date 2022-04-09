"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        redo: {
            command: "redo",
            svg: subeditor_1.default.svgList["redo"],
            tips: "redo"
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=redo.js.map