/*
* https://github.com/ancientec/subeditor
*
* Ancientec Co., Ltd. 
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

'use strict';

import SubEditor,{ChangeEntry, SubEditorEvent, ToolbarItem, SelectionSlimState, SubEditorHTMLElement, SubEditorOption} from "./subeditor";

import plugins from './plugins';
import lang from './lang';
import svg from './svg';
import css from './css';
import toolbarItems from './toolbars';

Object.keys(plugins).forEach((name : string) => {
    SubEditor.pluginList[name] = plugins[name];
});
SubEditor.langList = Object.assign({}, lang);
SubEditor.svgList = Object.assign({}, svg);
SubEditor.cssString = css;
SubEditor.toolbarItemList = Object.assign({}, toolbarItems);

export default SubEditor;
export {ChangeEntry, SubEditorEvent, ToolbarItem, SelectionSlimState,SubEditorHTMLElement, SubEditorOption};