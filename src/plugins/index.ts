import fullscreen from "./fullscreen";
import hr from "./hr";
import color from "./color";
import source from "./source"
import align from "./align";
import text from "./text";
import undo from "./undo";
import redo from "./redo";
import indent from "./indent";
import format from "./format";
import remove_format from "./remove_format";
import link from "./link";
import paste from "./paste";
import list from "./list";
import table from "./table";
import image from "./image";
import { SubEditorEvent } from "../event";

const presetPlugins : {[key: string]: SubEditorEvent[]} = {
    fullscreen : fullscreen,
    hr : hr,
    color : color,
    source : source,
    align : align,
    text : text,
    undo : undo,
    redo : redo,
    indent : indent,
    format : format,
    remove_format : remove_format,
    link : link,
    paste : paste,
    list : list,
    table : table,
    image : image
};

export default presetPlugins;