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
    focusCapture:boolean;
    hasLink:boolean;
    entryEnabled:boolean;
    trunk:Trunk;
};

function Title(props:TitleProps):JSX.Element {
    const {setFocus, setHead, setTitle, hasFocus, focusCapture, hasContent, hasLink, entryEnabled, trunk} = props;
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
        const ref = entryEnabled ? input : bottom;
        if (ref.current) {
            ref.current.onblur = (e:any) => {
                if (hasFocus && focusCapture) {
                    setTimeout(()=>{ref.current?.focus();}, 0);
                }
            };
        }
        return () => {
            if (ref.current) {
                ref.current.onblur = null;
            }
        }
    }, [focusCapture, entryEnabled, input, bottom, hasFocus]);

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
    }, [entryEnabled, hasFocus, input, bottom])

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

    const topClassName = [
        'MAGNOLIAL_ce',
        'MAGNOLIAL_ce_top',
        !entryEnabled ? 'MAGNOLIAL_transparent' : '',
        hasFocus ? 'MAGNOLIAL_focused' : ''
    ].join(" ");
    const bottomClassName = [
        'MAGNOLIAL_ce',
        'MAGNOLIAL_ce_bottom',
        entryEnabled ? 'MAGNOLIAL_transparent' : '',
        hasFocus ? 'MAGNOLIAL_focused' : ''
    ].join(" ");

    return (
        <div  className="MAGNOLIAL_ce_wrapper" onClick={onClick}>
            <ContentEditable className={bottomClassName}
                                refInternal={bottom}
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
