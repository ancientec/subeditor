import { isKeyHotkey } from 'is-hotkey'

export default {
    isBoldHotkey : isKeyHotkey('mod+b'),
    isItalicHotkey : isKeyHotkey('mod+i'),
    isUnderlinedHotkey : isKeyHotkey('mod+u'),
    isCodeHotkey : isKeyHotkey('mod+`'),
    isSaveHotKey : isKeyHotkey('mod+s'),
    isUndoHotKey : isKeyHotkey('mod+z'),
    isRedoHotKey : isKeyHotkey('mod+y'),
    isCopyHotKey : isKeyHotkey('mod+c'),
    isPasteHotKey : isKeyHotkey('mod+v'),
    isBackspace : isKeyHotkey('backspace'),
    isArrowLeft : isKeyHotkey('arrowleft'),
    isEnter : isKeyHotkey('enter'),
    isTab : isKeyHotkey('tab'),
};