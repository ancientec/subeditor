"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_hotkey_1 = require("is-hotkey");
exports.default = {
    isBoldHotkey: (0, is_hotkey_1.isKeyHotkey)('mod+b'),
    isItalicHotkey: (0, is_hotkey_1.isKeyHotkey)('mod+i'),
    isUnderlinedHotkey: (0, is_hotkey_1.isKeyHotkey)('mod+u'),
    isCodeHotkey: (0, is_hotkey_1.isKeyHotkey)('mod+`'),
    isSaveHotKey: (0, is_hotkey_1.isKeyHotkey)('mod+s'),
    isUndoHotKey: (0, is_hotkey_1.isKeyHotkey)('mod+z'),
    isRedoHotKey: (0, is_hotkey_1.isKeyHotkey)('mod+y'),
    isCopyHotKey: (0, is_hotkey_1.isKeyHotkey)('mod+c'),
    isPasteHotKey: (0, is_hotkey_1.isKeyHotkey)('mod+v'),
    isBackspace: (0, is_hotkey_1.isKeyHotkey)('backspace'),
    isArrowLeft: (0, is_hotkey_1.isKeyHotkey)('arrowleft'),
    isEnter: (0, is_hotkey_1.isKeyHotkey)('enter'),
    isTab: (0, is_hotkey_1.isKeyHotkey)('tab'),
};
//# sourceMappingURL=hotkey.js.map