import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    undo: {
        command: string;
        svg: string;
        tips: string;
    };
};
