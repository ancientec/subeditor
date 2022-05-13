/*
* https://github.com/ancientec/subeditor
*
* Ancientec Co., Ltd.
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subeditor_1 = __importDefault(require("./subeditor"));
const plugins_1 = __importDefault(require("./plugins"));
const lang_1 = __importDefault(require("./lang"));
const svg_1 = __importDefault(require("./svg"));
const css_1 = __importDefault(require("./css"));
const toolbars_1 = __importDefault(require("./toolbars"));
Object.keys(plugins_1.default).forEach((name) => {
    subeditor_1.default.pluginList[name] = plugins_1.default[name];
});
subeditor_1.default.langList = Object.assign({}, lang_1.default);
subeditor_1.default.svgList = Object.assign({}, svg_1.default);
subeditor_1.default.cssString = css_1.default;
subeditor_1.default.toolbarItemList = Object.assign({}, toolbars_1.default);
exports.default = subeditor_1.default;
//# sourceMappingURL=main.js.map