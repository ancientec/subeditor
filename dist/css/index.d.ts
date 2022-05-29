declare const _default: ".SubEditor, .SubEditor  * {box-sizing: border-box;}.SubEditor {border:1px solid #dbdbdb;background-color: #fff;position: relative;}.SubEditorContentContainer {overflow-y: auto;padding:10px;position: relative;}.SubEditor.fullscreen {position:fixed;z-index:100500;height:100%;width:100%;top:0;left:0;}.SubEditor.AutoGrow {height: auto;}.SubEditor.AutoGrow .SubEditorContentContainer{overflow-y: hidden;height: auto;}.SubEditorContent, .SubEditorSource {text-align: start;display:inline-block;min-height: 200px;width:100%;box-shadow: none;border:none;outline: none;}.SubEditorContent:focus, .SubEditorSource:focus{box-shadow: none;border:none;outline: none;}.SubEditorContent img {max-width: 100%;}.SubEditorTextarea {display:none;resize: none;width: 100%;min-height: 100px;padding:10px;overflow: hidden;box-sizing: border-box;}.SubEditor .SubEditorFooter {display: none;border-top: 1px solid #dbdbdb;}.SubEditor > .SubEditorTooltip{user-select: none;z-index: 9999;position: absolute;line-height: 1.2em;display: none;padding: 2px 10px;box-shadow:1px 1px 3px gray;border-radius:5px;background: #fff;white-space: nowrap;}.SubEditor .se-button {box-shadow:none}.SubEditorContent table {border: none;border-collapse: collapse;empty-cells: show;max-width: 100%;}.SubEditorContent table td,.SubEditorContent table th {min-width:20px;min-height: 20px;border: 1px solid #dedede;}.SubEditorContent table th {background-color: #efefef;}.SubEditorContent blockquote{border-left: solid 3px #dedede;margin: 5px;padding-left: 5px;color: #333;}.SubEditorContent h1,.SubEditorContent h2,.SubEditorContent h3,.SubEditorContent h4,.SubEditorContent h5,.SubEditorContent h6{font-size: revert;font-weight: revert;margin: revert;padding: revert;}.SubEditorContent ul, .SubEditorContent ol{display: block;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;padding-inline-start: 40px;}.SubEditorContent ul {list-style-type: disc;}.SubEditorContent ol{list-style-type: decimal;}.SubEditorContent p{margin: revert;padding: revert;}.SubEditorToolbar {margin:0;border-bottom:1px solid #dbdbdb;align-items: center;display: flex;flex-wrap: wrap;justify-content: flex-start;font-weight: 400;font-size: 1rem;line-height: 1.5;text-align: left;color: #363636;background-color: #fff;width:100%;position: relative;}.SubEditorToolbar, .SubEditorToolbar  * {user-select: none;}.SubEditorToolbar{ align-items: center;display: flex;flex-wrap: wrap;justify-content: flex-start;}.SubEditorToolbar .se-dropdown {display: inline-flex;position: relative;vertical-align: top;cursor: pointer; justify-content: center;text-align: center;}    .SubEditorToolbar .se-dropdown-trigger{position: relative;}.SubEditorToolbar .se-button{margin: 0;align-items: center;border: 1px solid transparent;display: inline-flex;vertical-align: top;background-color: #fff;border-color: transparent;border-width: 1px;border-radius: 3px;cursor: pointer;justify-content: center;padding: calc(.375em - 1px) .75em;text-align: center;white-space: nowrap;position: relative;overflow: hidden;transform: translate3d(0,0,0);transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;box-shadow: none;}.SubEditorToolbar .se-button .se-icon{margin:0 calc(-.375em - 1px);height: 24px;width: 24px;align-items: center; display: inline-flex;justify-content: center;}.SubEditorToolbar .se-button .se-icon svg {height: 24px;width: 24px;}.SubEditorToolbar .se-dropdown-trigger .se-button * {pointer-events: none;}.SubEditorToolbar .se-dropdown-menu{min-width: unset;left: 0;padding-top: 4px;position: absolute;top: 100%;z-index: 20;display: none;background-color: #fff;}.SubEditorToolbar .se-ToolbarItem.is-active .se-dropdown-menu {display:block}.SubEditorToolbar .se-dropdown-content{border-radius: 4px;box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);padding: 0;transform-origin: top left;position:relative;background-color: #fff;}.SubEditorToolbar .se-dropdown-content .padding {padding: 15px;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item {cursor: pointer;height:unset;margin-bottom:0;margin: 0;align-items: center;border: 1px solid transparent;display: inline-flex;vertical-align: top;justify-content: center;text-transform: uppercase;transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;position: relative;overflow: hidden;transform: translate3d(0,0,0);white-space: nowrap;width: 100%;box-shadow: none;height: unset;margin-right: -1px;box-sizing: border-box;}.SubEditorToolbar .se-dropdown-content.se-control .se-dropdown-item {padding:10px 5px;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input {padding: calc(0.5em - 1px) calc(0.75em - 1px);transition: all 300ms;font-size: 1rem;height: 2.5em;line-height: 2.5em;border: solid 1px #ccc;width:200px;}.SubEditorToolbar .se-dropdown-content .se-button {height: 30px;line-height: 1;}.SubEditorToolbar .se-dropdown-content .se-button.close-dropdown {position: absolute;right:1px;top:1px;}.SubEditorToolbar .se-dropdown-content .se-button.alert {background-color: rgb(244,67,54,1);color: #fff;}.SubEditorToolbar .se-dropdown-content .se-button:hover {background-color: #dbdbdb;}.SubEditorToolbar .se-dropdown-content .se-button.alert:hover {background-color: rgb(244,67,54,0.7);}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input:focus {border: solid 1px #2196f3;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input+label {position: absolute;top: -1px;left: 12px;padding:3px 2px;font-size: 0.8em;color: #333;transition: all 0.5s ease;z-index: 3;display: block;cursor: text;background-color: #fff;}.SubEditorToolbar .is-featured{border-color: transparent;color: #363636;background-color: #efefef;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item > * {white-space:  nowrap;margin : 0}.SubEditorToolbar .se-dropdown-trigger{position: relative;}.SubEditorToolbar .se-dropdown-content.horizontal {display: flex;flex-wrap: nowrap;align-items: center;justify-content: flex-start;}.SubEditorToolbar > .se-button:hover, .SubEditorToolbar .se-dropdown-trigger .se-button:hover, .SubEditorToolbar .se-dropdown-content .se-dropdown-item.hover:hover,.SubEditorToolbar .se-dropdown-content .se-button.se-ToolbarItem:hover{background-color: #e0e0e0;}.SubEditorToolbar .se-dropdown-content .se-button.se-dropdown-item.borderbottom{border-bottom: 1px solid #dbdbdb;border-radius: 0px;}.SubEditorToolbar >.se-tips{z-index: 9999;position: absolute;top: -1.6em;left: 0px;line-height: 1.2em;display: none;padding: 2px 10px;border: 1px solid #dbdbdb;background: #fff;white-space: nowrap;pointer-events: none;user-select: none;}.SubEditorToolbar .se-Shadow {position:absolute;top:0;left:0;width:100%;height:100%;background-color: rgba(255,255,255,.6);z-index: 100;display: none;}.SubEditorToolbar.EnableShadow .se-Shadow{display: block;}.SubEditorToolbar .se-ToolbarItem.AboveShadow {z-index: 110;}.se-ToolbarItem.seperator {width:1px;height:100%;background-color: #dbdbdb;margin:0px;padding:0;border:none;cursor: default;transition: none;}.se-ToolbarItem.nextline {width:100%;height:1px;background-color: #dbdbdb;margin:0px;padding:0;border:none;cursor: default;transition: none;}.se-ToolbarItem.spacer {   cursor: default;transition: none;}.SubEditorToolbar > .se-button.se-ToolbarItem.spacer:hover{background-color: transparent;}.ToolbarTable td{padding-left: 5px;padding-right: 5px;width:10px; height:10px;border:1px solid #dbdbdb;margin:1px;}.ToolbarTable td.active,.ToolbarTable td:hover{background-color: #e0e0e0;}.ToolbarTable .title{text-align: center;font-size: 12px}.SubEditorDialog {box-sizing: border-box;align-items: center;display: none;flex-direction: column;justify-content: center;overflow: hidden;position: fixed;}.SubEditorDialog.is-active {display: flex;}.SubEditorDialog {z-index: 10000;}.SubEditorDialog .background {box-sizing: border-box;background-color: rgba(10,10,10,.6);}.background {bottom: 0;left: 0;position: absolute;right: 0;top: 0;}.SubEditorDialog .card {box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);}.card {display: flex;flex-direction: column;max-height: calc(100vh - 40px);overflow: hidden;}.card, .content {box-sizing: border-box;margin: 0 20px;position: relative;width: 100%;}.card-title {color: #363636;flex-grow: 1;flex-shrink: 0;font-size: 1.5rem;line-height: 1;}.delete, .close {user-select: none;background-color: rgba(10,10,10,.2);border: 0;border-radius: 290486px;cursor: pointer;pointer-events: auto;display: inline-block;flex-grow: 0;flex-shrink: 0;font-size: 0;height: 20px;max-height: 20px;max-width: 20px;min-height: 20px;min-width: 20px;outline: 0;position: relative;vertical-align: top;width: 20px;}.card-head, .card-foot {box-sizing: border-box;border: none;background: #fff;}.card-head {border-top-left-radius: 6px;border-top-right-radius: 6px;}.card-foot, .card-head {align-items: center;display: flex;flex-shrink: 0;justify-content: flex-start;padding: 20px;position: relative;}.card-foot {justify-content: flex-end;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;}.card-body {background-color: #fff;flex-grow: 1;flex-shrink: 1;overflow: auto;padding: 20px;display: block;}.SubEditorDialog .button{user-select: none;align-items: center;border: 1px solid transparent;box-shadow: none;display: inline-flex;font-size: 1rem;height: 2.25em;justify-content: flex-start;line-height: 1.5;padding: calc(.375em - 1px) calc(.625em - 1px);position: relative;vertical-align: top;background-color: #fff;border-color: transparent;border-width: 1px;color: #363636;cursor: pointer;justify-content: center;text-align: center;white-space: nowrap;border-radius: 3px;text-transform: uppercase;font-weight: 400;box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;position: relative;overflow: hidden;transform: translate3d(0,0,0);}.button.is-info, .button.is-info.is-hovered, .button.is-info:hover {border-color: transparent;color: #fff;}.button.is-info {background-color: #29b6f6;}.card-foot .button:not(:last-child) {margin-right: 10px;}@media screen and (min-width: 769px), print {.card, .body {    margin: 0 auto;    max-height: calc(100vh - 40px);    width: 100vw - 40px;}}.SubEditorToolbar .se-dropdown-content .uploadcontainer{position: relative;border: dashed 2px #bdbdbd;border-radius: 3px;width:250px;min-height: 100px;text-align: center;}.SubEditorToolbar .se-dropdown-content .uploadcontainer strong{position:absolute;top:50%;transform: translateY(-50%);display: block;width: 100%;text-align: center;}.SubEditorToolbar .se-dropdown-content .uploadcontainer input{position: absolute;top:0;left:0;width: 100%;height: 100%;opacity: 0;}.UploadProgressBar {position:absolute;top:0;left:0;background:rgb(244,67,54,0.7);width:0%;height:1px;border:none;}.UploadProgressError {position:absolute;top:0;left:0;width:100%;color:rgb(244,67,54,0.7);text-align: center;}.FileTileImageGridContainer {max-height: calc(100vh - 140px);margin-bottom:0px;position:relative;overflow-y: auto;}.FileTileImageGridFooter {width: 100%;padding-top: 5px;border-top:#ccc 1px solid;}.FileTileImageGridPagination {justify-content: center;margin-bottom: 0;margin-top: 0;align-items: center;display: flex;text-align: center;border-bottom:none;}.FileTileImageGridPagination > * {padding: 0 0.75em;white-space: nowrap;border: #dbdbdb 1px solid;color: #363636;font-size: 1em;justify-content: center;margin: 1px 5px;text-align: center;-webkit-appearance: none;line-height: 28px;height: 28px; } .FileTileImageGridPagination span.total {border:none;padding: 0;margin-left: 0; } .FileTileImageGridPagination input.current {width: 2.5em;border: none;text-align: center; } .FileTileImageGridPagination input.keyword {width: 6em; } .FileTileImageGridPagination > .se-button {border-radius: 9999px;border: #dbdbdb 1px solid;width: 30px; }.FileTileImageGrid {margin-top:18px;display: flex;flex-wrap: wrap;width:100%;min-width: 640px;max-height: calc(100vh - 140px);overflow-y: visible;}.FileTileImageGrid button {display: inline-block;margin-bottom: 8px;width: calc(20% - 9px);text-decoration: none;margin-right: 8px;padding:5px;background: #ffffff;cursor: pointer;user-select: none;border: 1px solid #eee;min-width: 55px;}.FileTileImageGrid button.upload {position:relative;cursor: pointer;}.FileTileImageGrid button.upload input {position: absolute;width: 100%;height: 100%;top: 0;left: 0;opacity: 0;}/* 4 per row */.FileTileImageGrid a:nth-of-type(5n) {margin-right: 0;}.FileTileImageGrid button > figure {position: relative;width: 100%;padding-top: 100%;margin:0;}.FileTileImageGrid button > figure > figure {position:  absolute;top: 0;left: 0;bottom: 0;right: 0;margin:0;overflow:hidden;}.FileTileImageGrid img{position:absolute;top : 0;left:0;min-width:100%;min-height:100%;width:100%;max-height:100%;border:none;}.FileTileImageGrid figure .text{text-align: center;word-break: break-all;margin: 0;position: absolute;top: 50%;transform: translateY(-50%);display: block;width: 100%;}.FileTileImageGrid button:hover {border: 1px solid #ccc;}.FileTileImageGrid .caption {display:block;margin-top: 6px;max-height:2.2em;overflow: hidden;text-align: center;font-size: 0.7em;}@media screen and (max-width: 768px){.FileTileImageGrid {max-width: 320px;min-width: 320px;}.FileTileImageGrid button {width: calc(25% - 6px);}.FileTileImageGrid button:nth-of-type(2n) {margin-right: 8px;}.FileTileImageGrid button:nth-of-type(5n) {margin-right: 8px;}.FileTileImageGrid button:nth-of-type(4n) {margin-right: 0;}}#dropdown-menu-color .se-dropdown-content .padding > div,#dropdown-menu-background .se-dropdown-content .padding > div {display: flex;}#dropdown-menu-color .se-dropdown-content .padding > div > *,#dropdown-menu-background .se-dropdown-content .padding > div > * {flex-grow: 1;flex-shrink: 1;border-spacing: 0;}#dropdown-menu-color table,#dropdown-menu-background table {flex-grow: 1;flex-shrink: 1;border-spacing: 0;}#dropdown-menu-color table td {padding : 2px}#dropdown-menu-color table td div,#dropdown-menu-background table td div {cursor:pointer;width:16px;height:16px;padding: 2px;border: 1px solid #dbdbdb;}#dropdown-menu-color table td div:hover,#dropdown-menu-background table td div:hover{border-color:#999;}";
export default _default;
