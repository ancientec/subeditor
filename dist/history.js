"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const textdiff_create_1 = __importDefault(require("textdiff-create"));
const textdiff_patch_1 = __importDefault(require("textdiff-patch"));
const diffpatch_1 = __importDefault(require("./diffpatch"));
const selection_serializer_1 = __importDefault(require("@ancientec/selection-serializer"));
class History {
    constructor(contentContainer) {
        /*
         * list of changes from beginning to end
         */
        this.entryIndex = 0;
        this.entryList = [];
        /*
         * list of entry with undo redo
         */
        this.entryChangeList = [];
        //str value for last content recorded
        this.lastContentStr = null;
        this.id = 0;
        this.counter = -1;
        this.id = ++History.HistoryInstanceCounter;
        this.contentContainer = contentContainer;
        this.lastContentDom = document.createElement(contentContainer.tagName);
    }
    KeyCounter() {
        return ++this.counter;
    }
    /**
     * move one entry up
     * @returns ChangeEntry | null
     */
    Undo() {
        if (this.entryList.length === 0 || this.entryIndex === 0) {
            //no previous step
            return null;
        }
        //calcuate all changes:
        /*this.entryChangeList.push({
            delta : DiffCreate(this.contentContainer.innerHTML || "", str || ""),
            selection : this.entryList[this.entryIndex].selection
        });*/
        //apply last entry to current:
        this.entryIndex = this.entryIndex - 1;
        //start patching from beginning to get the string 2 entries before:
        let str = "";
        for (let i = 0; i <= this.entryIndex; i++) {
            str = (0, textdiff_patch_1.default)(str, this.entryList[i].delta);
        }
        //apply new last entry:
        this.lastContentStr = str;
        this.lastContentDom.innerHTML = str;
        (0, diffpatch_1.default)(this.lastContentDom, this.contentContainer);
        //console.log("undo to",this.entryIndex, str, this.entryList[this.entryIndex].selection);
        //if(target.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", target.innerHTML === lastHistoryStr, target.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML, target.innerHTML) : "", "supposed:",lastHistoryStr, "actual:",target.innerHTML);
        selection_serializer_1.default.restore(this.contentContainer, this.entryList[this.entryIndex].selection);
        return {
            key: this.KeyCounter(),
            change: this.entryList[this.entryIndex],
            content: str
        };
    }
    Redo() {
        if (this.entryIndex + 1 >= this.entryList.length) {
            //no next step
            return null;
        }
        //get patch:
        this.entryIndex = this.entryIndex + 1;
        const currentEntry = this.entryList[this.entryIndex];
        let str = "";
        for (let i = 0; i <= this.entryIndex; i++) {
            str = (0, textdiff_patch_1.default)(str, this.entryList[i].delta);
        }
        //apply:
        this.lastContentStr = str;
        this.lastContentDom.innerHTML = str;
        (0, diffpatch_1.default)(this.lastContentDom, this.contentContainer);
        //console.log("redo", this.entryIndex, str, currentEntry.selection);
        //if(target.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", target.innerHTML === lastHistoryStr, target.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML || "", target.innerHTML || "") : "", "supposed:",lastHistoryStr, "actual:",target.innerHTML);
        selection_serializer_1.default.restore(this.contentContainer, currentEntry.selection);
        return {
            key: this.KeyCounter(),
            change: currentEntry,
            content: this.contentContainer.innerHTML
        };
    }
    Next() {
        if (!this.contentContainer)
            return null;
        if (this.lastContentStr === this.contentContainer.innerHTML)
            return null;
        //console.log("history next selection", selection);
        //remove redo steps:
        if (this.entryList.length > this.entryIndex + 1) {
            this.entryList.splice(this.entryIndex + 1, this.entryList.length - this.entryIndex - 1);
        }
        //create diff:
        const delta = (0, textdiff_create_1.default)(this.lastContentStr || "", this.contentContainer.innerHTML || "");
        //console.log("next delta", lastHistoryStr, target.innerHTML, JSON.stringify(delta), lastHistoryStr);
        this.entryList.push({
            delta: delta,
            selection: selection_serializer_1.default.saveSlim(this.contentContainer)
        });
        this.entryIndex = this.entryList.length - 1;
        //this.entryChangeList.push(this.entryList[this.entryIndex]);
        this.lastContentStr = this.contentContainer.innerHTML;
        (0, diffpatch_1.default)(this.contentContainer, this.lastContentDom);
        //if(lastHistoryDom.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", lastHistoryDom.innerHTML === lastHistoryStr, lastHistoryDom.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML || "", target.innerHTML || "") : "", "supposed:",lastHistoryStr, "actual:",lastHistoryDom.innerHTML);
        //console.log("next length", histories.length, "index", historyIndex, JSON.stringify(histories) );
        return {
            key: this.KeyCounter(),
            change: this.entryList[this.entryList.length - 1],
            content: this.contentContainer.innerHTML
        };
    }
}
exports.History = History;
History.HistoryInstanceCounter = 0;
exports.default = History;
//# sourceMappingURL=history.js.map