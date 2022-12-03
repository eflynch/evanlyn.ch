import {memo} from 'react';
import Title from './Title';
import Decoration from './Decoration';
import { Trunk } from '../immutable-tree';

type ItemProps = {
    trunk: Trunk;
    entryEnabled: boolean;
    takingNotes: boolean;
    focusAncestors:(Trunk|undefined)[]|null;
    setHead:(child:Trunk|undefined)=>void;
    setFocus:(child:Trunk|undefined)=>void;
    setCollapsed:(child:Trunk, collapsed:boolean)=>void;
    setTitle:(child:Trunk, title:string)=>void;
    setNotes:(child:Trunk, note:string)=>void;
};

function Item(props:ItemProps):JSX.Element {
    const children = ()=> {
        if (props.trunk.childs === undefined){
            return [];
        }
        if (props.trunk.collapsed){
            return [];
        }
        return (props.trunk.childs as [Trunk]).map((child:Trunk) => {
            // pass maybeFocus only if not undefined and in focusAncestors
            // pass focusAncestors
            return <Item trunk={child}
                         key={child.serial}
                         entryEnabled={props.entryEnabled}
                         takingNotes={props.takingNotes}
                         focusAncestors={
                            props.focusAncestors ?
                                props.focusAncestors[0] === child ?
                                    props.focusAncestors.slice(1)
                                    : null
                                : null}
                         setHead={props.setHead}
                         setFocus={props.setFocus}
                         setNotes={props.setNotes}
                         setCollapsed={props.setCollapsed}
                         setTitle={props.setTitle}/>;
        });
    }

    const toggleCollapsed = () => {
        props.setCollapsed(props.trunk, !props.trunk.collapsed);
    };

    const childs = children()
    const hasContent = props.trunk.value.content !== null && props.trunk.value.content !== undefined;
    const hasLink = props.trunk.value.link !== null && props.trunk.value.link !== undefined;
    const hasNote = props.trunk.value.note !== null && props.trunk.value.note !== undefined && childs.length === 0;
    const hasFocus = props.focusAncestors !== null && props.focusAncestors.length === 0;
    const listItem = (
        <li>
            <div>
                <Decoration trunk={props.trunk}
                                collapseable={props.trunk.childs.length > 0 || hasNote} 
                                collapsed={props.trunk.collapsed}
                                toggleCollapsed={toggleCollapsed}
                                hasContent={hasContent}
                                hasLink={hasLink}
                                setHead={props.setHead}
                                setFocus={props.setFocus}/>
                    <Title trunk={props.trunk}
                            setTitle={props.setTitle}
                            setFocus={props.setFocus}
                            setHead={props.setHead}
                            entryEnabled={props.entryEnabled}
                            setNotes={props.setNotes}
                            showNotes={hasNote && !props.trunk.collapsed}
                            takingNotes={props.takingNotes}
                            hasFocus={hasFocus}/>
            </div>
            <div className="MAGNOLIAL_list">
                <ul>
                    {childs}
                </ul>
            </div>
        </li>
    );

    if (hasLink) {
        return <div className="link">{listItem}</div>;
    }
    if (hasContent) {
        return <div className="iframe-link">{listItem}</div>;
    }
    return <div className="normal">{listItem}</div>;
}

export default memo(Item);
