import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    source: {
        command: string;
        svg: string;
        tips: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
};
