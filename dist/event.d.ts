import SubEditor from "./subeditor";
export interface SubEditorEvent {
    event: string;
    target?: string[];
    callback: Function;
}
export default class Event {
    events: {
        [key: string]: SubEditorEvent[];
    };
    editor: SubEditor;
    constructor(editor: SubEditor);
    getEvents(): {
        [key: string]: SubEditorEvent[];
    };
    trigger(event: string, target: string, args: any[] | undefined): void;
    register(plugin: SubEditorEvent[]): void;
    unregister(plugin: SubEditorEvent[]): void;
}
