import isHotkey from "is-hotkey";
import SubEditor from "./subeditor";

export interface SubEditorEvent {
    event : string;
    target? : string[];
    callback : Function;
}


export default class Event {
    public events : {[key: string]: SubEditorEvent[]} = {
        onKeyDown: [],
        onKeyUp: [],
        onClick : [],
        onCommand : [],
        onFeatureChange : [],
        onPaste : [],
        onBlur : [],
        onBeforeChange : [],
        onFullscreenChange : []
    
    };
    public editor : SubEditor;
    constructor(editor : SubEditor) {
        this.editor = editor;
    }
    public getEvents() {
        return this.events;
    }
    public trigger(event : string,target : string,  args : any[] | undefined) : void{

        if (typeof this.events[event] === "undefined") return;
        if (!args) args = [];

        for (let i = 0, n = this.events[event].length; i < n; i++) {
            //register plugin: ui, svg, additional language
            if(["registerUI", "registerSvg","registerLanguage"].indexOf(event) !== -1) {
                SubEditor.presetSvg(this.events[event][i].callback(this.editor));
                continue;
            }
            //register plugin css
            if(event === "registerCss") {
                SubEditor.pluginCSS = Object.assign(SubEditor.pluginCSS, this.events[event][i].callback(this.editor));
                continue;
            }
            //register to toolbar
            if(event === "registerToolbarItem") {
                this.editor.toolbar?.registerPluginItem(this.events[event][i].callback(this.editor));
                continue;
            }
            if((event === "onKeyDown" || event === "onKeyUp") && this.events[event][i].target!.length > 0) {
                let isKey = false;
                this.events[event][i].target!.forEach(key => {
                    if(isHotkey(key, args![1] as KeyboardEvent)) isKey = true;
                });
                if(!isKey) continue;
            }
            else if(this.events[event][i].target && this.events[event][i].target!.length > 0 && !this.events[event][i].target!.includes(target)) {
                continue;
            }
            //feature is confirmed and set before event trigger
            if(event !== "onFeatureChange"){
                this.editor.handleFeature();
            }
            this.events[event][i].callback.apply(this, args);
        }
    }
    public register(plugin : SubEditorEvent[]){
        
        plugin.forEach( p => {
            //safe check for invalid plugin
            if(!p.callback || !p.event) return;
            if(typeof this.events[p.event] === "undefined"){
                this.events[p.event] = [];
            }
            //add if not exists
            if(!this.events[p.event].includes(p)) this.events[p.event].push(p);
        });
    }
    public unregister(plugin : SubEditorEvent[]) {
        plugin.forEach( p => {
            //safe check for invalid plugin
            if(!p.callback || !p.event) return;
            //check for existance:
            for(let i = this.events[p.event].length - 1, t = 0; i >= t; i--) {
                if(this.events[p.event][i] === p) {
                    //this.data[i].target === p.target && this.data[i].event === p.event && this.data[i].callback === p.callback
                    this.events[p.event].splice(i, 1);
                    break;
                }
            }
        });
    }
}