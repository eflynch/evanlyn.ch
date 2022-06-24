import { useRef } from "react";

type ContentIFrameProps = {
    src:string;
    onEscape:()=>void;
};

function ContentIFrame(props:ContentIFrameProps): JSX.Element {
    const iFrameRef = useRef<HTMLIFrameElement>(null);

    const onLoad = (e:any) => {
        let iFrame = iFrameRef.current;
        if (iFrame) {
            iFrame.contentWindow?.focus();
            if (iFrame.contentWindow?.document.body.onkeydown) {
                iFrame.contentWindow.document.body.onkeydown = (e:any) => {
                    if (e.key === "Escape") {
                        props.onEscape();
                    }
                }
            }
            iFrame.contentWindow?.focus();
        }
    };

    return <iframe ref={iFrameRef} onLoad={onLoad} src={props.src} />;
};

export default ContentIFrame;