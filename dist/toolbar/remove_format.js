"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("../subeditor"));
function default_1(editor) {
    return {
        remove_format: {
            command: "remove_format",
            svg: subeditor_1.default.svgList["remove_format"],
            tips: "remove format"
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=remove_format.js.map