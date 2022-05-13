"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __importDefault(require("./color"));
const blockquote_1 = __importDefault(require("./blockquote"));
const format_1 = __importDefault(require("./format"));
const fullscreen_1 = __importDefault(require("./fullscreen"));
const align_1 = __importDefault(require("./align"));
const table_1 = __importDefault(require("./table"));
const hr_1 = __importDefault(require("./hr"));
const source_1 = __importDefault(require("./source"));
const text_1 = __importDefault(require("./text"));
const undo_1 = __importDefault(require("./undo"));
const redo_1 = __importDefault(require("./redo"));
const indent_1 = __importDefault(require("./indent"));
const remove_format_1 = __importDefault(require("./remove_format"));
const link_1 = __importDefault(require("./link"));
const remove_link_1 = __importDefault(require("./remove_link"));
const list_1 = __importDefault(require("./list"));
const seperator_1 = __importDefault(require("./seperator"));
const nextline_1 = __importDefault(require("./nextline"));
const spacer_1 = __importDefault(require("./spacer"));
exports.default = {
    color: color_1.default,
    blockquote: blockquote_1.default,
    format: format_1.default,
    fullscreen: fullscreen_1.default,
    align: align_1.default,
    table: table_1.default,
    hr: hr_1.default,
    source: source_1.default,
    text: text_1.default,
    undo: undo_1.default,
    redo: redo_1.default,
    indent: indent_1.default,
    remove_format: remove_format_1.default,
    link: link_1.default,
    remove_link: remove_link_1.default,
    list: list_1.default,
    seperator: seperator_1.default,
    nextline: nextline_1.default,
    spacer: spacer_1.default
};
//# sourceMappingURL=index.js.map