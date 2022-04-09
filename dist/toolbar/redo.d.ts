import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    redo: {
        command: string;
        svg: string;
        tips: string;
    };
};
