"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotkey_1 = __importDefault(require("../hotkey"));
exports.default = [
    {
        event: "onCommand",
        target: ["undo"],
        callback: (editor, cmd, value) => {
            editor.handleChange(editor.history.Undo());
        }
    },
    {
        event: "onKeyDown",
        target: ["mod+z"],
        callback: (editor, e) => {
            if (!hotkey_1.default.isUndoHotKey(e))
                return;
            e.preventDefault();
            e.stopPropagation();
            editor.handleChange(editor.history.Undo());
            return false;
        }
    }
];
//# sourceMappingURL=undo.js.map