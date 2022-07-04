import React, { useEffect, useContext, } from 'react';
import { useSessionStorage } from 'react-use';
import Item from './Item';
import Breadcrumbs from './Breadcrumbs';
import Title from './Title';
 
import MagnoliaContext from '../context';
import { MainState } from '../mainstate';
  

import './Magnolia.css';

import ContentIFrame from './ContentIFrame';
import { MODIFY, SET_COLLAPSED, SET_FOCUS, SET_HEAD } from '../actions';
import { AncestorsOf, Lookup, ParentOf, Trunk } from '../immutable-tree';
import KeyDownHandler from '../keybindings';


function Magnolia():JSX.Element {
    const [mode, setMode] = useSessionStorage<string>('mode', 'vim-default');
    const {state, dispatch} = useContext<{state:MainState, dispatch:React.Dispatch<any>}>(MagnoliaContext);
    const {magnolia} = state;
    const {tree, headSerial, focusSerial} = magnolia;


    const ensureHeadAndFocus = ()=> {
        if (headSerial === null || headSerial === undefined || Lookup(tree, headSerial) === undefined) {
            dispatch(SET_HEAD(tree.trunk));
        }
        if (focusSerial === null || focusSerial === undefined || Lookup(tree, focusSerial) === undefined) {
            dispatch(SET_FOCUS(tree.trunk));
        }
    };
    useEffect(ensureHeadAndFocus, [headSerial, focusSerial, dispatch, tree.trunk]);
    const head:Trunk = headSerial ? Lookup(tree, headSerial) || tree.trunk : tree.trunk;
    const focus:Trunk = focusSerial ? Lookup(tree, focusSerial) || tree.trunk : tree.trunk;

    useEffect(()=>{
        const content = head.value.content;
        const focusCapture = content === null || content === undefined || content === "";
        if (focusCapture && focusSerial === null) {
            dispatch(SET_FOCUS(head));
        }
        if (!head.value.content && head.childs.length === 0 && ParentOf(tree, head) !== undefined) {
            dispatch(SET_HEAD(ParentOf(tree, head)));
            dispatch(SET_FOCUS(head));
        }
    }, [tree, focusSerial, head, dispatch]);

    const entryEnabled = mode !== 'vim-default';

    const setTitle = (child:Trunk, title:string) => {
        dispatch(MODIFY(
            child,
            {
                title: title,
                content: child.value.content,
                link: child.value.link
            }));
    };

    const setCollapsed = (child:Trunk, collapsedState:boolean) => {
        dispatch(SET_COLLAPSED(child, collapsedState));
    };

    const setHead = (head:Trunk|undefined) => {
        if (head === undefined){
            return;
        }
        dispatch(SET_HEAD(head));
    };

    const setFocus = (child:Trunk|undefined) => {
        if (child === undefined){
            return;
        }
        dispatch(SET_FOCUS(child));
    };

    const onKeyDown = KeyDownHandler(focus, mode, setMode, dispatch);

    return (
        <div className="magnolia" onKeyDown={onKeyDown} >
            <div style={{
                width:"80%"
            }}>
                <div>
                    <Breadcrumbs setHead={setHead} ancestors={AncestorsOf(tree, head)} />
                    <div className="title">
                        <Title
                            trunk={head}
                            setTitle={setTitle}
                            setFocus={setFocus}
                            setHead={setHead}
                            entryEnabled={entryEnabled}
                            hasFocus={focus === head} />
                    </div>
                </div>
                <div>
                    {(!head?.childs.length && head?.value.content !== null) ? 
                        <ContentIFrame bootstrap={head.value} src={head.value.content} onEscape={()=> {
                            setHead(ParentOf(tree, head));
                            setFocus(head);
                        }} />
                    : head?.childs.map((child:Trunk|undefined) =>{
                        if (child === undefined) {
                            return <></>;
                        }
                        const numHeadAncestors = AncestorsOf(tree, head).length;
                        let focusAncestors = AncestorsOf(tree, focus).slice(1 + numHeadAncestors);
                        focusAncestors.push(focus);

                        return <Item trunk={child}
                                     key={child.serial}
                                     focusAncestors={
                                        focusAncestors[0] === child ?
                                            focusAncestors.slice(1)
                                        : null}
                                     setHead={setHead}
                                     setFocus={setFocus}
                                     setCollapsed={setCollapsed}
                                     entryEnabled={entryEnabled}
                                     setTitle={setTitle}/>;
                    })}
                </div>
            </div>
            <div className="modes">
                <button style={{
                    color: mode === "standard" ? "#807861" : "",
                }} onClick={()=>{setMode("standard");}}>std</button>
                <button style={{
                    color: mode === "standard" ? "" : "#807861",
                }} onClick={()=>{setMode("vim-default");}}>vim</button>
            </div>
        </div>
    );
};

export default Magnolia;

