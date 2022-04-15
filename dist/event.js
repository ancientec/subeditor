"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_hotkey_1 = __importDefault(require("is-hotkey"));
const subeditor_1 = __importDefault(require("./subeditor"));
class Event {
    constructor(editor) {
        this.events = {
            onKeyDown: [],
            onKeyUp: [],
            onClick: [],
            onCommand: [],
            onFeatureChange: [],
            onPaste: [],
            onBlur: [],
            onBeforeChange: [],
            onFullscreenChange: []
        };
        this.editor = editor;
    }
    getEvents() {
        return this.events;
    }
    trigger(event, target, args) {
        var _a;
        if (typeof this.events[event] === "undefined")
            return;
        if (!args)
            args = [];
        for (let i = 0, n = this.events[event].length; i < n; i++) {
            //register plugin: ui, svg, additional language
            if (["registerUI", "registerSvg", "registerLanguage"].indexOf(event) !== -1) {
                subeditor_1.default.presetSvg(this.events[event][i].callback(this.editor));
                continue;
            }
            //register plugin css
            if (event === "registerCss") {
                subeditor_1.default.pluginCSS = Object.assign(subeditor_1.default.pluginCSS, this.events[event][i].callback(this.editor));
                continue;
            }
            //register to toolbar
            if (event === "registerToolbarItem") {
                (_a = this.editor.toolbar) === null || _a === void 0 ? void 0 : _a.registerPluginItem(this.events[event][i].callback(this.editor));
                continue;
            }
            if ((event === "onKeyDown" || event === "onKeyUp") && this.events[event][i].target.length > 0) {
                let isKey = false;
                this.events[event][i].target.forEach(key => {
                    if ((0, is_hotkey_1.default)(key, args[1]))
                        isKey = true;
                });
                if (!isKey)
                    continue;
            }
            else if (this.events[event][i].target && this.events[event][i].target.length > 0 && !this.events[event][i].target.includes(target)) {
                continue;
            }
            //feature is confirmed and set before event trigger
            if (event !== "onFeatureChange") {
                this.editor.handleFeature();
            }
            this.events[event][i].callback.apply(this, args);
        }
    }
    register(plugin) {
        plugin.forEach(p => {
            //safe check for invalid plugin
            if (!p.callback || !p.event)
                return;
            if (typeof this.events[p.event] === "undefined") {
                this.events[p.event] = [];
            }
            //add if not exists
            if (!this.events[p.event].includes(p))
                this.events[p.event].push(p);
        });
    }
    unregister(plugin) {
        plugin.forEach(p => {
            //safe check for invalid plugin
            if (!p.callback || !p.event)
                return;
            //check for existance:
            for (let i = this.events[p.event].length - 1, t = 0; i >= t; i--) {
                if (this.events[p.event][i] === p) {
                    //this.data[i].target === p.target && this.data[i].event === p.event && this.data[i].callback === p.callback
                    this.events[p.event].splice(i, 1);
                    break;
                }
            }
        });
    }
}
exports.default = Event;
//# sourceMappingURL=event.js.map