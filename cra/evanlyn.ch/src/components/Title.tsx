import React, { useEffect, useRef } from 'react';
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
    hasContent:boolean;
    hasFocus:boolean;
    hasLink:boolean;
    entryEnabled:boolean;
    trunk:Trunk;
};

function Title(props:TitleProps):JSX.Element {
    const {setFocus, setHead, setTitle, hasFocus, hasContent, hasLink, entryEnabled, trunk} = props;
    const input = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const onBlur = (e:any) => {
        if (e.relatedTarget === null) {
            setFocus(undefined);
        }
    };
    const onFocus = (e:any) => {
        placeCaretAtEnd(input.current);
    };

    useEffect(()=>{
        if (hasFocus) {
            if (entryEnabled) {
                if (document.activeElement !== input.current) {
                    input.current?.focus();
                }
            } else {
                if (document.activeElement !== bottom.current) {
                    bottom.current?.focus();     
                }
            }
        }
    }, [hasFocus, input, bottom])

    const onClick = (e:any) => {
        setFocus(trunk);
        e.preventDefault();
        if (!e.metaKey || hasContent) {
            setHead(trunk);
        } else if (hasLink) {
            window.location = trunk.value.link;
        }
    };

    const setValue = (e:any) => {
        if (e.target.value !== trunk.value.title) {
            setTitle(trunk, e.target.value);
        }
    };

    let className = 'MAGNOLIAL_ce';
    if (entryEnabled){
        className += ' MAGNOLIAL_readonly';
    }
    if (hasFocus){
        className += ' MAGNOLIAL_focused';
    }
    return (
        <div  className="MAGNOLIAL_ce_wrapper" onClick={onClick}>
            <ContentEditable className={className + " MAGNOLIAL_ce_bottom"}
                                refInternal={bottom}
                                tabIndex={-1}
                                html={trunk.value.title}
                                disabled={true}/>
            <ContentEditable refInternal={input} className={className + " MAGNOLIAL_ce_top"}
                                html={trunk.value.title}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                onChange={setValue}/>
        </div>
    );
}

export default Title;
