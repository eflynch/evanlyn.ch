
import React from 'react';
import Actions from './actions';
import { Trunk } from './immutable-tree';
import { CopyTextToClipboard } from './utils';

const setTitle = (child:Trunk, title:string, dispatch:React.Dispatch<any>) => {
    dispatch(Actions.MODIFY(
        child,
        {
            title: title,
            content: child.value.content,
            link: child.value.link
        }));
};

const setContent = (child:Trunk, content:string, dispatch:React.Dispatch<any>) => {
    dispatch(Actions.MODIFY(
        child,
        {
            title: child.value.title,
            content: content,
            link: child.value.link
        }));
};

const setLink = (child:Trunk, link:string, dispatch:React.Dispatch<any>) => {
    dispatch(Actions.MODIFY(
        child,
        {
            title: child.value.title,
            content: child.value.content,
            link: link
        }));
};


const KeyDownHandler = (child:Trunk, mode:string, setMode:(mode:string)=>void, dispatch:React.Dispatch<any>) => (e:any) => {
    switch (mode){
        case 'vim-default':
            keyDownVimDefault(e, child, setMode, dispatch);
            break;
        case 'vim-input':
            keyDownVimInput(e, child, setMode, dispatch);
            break;
        case 'standard':
            keyDownStandard(e, child, setMode, dispatch);
            break;
        default:
            keyDownStandard(e, child, setMode, dispatch);
            break;
    }
    keyDownCommon(e, child, setMode, dispatch);
};
export default KeyDownHandler;

const keyDownCommon = (e:any, child:Trunk, setMode:(mode:string)=>void, dispatch:React.Dispatch<any>) => {
    if (e.keyCode === 8){ // === 'Backspace'){
        if (e.shiftKey){
            e.preventDefault();
            dispatch(Actions.DELETE(child));

        } else {
            if (child.value.title === '' && child.childs.length === 0){
                e.preventDefault();
                dispatch(Actions.DELETE(child));
            }
        }
    }

    if (e.keyCode === 9){ // === 'Tab'){
        e.preventDefault();
        if (e.shiftKey){
            dispatch(Actions.OUTDENT(child));
        } else {
            dispatch(Actions.INDENT(child));
        }
    }
    if (e.keyCode === 39){ // 'ArrowRight'){
        if (e.shiftKey){
            e.preventDefault();
            dispatch(Actions.INDENT(child));
        }
    }
    if (e.keyCode === 37){ // 'ArrowLeft'){
        if (e.shiftKey){
            e.preventDefault();
            dispatch(Actions.OUTDENT(child));
        }
    }
    if (e.keyCode === 38){  //'ArrowUp'){
        e.preventDefault();
        if (e.shiftKey){
            dispatch(Actions.SHIFT_UP(child));
        } else {
            dispatch(Actions.FOCUS_UP(child));
        }
    }
    if (e.keyCode === 40){ //'ArrowDown'){
        e.preventDefault();
        if (e.shiftKey){
            dispatch(Actions.SHIFT_DOWN(child));
        } else {
            dispatch(Actions.FOCUS_DOWN(child));
        }
    }
};

const keyDownVimDefault = (e:any, child:Trunk, setMode:(mode:string)=>void, dispatch:React.Dispatch<any>) => {
    if (e.metaKey){
        return;
    }
    e.preventDefault();
    if (e.keyCode === 72){ // h
        if (e.shiftKey){
            dispatch(Actions.OUTDENT(child));
        }
    }
    if (e.keyCode === 74){ // j
        if (e.shiftKey){
            dispatch(Actions.SHIFT_DOWN(child));
        } else {
            dispatch(Actions.FOCUS_DOWN(child));
        }
    }
    if (e.keyCode === 75){ // k
        if (e.shiftKey){
            dispatch(Actions.SHIFT_UP(child));
        } else {
            dispatch(Actions.FOCUS_UP(child));
        }
    }
    if (e.keyCode === 76){ // l
        if (e.shiftKey){
            dispatch(Actions.INDENT(child));
        }
    }
    if (e.keyCode === 79){ // o
        if (e.shiftKey){
            dispatch(Actions.NEW_ABOVE(child));
            setMode('vim-input');
        } else {
            dispatch(Actions.NEW_BELOW(child));
            setMode('vim-input');
        }
    }
    if (e.keyCode === 85){ // u
        dispatch(Actions.UNDO());
    }
    if (e.keyCode === 69){ // e
        if (e.shiftKey){
            setContent(child, child.value.title, dispatch);
        }
    }
    if (e.keyCode === 70){ // f
        if (e.shiftKey){
            setLink(child, child.value.title, dispatch);
        }
    }
    if (e.keyCode === 82){ // r
        dispatch(Actions.REDO());
    }
    if (e.keyCode === 73){ // i
        setMode('vim-input');
    }
    if (e.keyCode === 65){ // a
    }
    if (e.keyCode === 67){ // c
        setTitle(child, "", dispatch);
        setMode('vim-input');
    }
    if (e.keyCode === 68){ // d
        if (e.shiftKey){
            dispatch(Actions.DELETE(child));
        }
    }
    if (e.keyCode === 32){ // space
        e.preventDefault();
        dispatch(Actions.SET_COLLAPSED(child, !child.collapsed));
    }
    if (e.keyCode === 190){ // >
        e.preventDefault();
        dispatch(Actions.DELVE_IN(child));
    }
    if (e.keyCode === 188){ // <
        e.preventDefault();
        dispatch(Actions.DELVE_OUT(child));
    }
    if (e.keyCode === 13){ // === 'Enter'){
        e.preventDefault();
        dispatch(Actions.DELVE_IN(child));
    }
    if (e.keyCode === 27){ //'Escape'){
        e.preventDefault();
        dispatch(Actions.DELVE_OUT(child));
    }

    if (e.keyCode === 87){ // w
        if (e.shiftKey){
            CopyTextToClipboard(JSON.stringify(child));
            setContent(child, child.value.title, dispatch);
        }
    }
};

const keyDownVimInput = (e:any, child:Trunk, setMode:(mode:string)=>void, dispatch:React.Dispatch<any>) => {
    if (e.keyCode === 27){ //'Escape'){
        e.preventDefault();
        setMode('vim-default');
    }

    if (e.keyCode === 13){ // === 'Enter'){
        if (e.shiftKey){
            return;
        }
        e.preventDefault();
        if (child.value.title === ''){
            dispatch(Actions.NEW(child));
        } else {
            dispatch(Actions.NEW_BELOW(child));
        }
    }
};

const keyDownStandard = (e:any, child:Trunk, setMode:(mode:string)=>void, dispatch:React.Dispatch<any>) => {
    if (e.keyCode === 32){ // Spacebar
        if (e.shiftKey){
            e.preventDefault();
            dispatch(Actions.SET_COLLAPSED(child, !child.collapsed));
        }
    }
    if (e.key === 27){ //'Escape'){
        e.preventDefault();
        if (e.shiftKey){
            if (child.childs.length > 0){
                dispatch(Actions.DELVE_IN(child));
            }
        } else {
            dispatch(Actions.DELVE_OUT(child));
        }
    }
};