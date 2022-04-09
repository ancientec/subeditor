import DiffCreate from 'textdiff-create'
import DiffPatch from 'textdiff-patch'
import nodeDiffpatch from './diffpatch'
import selectionSerializer, {SelectionSlimState} from '@ancientec/selection-serializer'

export interface HistoryEntry {
    delta : any[];
    selection : SelectionSlimState;
}
export interface ChangeEntry {
    key : number,
    change : HistoryEntry,
    content : string
}

export class History {

    /*
     * list of changes from beginning to end
     */
    public entryIndex = 0;
    public entryList : HistoryEntry[] = [];
    /*
     * list of entry with undo redo 
     */
    public entryChangeList : HistoryEntry[] = [];
    //str value for last content recorded
    public lastContentStr : string | null = null;
    //inject to test and prevent html fragments or errors
    public lastContentDom : HTMLElement;

    public static HistoryInstanceCounter = 0;

    public id : number = 0;

    private contentContainer : HTMLElement;
    public counter : number = -1;

    constructor(contentContainer : HTMLElement) {
        this.id = ++History.HistoryInstanceCounter;
        this.contentContainer = contentContainer;
        this.lastContentDom = document.createElement(contentContainer.tagName);
    }
    private KeyCounter() : number {
        return ++this.counter;
    }
    /**
     * move one entry up
     * @returns ChangeEntry | null
     */
    public Undo() : ChangeEntry | null {
        if ( this.entryList.length === 0 || this.entryIndex === 0) {
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
            str = DiffPatch(str, this.entryList[i].delta);
        }
        //apply new last entry:
        this.lastContentStr = str;
        this.lastContentDom.innerHTML = str;
        nodeDiffpatch(this.lastContentDom, this.contentContainer);

        //console.log("undo to",this.entryIndex, str, this.entryList[this.entryIndex].selection);

        //if(target.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", target.innerHTML === lastHistoryStr, target.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML, target.innerHTML) : "", "supposed:",lastHistoryStr, "actual:",target.innerHTML);
        selectionSerializer.restore(this.contentContainer, this.entryList[this.entryIndex].selection);
    
        return {
            key : this.KeyCounter(),
            change : this.entryList[this.entryIndex],
            content : str
        }
    }
    public Redo() : ChangeEntry | null {
        if ( this.entryIndex + 1 >= this.entryList.length ) {
            //no next step
            return null;
        }
        //get patch:
        this.entryIndex = this.entryIndex + 1;
        const currentEntry = this.entryList[this.entryIndex];
        let str = "";
        for (let i = 0; i <= this.entryIndex; i++) {
            str = DiffPatch(str, this.entryList[i].delta);
        }
    
        //apply:
        this.lastContentStr = str;
        this.lastContentDom.innerHTML = str;
        nodeDiffpatch(this.lastContentDom, this.contentContainer);
        //console.log("redo", this.entryIndex, str, currentEntry.selection);
        //if(target.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", target.innerHTML === lastHistoryStr, target.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML || "", target.innerHTML || "") : "", "supposed:",lastHistoryStr, "actual:",target.innerHTML);
        selectionSerializer.restore(this.contentContainer, currentEntry.selection);
    
        return {
            key : this.KeyCounter(),
            change : currentEntry,
            content : this.contentContainer.innerHTML
        }
    
    }
    public Next() : ChangeEntry | null {
        if (!this.contentContainer) return null;
        if (this.lastContentStr === this.contentContainer.innerHTML) return null;

        //console.log("history next selection", selection);
        //remove redo steps:
        if (this.entryList.length > this.entryIndex + 1) {
            this.entryList.splice(this.entryIndex + 1, this.entryList.length - this.entryIndex -1);
        }
        //create diff:
        const delta = DiffCreate(this.lastContentStr || "", this.contentContainer.innerHTML || "");
        //console.log("next delta", lastHistoryStr, target.innerHTML, JSON.stringify(delta), lastHistoryStr);
        this.entryList.push({
            delta : delta, 
            selection : selectionSerializer.saveSlim(this.contentContainer)
        });
        
        this.entryIndex = this.entryList.length - 1;
        //this.entryChangeList.push(this.entryList[this.entryIndex]);
        this.lastContentStr = this.contentContainer.innerHTML;
        nodeDiffpatch(this.contentContainer, this.lastContentDom);
        //if(lastHistoryDom.innerHTML !== lastHistoryStr) //console.log("nodeDiffpatch result", lastHistoryDom.innerHTML === lastHistoryStr, lastHistoryDom.innerHTML === lastHistoryStr ? DiffCreate(lastHistoryDom.innerHTML || "", target.innerHTML || "") : "", "supposed:",lastHistoryStr, "actual:",lastHistoryDom.innerHTML);
    
        //console.log("next length", histories.length, "index", historyIndex, JSON.stringify(histories) );
    
        return {
            key : this.KeyCounter(),
            change : this.entryList[this.entryList.length - 1],
            content : this.contentContainer.innerHTML
        }
    }
}

export default History