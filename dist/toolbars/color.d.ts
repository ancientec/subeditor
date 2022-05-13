import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    color: {
        command: string;
        svg: string;
        tips: any;
        dropdowncontent: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
    backgroundcolor: {
        command: string;
        svg: string;
        tips: string;
        dropdowncontent: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
};
