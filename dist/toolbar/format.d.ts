import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    format: {
        command: string;
        svg: string;
        tips: string;
        dropdowncontent: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
};
