"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fullscreen_1 = __importDefault(require("./fullscreen"));
const hr_1 = __importDefault(require("./hr"));
const color_1 = __importDefault(require("./color"));
const source_1 = __importDefault(require("./source"));
const align_1 = __importDefault(require("./align"));
const text_1 = __importDefault(require("./text"));
const undo_1 = __importDefault(require("./undo"));
const redo_1 = __importDefault(require("./redo"));
const indent_1 = __importDefault(require("./indent"));
const format_1 = __importDefault(require("./format"));
const remove_format_1 = __importDefault(require("./remove_format"));
const link_1 = __importDefault(require("./link"));
const paste_1 = __importDefault(require("./paste"));
const list_1 = __importDefault(require("./list"));
const table_1 = __importDefault(require("./table"));
const image_1 = __importDefault(require("./image"));
const presetPlugins = {
    fullscreen: fullscreen_1.default,
    hr: hr_1.default,
    color: color_1.default,
    source: source_1.default,
    align: align_1.default,
    text: text_1.default,
    undo: undo_1.default,
    redo: redo_1.default,
    indent: indent_1.default,
    format: format_1.default,
    remove_format: remove_format_1.default,
    link: link_1.default,
    paste: paste_1.default,
    list: list_1.default,
    table: table_1.default,
    image: image_1.default
};
exports.default = presetPlugins;
//# sourceMappingURL=index.js.map