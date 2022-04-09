'use strict';

import SubEditor from "./subeditor";

if(typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.SubEditor = SubEditor;
}
