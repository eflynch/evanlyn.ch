import React, { useEffect, useRef, useState } from 'react';
import { Trunk } from '../immutable-tree';
import ContentEditable from './ContentEditable';

function placeCaretAtEnd(el:any) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    } 
}

type TitleProps = {
    setFocus:(child:Trunk|undefined)=>void;
    setHead:(child:Trunk|undefined)=>void;
    setTitle:(child:Trunk, title:string)=>void;
    hasFocus:boolean;
    entryEnabled:boolean;
    trunk:Trunk;
};

function Title(props:TitleProps):JSX.Element {
    const {setFocus, setHead, setTitle, hasFocus, entryEnabled, trunk} = props;

    const input = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        if (hasFocus) {
            setActive(true);
            if (entryEnabled) {
                input.current && input.current.focus();
            } else {
                bottom.current && bottom.current.focus();
            }
        }
    }, [hasFocus, entryEnabled, active]);


    const onBlur = (e:any) => {
        setActive(false);
    };
    const onFocus = (e:any) => {
        placeCaretAtEnd(input.current);
    };

    const onClick = (e:any) => {
        setFocus(trunk);
        e.preventDefault();
        if (!e.metaKey || trunk.value.content) {
            setHead(trunk);
        } else if (trunk.value.link) {
            window.location = trunk.value.link;
        }
    };

    const setValue = (e:any) => {
        if (e.target.value !== trunk.value.title) {
            setTitle(trunk, e.target.value);
        }
    };

    const topClassName = [
        'magnolia_ce',
        'magnolia_ce_top',
        !entryEnabled ? 'magnolia_transparent' : '',
        hasFocus ? 'magnolia_focused' : ''
    ].join(" ");
    const bottomClassName = [
        'magnolia_ce',
        'magnolia_ce_bottom',
        entryEnabled ? 'magnolia_transparent' : '',
        hasFocus ? 'magnolia_focused' : ''
    ].join(" ");

    return (
        <div  className="magnolia_ce_wrapper" onClick={onClick}>
            <ContentEditable className={bottomClassName}
                                refInternal={bottom}
                                onBlur={onBlur}
                                tabIndex={-1}
                                html={trunk.value.title}
                                disabled={true}/>
            <ContentEditable refInternal={input} className={topClassName}
                                html={trunk.value.title}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                onChange={setValue}/>
        </div>
    );
}

export default Title;
