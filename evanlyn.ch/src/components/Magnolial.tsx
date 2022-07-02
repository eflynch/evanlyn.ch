import { useRef, useEffect, useState, useCallback, } from 'react';
import { useSessionStorage } from 'react-use';
import Item from './Item';
import Breadcrumbs from './Breadcrumbs';
import Title from './Title';

import './Magnolial.css';

import {
    OutdentItem, IndentItem, MoveItemUp, Undo, Redo,
    CreateTrunkCache, GetTrunk, ParentOf, SetValue, SetCollapsed,
    AncestorsOf, DeleteItem, NewItemAbove, NewItemBelow, MoveItemDown,
    SuccOf, PredOf, Trunk, TrunkCache
} from '../immutable-tree';
import { CopyTextToClipboard } from '../utils';
import ContentIFrame from './ContentIFrame';


function usePreviousValue(value:any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

  
type MagnolialProps = {
    initTrunk:Trunk;
    initHead?:string;
    onUpdate:(update:any)=>void;
};


function Magnolial(props:MagnolialProps):JSX.Element {
    const createTrunkCache = () => {
        return CreateTrunkCache(props.initTrunk, (trunk:Trunk)=>{
            setTrunk(trunk); 
         }, { title: "", content: null, link: null});
    };

    const trunkCacheRef = useRef<TrunkCache>(createTrunkCache());
    useEffect(()=>{
        trunkCacheRef.current = createTrunkCache();
        setTrunk(trunkCacheRef.current.current);
    },[props.initTrunk]);



    const trunkCache:TrunkCache = trunkCacheRef.current as TrunkCache;

    const [trunk, setTrunk] = useState<Trunk>(trunkCache.current);
    const [lastFocus, setLastFocus] = useState<string|undefined>(undefined);

    const [headSerial, setHeadSerial] = useState<string|undefined>(props.initHead || trunkCache.current._serial);
    const [focusSerial, setFocusSerial] = useState<string|undefined>(props.initHead || trunkCache.current._serial);

    const [mode, setMode] = useSessionStorage<string>('mode', 'vim-default');

    const entryEnabled = mode !== 'vim-default';
    const previousHeadSerial = usePreviousValue(headSerial);
    const onUpdate = props.onUpdate;

    const setHead = (child:Trunk|undefined) => {
        if (child === undefined) {
            return;
        }
        if (child.childs.length === 0 && child.value.link !== null && child.value.link !== undefined) {
            window.location = child.value.link;
        }
        if (child.childs.length === 0 && child.value.content === null) {
            return;
        }

        setHeadSerial(child._serial);
        setFocusSerial(child._serial);
    };

    const setFocus = useCallback((child:Trunk|undefined) => {
        const head:Trunk = GetTrunk(headSerial, trunkCache) || trunkCache.current;
        if (child === undefined) {
            return;
        }
        if (child !== head) {
            if (AncestorsOf(child, trunkCache).indexOf(head) < 0) {
                return;
            }
        }
        setFocusSerial(child._serial);
    }, [trunkCache, headSerial]);

    const setTitle = (child:Trunk, title:string) =>{
        SetValue(child, trunkCache, {
            title: title,
            content: child.value.content,
            link: child.value.link
        });
    }
    const setContent = (child:Trunk, content:string) => {
        SetValue(child, trunkCache, {
            title: child.value.title,
            content: content,
            link: child.value.link
        });
    }

    const setLink = (child:Trunk, link:string) => {
        SetValue(child, trunkCache, {
            title: child.value.title,
            content: child.value.content,
            link: link
        });
    }
    const setCollapsed = (child:Trunk, state:boolean) => {
        return SetCollapsed(child, trunkCache, state);
    }

    const keyDownCommon = (e:any, child:Trunk) => {
        if (e.keyCode === 8) { // === 'Backspace'){
            if (e.shiftKey) {
                e.preventDefault();
                setFocus(PredOf(child, trunkCache));
                DeleteItem(child, trunkCache);
            } else {
                if (child.value.title === '' && child.childs.length === 0) {
                    e.preventDefault();
                    setFocus(PredOf(child, trunkCache));
                    DeleteItem(child, trunkCache);
                }
            }
        }

        if (e.keyCode === 9) { // === 'Tab'){
            e.preventDefault();
            if (e.shiftKey) {
                OutdentItem(child, trunkCache);
            } else {
                IndentItem(child, trunkCache);
            }
        }
        if (e.keyCode === 39) { // 'ArrowRight'){
            if (e.shiftKey) {
                e.preventDefault();
                IndentItem(child, trunkCache);
            }
        }
        if (e.keyCode === 37) { // 'ArrowLeft'){
            if (e.shiftKey) {
                e.preventDefault();
                OutdentItem(child, trunkCache);
            }
        }
        if (e.keyCode === 38) {  //'ArrowUp'){
            e.preventDefault();
            if (e.shiftKey) {
                MoveItemUp(child, trunkCache);
            } else {
                setFocus(PredOf(child, trunkCache));
            }
        }
        if (e.keyCode === 40) { //'ArrowDown'){
            e.preventDefault();
            if (e.shiftKey) {
                if (!MoveItemDown(child, trunkCache)) {
                    IndentItem(child, trunkCache);
                }
            } else {
                if (headSerial === child._serial) {
                    setFocus(child.childs[0]);
                } else {
                    setFocus(SuccOf(child, trunkCache));
                }
            }
        }
    };

    const keyDownVimDefault = (e:any, child:Trunk) => {
        if (e.metaKey) {
            return;
        }
        e.preventDefault();
        if (e.keyCode === 72) { // h
            if (e.shiftKey) {
                OutdentItem(child, trunkCache);
            }
        }
        if (e.keyCode === 74) { // j
            if (e.shiftKey) {
                if (!MoveItemDown(child, trunkCache)) {
                    IndentItem(child, trunkCache);
                }
            } else {
                if (headSerial === child._serial) {
                    setFocus(child.childs[0]);
                } else {
                    setFocus(SuccOf(child, trunkCache));
                }
            }
        }
        if (e.keyCode === 75) { // k
            if (e.shiftKey) {
                MoveItemUp(child, trunkCache);
            } else {
                setFocus(PredOf(child, trunkCache));
            }
        }
        if (e.keyCode === 76) { // l
            if (e.shiftKey) {
                IndentItem(child, trunkCache);
            } else {
            }
        }
        if (e.keyCode === 79) { // o
            if (e.shiftKey) {
                setFocus(NewItemAbove(child, trunkCache));
                setMode('vim-input');
            } else {
                setFocus(NewItemBelow(child, trunkCache));
                setMode('vim-input');
            }
        }
        if (e.keyCode === 85) { // u
            Undo(trunkCache);
        }
        if (e.keyCode === 87) { // w
            if (e.shiftKey) {
                CopyTextToClipboard(JSON.stringify(trunkCache.current));
            }
        }
        if (e.keyCode === 69) { // e
            if (e.shiftKey) {
                setContent(child, child.value.title);
            }
        }
        if (e.keyCode === 70) { // f
            if (e.shiftKey) {
                setLink(child, child.value.title);
            }
        }
        if (e.keyCode === 82) { // r
            Redo(trunkCache);
        }
        if (e.keyCode === 73) { // i
            setMode('vim-input');
        }
        if (e.keyCode === 65) { // a
        }
        if (e.keyCode === 67) { // c
            setTitle(child, "");
            setMode('vim-input');
        }
        if (e.keyCode === 68) { // d
            const head = GetTrunk(headSerial, trunkCache);
            if (head === child) {
                return;
            }
            if (e.shiftKey) {
                setFocus(PredOf(child, trunkCache));
                DeleteItem(child, trunkCache);
            }
        }
        if (e.keyCode === 32) { // space
            e.preventDefault();
            setCollapsed(child, !child.collapsed);
        }
        if (e.keyCode === 190) { // >
            e.preventDefault();
            setHead(child);
            setFocus(child.childs[0]);
        }
        if (e.keyCode === 188) { // <
            e.preventDefault();
            var head = GetTrunk(headSerial, trunkCache);
            if (head === trunk) {
                return;
            }
            setHead(ParentOf(head, trunkCache));
            setFocus(head);
        }
        if (e.keyCode === 13) { // === 'Enter'){
            e.preventDefault();
            setHead(child);
            setFocus(child.childs[0]);
        }
        if (e.keyCode === 27) { //'Escape'){
            const head = GetTrunk(headSerial, trunkCache);
            e.preventDefault();
            if (head === trunk) {
                return;
            }
            setHead(ParentOf(head, trunkCache));
            setFocus(head);
        }
    };

    const keyDownVimInput = (e:any, child:Trunk) => {
        if (e.keyCode === 27) { //'Escape'){
            e.preventDefault();
            setMode('vim-default');
        }

        if (e.keyCode === 13) { // === 'Enter'){
            if (e.shiftKey) {
                return;
            }
            e.preventDefault();
            if (child.value.title === '') {
                var head = GetTrunk(headSerial, trunkCache);
                if (head === ParentOf(child, trunkCache)) {
                    setFocus(NewItemBelow(child, trunkCache));
                } else {
                    if (!OutdentItem(child, trunkCache)) {
                        setFocus(NewItemBelow(child, trunkCache));
                    }
                }
            } else {
                setFocus(NewItemBelow(child, trunkCache));
            }
        }
    };

    const keyDownStandard = (e:any, child:Trunk) => {
        if (e.keyCode === 32) { // Spacebar
            if (e.shiftKey) {
                e.preventDefault();
                setCollapsed(child, !child.collapsed);
            }
        }
        if (e.keyCode === 27) { //'Escape'){
            e.preventDefault();
            if (e.shiftKey) {
                if (child.childs.length > 0) {
                    setHead(child);
                    setFocus(child.childs[0]);
                }
            } else {
                var head = GetTrunk(headSerial, trunkCache);
                if (head === trunk) {
                    return;
                }
                setHead(ParentOf(head, trunkCache));
                setFocus(ParentOf(head, trunkCache));
            }
        }
    }

    const keyDownHandler = (e:any, child:Trunk) => {
        switch (mode) {
            case 'vim-default':
                keyDownVimDefault(e, child);
                break;
            case 'vim-input':
                keyDownVimInput(e, child);
                break;
            case 'standard':
                keyDownStandard(e, child);
                break;
            default:
                keyDownStandard(e, child);
                break;
        }
        keyDownCommon(e, child);
    };


    useEffect(()=> {
        const head:Trunk = GetTrunk(headSerial, trunkCache) || trunkCache.current;
        const focus = GetTrunk(focusSerial, trunkCache);

        document.body.onfocus = (e:any) => {
            if (focus === undefined) {
                if (lastFocus) {
                    setFocusSerial(lastFocus);
                    setLastFocus(undefined);
                } else {
                    setFocus(head);
                }
            }
        };

        document.body.onblur = (e:any) => {
            if (focus !== undefined) {
                setLastFocus(focus._serial);
                setFocusSerial(undefined);
            }
        };
        return () => {
            document.body.onfocus = null;
            document.body.onblur = null;
        }
    }, [focusSerial, headSerial]);

    useEffect(()=>{
        const head:Trunk = GetTrunk(headSerial, trunkCache) || trunkCache.current;
        if (head && head.value.content === null && head.childs.length === 0) {
            const parent = ParentOf(head, trunkCache);
            if (parent !== undefined) {
                setHead(parent);
                setFocus(head);
            }
        }
        onUpdate({trunk, headSerial, focusSerial});
    }, [onUpdate, trunk, headSerial, focusSerial, previousHeadSerial, trunkCache, setFocus])

    const head:Trunk = GetTrunk(headSerial, trunkCache) || trunkCache.current;
    const focus = GetTrunk(focusSerial, trunkCache);
    return (
        <div className="MAGNOLIAL" onKeyDown={(e:any)=>{keyDownHandler(e, focus || head);}} >
            <div style={{
                width:"80%"
            }}>
                <div>
                    <Breadcrumbs setHead={setHead} ancestors={AncestorsOf(head, trunkCache)} />
                    <div className="title">
                        <Title trunk={head} hasContent={false} focusCapture={head.value.content === null || head.value.content === undefined} hasLink={false} setTitle={setTitle} setFocus={setFocus} setHead={setHead} entryEnabled={entryEnabled} hasFocus={focus === head} />
                    </div>
                </div>
                <div>
                    {(!head?.childs.length && head?.value.content !== null) ? 
                        <ContentIFrame bootstrap={{headSerial: head._serial as string}} src={head.value.content} onEscape={()=> {
                            setHead(ParentOf(head, trunkCache));
                            setFocus(head);
                        }} />
                    : head?.childs.map((child:Trunk|undefined) =>{
                        if (child === undefined) {
                            return <></>;
                        }
                        const numHeadAncestors = AncestorsOf(head, trunkCache).length;
                        let focusAncestors = AncestorsOf(focus, trunkCache).slice(1 + numHeadAncestors);
                        focusAncestors.push(focus);

                        return <Item trunk={child}
                                     key={child._serial}
                                     focusAncestors={
                                        focusAncestors[0] == child ?
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

export default Magnolial;

