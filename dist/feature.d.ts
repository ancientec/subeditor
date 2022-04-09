interface FeatureLink {
    href: string;
    target: string;
    node: HTMLElement | undefined;
}
interface FeatureImage {
    src: string;
    width: string;
    height: string;
    node: HTMLElement | undefined;
}
interface FeatureSource {
    src: string;
    type: string;
}
interface FeatureVideo {
    controls: boolean;
    autoplay: boolean;
    width: "";
    height: "";
    node: HTMLElement | undefined;
    sources: FeatureSource[];
}
interface FeatureAudio {
    controls: boolean;
    autoplay: boolean;
    width: "";
    height: "";
    node: HTMLElement | undefined;
    sources: FeatureSource[];
}
export declare class Feature {
    path: string[];
    pathNode: HTMLElement[];
    node: HTMLElement | undefined;
    nodeName: string;
    formatEL: string;
    color: string;
    background: string;
    indent: string;
    align: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    subscript: boolean;
    superscript: boolean;
    a: FeatureLink;
    img: FeatureImage;
    video?: FeatureVideo;
    audio?: FeatureAudio;
}
declare function parseFeature(n: Node, container: HTMLElement): Feature;
export default parseFeature;
