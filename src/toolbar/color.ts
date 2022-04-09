import SubEditor from "../subeditor";

const rgbToHex = (r : string, g : string, b : string) => '#' + [r, g, b].map(x => {
    if (x === '') return '00';
    const hex = (parseInt(x,10)).toString(16)
    return hex.length === 1  ? '0' + hex : hex
  }).join('');
const rgbStyleToHex =(rgb : string) => {
    if(rgb.indexOf('rgb(') === -1) return rgb;
    let _rgb = rgb.replace('rgb(','').replace(')','').split(',');
    return rgbToHex(_rgb[0],_rgb[1],_rgb[2]);
}

export default function(editor : SubEditor) {
    const content = (type : string) => {
        const v = type === 'color' ? 
        ['color',SubEditor.svgList['text_color'], editor.feature?.color || "",editor.ln('text color'),editor.ln('SET COLOR'), '#000000'] : 
        ['background',SubEditor.svgList['background_color'], editor.feature?.background || "", editor.ln("background color"),editor.ln('SET BACKGROUND COLOR'),'#ffffff'];
        return '<div class="se-ToolbarItem se-dropdown"><div class="se-dropdown-trigger"><button class="se-button"  data-command="'+v[0]+'" data-tips="'+v[3]+'" id="btn-dropdown-menu-'+v[0]+'" aria-haspopup="true" aria-controls="dropdown-menu-'+v[0]+'"><span></span><span class="se-icon">'+v[1]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-'+v[0]+'" role="menu"><div class="se-dropdown-content control"><div class="padding"><table><tbody><tr><td><div style="background-color: rgb(0, 0, 0);"></div></td><td><div style="background-color: rgb(68, 68, 68);"></div></td><td><div style="background-color: rgb(102, 102, 102);"></div></td><td><div style="background-color: rgb(153, 153, 153);"></div></td><td><div style="background-color: rgb(204, 204, 204);"></div></td><td><div style="background-color: rgb(238, 238, 238);"></div></td><td><div style="background-color: rgb(243, 243, 243);"></div></td><td><div style="background-color: rgb(255, 255, 255);"></div></td></tr><tr><td><div style="background-color: rgb(255, 0, 0);"></div></td><td><div style="background-color: rgb(255, 153, 0);"></div></td><td><div style="background-color: rgb(255, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 255);"></div></td><td><div style="background-color: rgb(0, 0, 255);"></div></td><td><div style="background-color: rgb(153, 0, 255);"></div></td><td><div style="background-color: rgb(255, 0, 255);"></div></td></tr><tr><td><div style="background-color: rgb(244, 204, 204);"></div></td><td><div style="background-color: rgb(252, 229, 205);"></div></td><td><div style="background-color: rgb(255, 242, 204);"></div></td><td><div style="background-color: rgb(217, 234, 211);"></div></td><td><div style="background-color: rgb(208, 224, 227);"></div></td><td><div style="background-color: rgb(207, 226, 243);"></div></td><td><div style="background-color: rgb(217, 210, 233);"></div></td><td><div style="background-color: rgb(234, 209, 220);"></div></td></tr><tr><td><div style="background-color: rgb(234, 153, 153);"></div></td><td><div style="background-color: rgb(249, 203, 156);"></div></td><td><div style="background-color: rgb(255, 229, 153);"></div></td><td><div style="background-color: rgb(182, 215, 168);"></div></td><td><div style="background-color: rgb(162, 196, 201);"></div></td><td><div style="background-color: rgb(159, 197, 232);"></div></td><td><div style="background-color: rgb(180, 167, 214);"></div></td><td><div style="background-color: rgb(213, 166, 189);"></div></td></tr><tr><td><div style="background-color: rgb(224, 102, 102);"></div></td><td><div style="background-color: rgb(246, 178, 107);"></div></td><td><div style="background-color: rgb(255, 217, 102);"></div></td><td><div style="background-color: rgb(147, 196, 125);"></div></td><td><div style="background-color: rgb(118, 165, 175);"></div></td><td><div style="background-color: rgb(111, 168, 220);"></div></td><td><div style="background-color: rgb(142, 124, 195);"></div></td><td><div style="background-color: rgb(194, 123, 160);"></div></td></tr><tr><td><div style="background-color: rgb(204, 0, 0);"></div></td><td><div style="background-color: rgb(230, 145, 56);"></div></td><td><div style="background-color: rgb(241, 194, 50);"></div></td><td><div style="background-color: rgb(106, 168, 79);"></div></td><td><div style="background-color: rgb(69, 129, 142);"></div></td><td><div style="background-color: rgb(61, 133, 198);"></div></td><td><div style="background-color: rgb(103, 78, 167);"></div></td><td><div style="background-color: rgb(166, 77, 121);"></div></td></tr><tr><td><div style="background-color: rgb(153, 0, 0);"></div></td><td><div style="background-color: rgb(180, 95, 6);"></div></td><td><div style="background-color: rgb(191, 144, 0);"></div></td><td><div style="background-color: rgb(56, 118, 29);"></div></td><td><div style="background-color: rgb(19, 79, 92);"></div></td><td><div style="background-color: rgb(11, 83, 148);"></div></td><td><div style="background-color: rgb(53, 28, 117);"></div></td><td><div style="background-color: rgb(116, 27, 71);"></div></td></tr><tr><td><div style="background-color: rgb(102, 0, 0);"></div></td><td><div style="background-color: rgb(120, 63, 4);"></div></td><td><div style="background-color: rgb(127, 96, 0);"></div></td><td><div style="background-color: rgb(39, 78, 19);"></div></td><td><div style="background-color: rgb(12, 52, 61);"></div></td><td><div style="background-color: rgb(7, 55, 99);"></div></td><td><div style="background-color: rgb(32, 18, 77);"></div></td><td><div style="background-color: rgb(76, 17, 48);"></div></td></tr></tbody></table><div><input class="Hex" type="color" value="'+(rgbStyleToHex(v[2]) || v[5]) +'"><button class="se-button">'+v[4]+'</button></div></div></div></div></div>'

    }
    return {
        color : {
            command : "color",
            svg : SubEditor.svgList["text_color"],
            tips : editor.ln("text color"),
            dropdowncontent : content('color'),
            onRender : (_editor : SubEditor, el : HTMLElement) => {
              const menu = el.querySelector('.se-dropdown-menu')!;
              el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
                if(!menu.classList.contains("is-active")) {
                    //to be open:
                    //make sure feature is ready
                    _editor.handleFeature();
                    el.querySelector('input')!.value = rgbStyleToHex(_editor.feature?.node?.style.color || _editor.feature?.node?.parentElement?.style.color || "");
                }
              });

              el.querySelectorAll('td > div').forEach(div => {
                div.addEventListener('click', (e : Event) => {
                  el.querySelector('input')!.value = rgbStyleToHex((e.currentTarget as HTMLElement).style.backgroundColor);
                });
              });
              el.querySelector('.se-dropdown-content button')?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                _editor.toolbar?.hideDropdown();
                _editor.command('color', [el.querySelector('input')?.value]);
                return false;
              });
            }
        },
        backgroundcolor : {
            command : "backgroundcolor",
            svg : SubEditor.svgList["background_color"],
            tips : "background color",
            dropdowncontent : content('background'),
            onRender : (_editor : SubEditor, el : HTMLElement) => {
              const menu = el.querySelector('.se-dropdown-menu')!;
              el.querySelector('.se-dropdown-trigger > button')?.addEventListener('click', () => {
                if(!menu.classList.contains("is-active")) {
                    //to be open:
                    //make sure feature is ready
                    _editor.handleFeature();
                    el.querySelector('input')!.value = rgbStyleToHex(_editor.feature?.node?.style.backgroundColor || _editor.feature?.node?.parentElement?.style.backgroundColor || "");
                }
              });
              el.querySelectorAll('td > div').forEach(div => {
                div.addEventListener('click', (e : Event) => {
                  el.querySelector('input')!.value = rgbStyleToHex((e.currentTarget as HTMLElement).style.backgroundColor);
                });
              });
              el.querySelector('.se-dropdown-content button')?.addEventListener('click', (e) => {
                
                e.preventDefault();
                e.stopPropagation();
                _editor.toolbar?.hideDropdown();
                _editor.command('backgroundcolor', [el.querySelector('input')?.value]);
                return false;
              });
            }
        },
    }
}