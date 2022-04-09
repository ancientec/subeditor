import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    ol: {
        command: string;
        svg: string;
        tips: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
    ul: {
        command: string;
        svg: string;
        tips: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
};
