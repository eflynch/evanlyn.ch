import React, { RefObject, useEffect, useState } from 'react';
     
type ContentEditableProps = {
    html:string;
    disabled?:boolean;
    refInternal:RefObject<HTMLDivElement>;
    className:string;
    onChange?:(e:{target:{value:string}})=>void;
    [x: string]:any;
};

function ContentEditable(props:ContentEditableProps):JSX.Element {
    const [lastHTML, setLastHTML] = useState<string|null>(null);
    const {html, disabled, refInternal, onChange, ...rest} = props;

    const emitChange=(e:any) => {
        if (refInternal.current) {
            let html = refInternal.current.innerHTML;

            if (onChange && html !== lastHTML) {
                onChange({target:{value: html}});
            }
            setLastHTML(html);
        }
    };

    useEffect(()=>{
        if (refInternal.current && html !== refInternal.current.innerHTML) {
            refInternal.current.innerHTML = html;
        }
    }, [refInternal, html]);

    return (
        <div
            ref={refInternal}
            contentEditable={!disabled}
            onInput={emitChange}
            onBlur={emitChange}
            dangerouslySetInnerHTML={{__html: html}}
            { ...rest }
            spellCheck={false}>
        </div>
    );
}
export default ContentEditable;
