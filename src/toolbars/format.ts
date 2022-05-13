import SubEditor, { ToolbarItem } from "../subeditor";


export default function(editor : SubEditor) {
    const o : {[key: string]: ToolbarItem} = {
      paragraph : {
        command : "p",svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="p" data-featureformat="P" data-tips="paragraph"><span class="se-icon">'+SubEditor.svgList["p"]+'</span></span>'
      },
      blockquote : {
        command : "blockquote",svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="blockquote" data-featureformat="BLOCKQUOTE" data-tips="blockquote"><span class="se-icon">'+SubEditor.svgList["blockquote"]+'</span></span>'
      },
      code : {
        command : "code",svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="code" data-featureformat="CODE" data-tips="code"><span class="se-icon">'+SubEditor.svgList["code"]+'</span></span>'
      },
      format : {
        command : "format",
        svg : SubEditor.svgList["p"],
        tips : "format",
        dropdowncontent : '<div class="se-ToolbarItem se-dropdown" data-tips="'+editor.ln("paragraph")+'"><div class="se-dropdown-trigger"><button class="se-button"  data-command="paragraph" data-tips="paragraph" id="btn-dropdown-menu-paragraph" aria-haspopup="true" aria-controls="dropdown-menu-paragraph"><span></span><span class="se-icon" aria-hidden="true">'+SubEditor.svgList["p"]+'</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-paragraph" role="menu"><div class="se-dropdown-content horizontal"  aria-hidden="true"><span class="se-button se-ToolbarItem" data-command="p" data-featureformat="P" data-tips="Normal"><span class="se-icon">'+SubEditor.svgList["p"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h1" data-featureformat="H1" data-tips="Heading 1"><span class="se-icon">'+SubEditor.svgList["h1"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h2" data-featureformat="H2" data-tips="Heading 2"><span class="se-icon">'+SubEditor.svgList["h2"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h3" data-featureformat="H3" data-tips="Heading 3"><span class="se-icon">'+SubEditor.svgList["h3"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h4" data-featureformat="H4" data-tips="Heading 4"><span class="se-icon">'+SubEditor.svgList["h4"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h5" data-featureformat="H5" data-tips="Heading 5"><span class="se-icon">'+SubEditor.svgList["h5"]+'</span></span><span class="se-button se-ToolbarItem" data-command="h6" data-featureformat="H6" data-tips="Heading 6"><span class="se-icon">'+SubEditor.svgList["h6"]+'</span></span><span class="se-button se-ToolbarItem" data-command="blockquote" data-featureformat="BLOCKQUOTE" data-tips="blockquote"><span class="se-icon">'+SubEditor.svgList["blockquote"]+'</span></span><span class="se-button se-ToolbarItem" data-command="code" data-featureformat="CODE" data-tips="Code"><span class="se-icon">'+SubEditor.svgList["code"]+'</span></span></div></div></div>',
        onRender : (_editor : SubEditor, el : HTMLElement) => {
          el.querySelectorAll('.se-button')!.forEach(elm => {
            elm.addEventListener('click', (e) => {
              const cmd = elm.getAttribute("data-command") as string;
              _editor.command(cmd,[]);
            });
          });
        }
      }
    };
    for(let i = 1; i < 7; i++) {
      o["h"+i] = {
        command : "h"+i,svg : "", tips : "",
        dropdowncontent : '<span class="se-button se-ToolbarItem" data-command="h'+i+'" data-featureformat="H'+i+'" data-tips="Heading '+i+'"><span class="se-icon">'+SubEditor.svgList["h"+i]+'</span></span>'
      };
    }
    return o;
}