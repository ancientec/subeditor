"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotkey_1 = __importDefault(require("../hotkey"));
exports.default = [
    {
        event: "onCommand",
        target: ["redo"],
        callback: (editor, cmd, value) => {
            editor.handleChange(editor.history.Redo());
        }
    },
    {
        event: "onKeyDown",
        target: ["mod+y", "cmd+shift+z"],
        callback: (editor, e) => {
            if (!hotkey_1.default.isRedoHotKey(e))
                return;
            e.preventDefault();
            e.stopPropagation();
            editor.handleChange(editor.history.Redo());
            return false;
        }
    }
];
//# sourceMappingURL=redo.js.map