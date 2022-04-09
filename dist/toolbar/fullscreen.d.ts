import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    fullscreen: {
        command: string;
        svg: string;
        tips: string;
        onRender: (_editor: SubEditor, el: HTMLElement) => void;
    };
};
