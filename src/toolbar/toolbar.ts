
import color from './color';
import blockquote from './blockquote';
import format from './format';
import fullscreen from './fullscreen';
import align from './align';
import table from './table';
import hr from './hr';
import source from './source';
import text from './text';
import undo from './undo';
import redo from './redo';
import indent from './indent';
import remove_format from './remove_format';
import link from './link';
import remove_link from './remove_link';
import list from './list';
import seperator from './seperator';
import nextline from './nextline';
import spacer from './spacer';
import SubEditor from '../subeditor';

export interface ToolbarItem {
  command : string;
  svg : string;
  dropdowncontent? : string;
  tips? : string;
  onRender? : Function;
}



export function ToolbarPresets(editor : SubEditor) {
  return Object.assign({}, undo(editor), redo(editor), color(editor),blockquote(editor),format(editor),fullscreen(editor),align(editor), table(editor), hr(editor), source(editor), text(editor), indent(editor),remove_format(editor), link(editor), remove_link(editor), list(editor), seperator(editor), nextline(editor), spacer(editor));
}
export default class Toolbar {
  public editor : SubEditor;
  public refToolbar : HTMLDivElement = document.createElement("div");
  public refShadow : HTMLDivElement = document.createElement("div");
  public refTips : HTMLDivElement = document.createElement("div");
  public static presetItemList : {[key: string]: Function} = {};
  public pluginItemList : {[key: string]: ToolbarItem} = {};
  public renderButton = (item : ToolbarItem) => {
    if(!item.command || !item.svg) return "";
    return '<span class="se-button se-ToolbarItem" data-command="'+item.command+'" data-tips="'+this.editor.ln(item.tips || "")+'"><span class="se-icon">'+item.svg+'</span></span>';
  }
  
  constructor(editor : SubEditor) {
    this.editor = editor;
    this.prepareUI();
    this.registerEvents();
  }
  private prepareUI() {
    this.editor.refEditor.querySelector(".SubEditorToolbar")?.remove();
    this.refToolbar = this.editor.refEditor.insertBefore(document.createElement("div"), this.editor.refContent.parentElement);
    this.refToolbar.classList.add("SubEditorToolbar");
    this.refShadow.classList.add("se-Shadow");
    this.refToolbar.appendChild(this.refShadow);

    this.refTips.classList.add("se-tips");
    this.refToolbar.appendChild(this.refTips);
    
  }
  public registerPluginItem(item : Function | ToolbarItem) {
    const ToolbarItem : {[key: string]: ToolbarItem} = typeof item === "function" ? item(this.editor) : item;
    this.pluginItemList = Object.assign(this.pluginItemList, ToolbarItem);
  }
  public addItem(item : ToolbarItem | string | Function) {
    
    let barItem : ToolbarItem | undefined = undefined;
    const presets = ToolbarPresets(this.editor);
    if(typeof item === "string") {
      if(typeof Toolbar.presetItemList[item] === "function") barItem = Toolbar.presetItemList[item](this.editor) as ToolbarItem;
      else if(typeof this.pluginItemList[item] !== "undefined") barItem = this.pluginItemList[item];
      else if(typeof presets[item] !== "undefined") barItem = presets[item];
      else return;
    } else if(typeof item === "function") barItem = item(this.editor);

    if(!barItem || typeof barItem === "string" || typeof barItem.command === "undefined") return;

    let div = document.createElement("div");
    if(!barItem.dropdowncontent) {
      div.innerHTML = this.renderButton(barItem);
    } else if (barItem.dropdowncontent) {
      div.innerHTML = barItem.dropdowncontent;
    }
    const barItemEl = div.firstChild;
    this.refToolbar.insertBefore(barItemEl as Node , this.refShadow);
    if(barItem.onRender) {
      barItem.onRender(this.editor, barItemEl as HTMLElement);
    } else {
      (barItemEl as HTMLElement).addEventListener('click', (e) => {
        const cmd = (barItemEl as HTMLElement).getAttribute("data-command") as string;
        this.editor.command(cmd,[]);
      });
    }
    div.remove();
  }
  private initEventTips(el : Element) {
    el.addEventListener("mouseenter", (e : Event) => {
      e.stopPropagation();
      const elTarget = e.target as HTMLElement;
      const tips_str = this.editor.ln(elTarget.getAttribute("data-tips") || "");
      if(tips_str === "") return;
      this.refTips.style.display = "block";
      this.refTips.innerHTML = tips_str;
      const toolbarRect = this.refToolbar.getBoundingClientRect();
      let rect = elTarget.getBoundingClientRect();
      this.refTips.style.left = Math.max(0,rect.left - toolbarRect.left + elTarget.clientWidth/2 - this.refTips.clientWidth / 2) + "px";
      this.refTips.style.top = rect.top - toolbarRect.top - this.refTips.clientHeight + "px";
      if(rect.top < rect.height) {
        this.refTips.style.top = rect.height+"px";
      }
  
    });
    el.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      this.refTips.style.display = "none";
      this.refTips.style.top = "";
    });
  }
  public initItems(items : (ToolbarItem | string | Function)[]) {
    items.forEach(item => this.addItem(item));
    
    //toolbar tips
    this.refToolbar.querySelectorAll("[data-tips]").forEach(el => this.initEventTips(el));
  }
  public hideDropdownListener = (e : Event) => {
    if(!this.refToolbar) {
      document.removeEventListener('click',this.hideDropdownListener);
      return;
    }
    let target = e.target as HTMLElement;
    let isDropdownContent = false;
    do {
      if(target && target.classList.contains('se-dropdown-content')) {
        isDropdownContent = true;
        break;
      }
    }while(target = target.parentElement as HTMLElement);
    if(!isDropdownContent && !this.refToolbar.querySelector(".se-ToolbarItem.is-active .se-dropdown-content .se-button.close-dropdown")) {
      //not in dropdown, and dropdown content doesn't have close button
      this.hideDropdown();
    }
  };
  public insertCloseButton(itemEl : HTMLElement) {
    this.removeCloseButton(itemEl);
    this.editor.dom.appendString2Node('<button class="se-button close-dropdown"><span class="se-icon">'+SubEditor.svgList['close']+'</span></button>',itemEl.querySelector(".se-dropdown-content")!);
    itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown")!.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      this.hideDropdown();
      return false;
    });
  }
  public removeCloseButton(itemEl : HTMLElement) {
    const btn = itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown");
    if(btn) btn.remove();
  }
  private registerEvents(){
    this.refToolbar.addEventListener('click', (e) => {
      const el = e.target as HTMLElement;
      if (el.classList.contains("se-button") && el.parentElement!.classList.contains("se-dropdown-trigger")) {
        e.preventDefault();
        e.stopPropagation();
        const menu = el.parentElement!.parentElement as HTMLElement;
        const isActive = menu.classList.contains("is-active");
        this.hideDropdown();
        if(isActive) {
          menu.classList.remove("is-active");
        } else {
          menu.classList.add("is-active");
          this.adjustContentPosition(menu.querySelector(".se-dropdown-content")!);
          menu.querySelectorAll(".se-dropdown-content [data-tips]").forEach(e => this.initEventTips(e));
        }
        return false;
        
      }
      return true;
    });
    
    //make sure to clean up when destroy
    if(typeof this.editor.docListener['click'] === "undefined") {
      this.editor.docListener['click'] = [];
    }
    this.editor.docListener['click'].push(this.hideDropdownListener);
    document.removeEventListener('click', this.hideDropdownListener)
    document.addEventListener('click', this.hideDropdownListener);
    
  
    this.editor.event.register([{ event : "onFeatureChange", target : [], callback : () => {
      this.refToolbar.querySelectorAll("[data-command]").forEach(el => {
        const cmd = el.getAttribute('data-command') as string || "_";
        if(cmd === "_") return;
        el.classList.remove('is-featured');
        if(el.getAttribute('data-featureformat')) {
          
          if(this.editor.feature?.formatEL === el.getAttribute('data-featureformat')) {
            el.classList.add('is-featured');
          }
        } else if(typeof (this.editor.feature! as any)[cmd] !== "undefined" &&  (this.editor.feature! as any)[cmd]){
          el.classList.add('is-featured');
        }
        
      });
  
    }}]);
  }
  public adjustContentPosition(ddcontent : HTMLElement) {
    //adjust x position
    ddcontent.removeAttribute("style");
      setTimeout(() => {
        const rect = ddcontent.getBoundingClientRect();
        if(!rect.width) return;
        let xNew = rect.width / 2 - 18;//console.log("adjustContentPosition", xNew, rect.x, );
        if (rect.x - xNew < 0)
          xNew = rect.x;
        ddcontent.setAttribute("style", "transform:translateX(-"+ xNew + "px)");
      },1);
  }
  public hideDropdown(){
    this.refToolbar.querySelectorAll(".se-ToolbarItem.is-active").forEach(el => el.classList.remove("is-active"));
  }
  public hasShadow(){
    return this.refToolbar.classList.contains("EnableShadow");
  }
  public enableShadow(allowCmds : string[]) {
    this.disableShadow();
    this.refToolbar.classList.add("EnableShadow");
    this.refToolbar.querySelectorAll(".se-ToolbarItem").forEach(e => {
      let cmd = e.getAttribute("data-command") || "";
      let allow = allowCmds.indexOf(cmd) !== -1;
      if(!allow) {
        e.querySelectorAll("[data-command]").forEach(e2 => {
          if(!allow && allowCmds.indexOf(e2.getAttribute("data-command") || "") !== -1) {
            allow = true;
          }
        });
      }
      if(allow){
        e.classList.add("AboveShadow");
      }
    });
  }
  public disableShadow() {
    this.refToolbar.classList.remove("EnableShadow");
    this.refToolbar.querySelectorAll(".AboveShadow").forEach(e => e.classList.remove("AboveShadow"));
  }
}

