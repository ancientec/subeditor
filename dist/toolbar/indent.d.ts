import SubEditor from "../subeditor";
export default function (editor: SubEditor): {
    indent: {
        command: string;
        svg: string;
        tips: string;
    };
    outdent: {
        command: string;
        svg: string;
        tips: string;
    };
};
