import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    table: {
        command: string;
        svg: string;
        tips: any;
        dropdowncontent: string;
        onRender: (_editor: SubEditor, table: HTMLElement) => void;
    };
};
