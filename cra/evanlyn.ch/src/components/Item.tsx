import React from 'react';
import Title from './Title';
import Decoration from './Decoration';
import { Trunk } from '../immutable-tree';
import { propTypes } from 'react-bootstrap/esm/Image';

var rb = require('react-bootstrap');

type ItemProps = {
    trunk: Trunk;
    hasFocus: boolean;
    entryEnabled: boolean;
    focus:Trunk|undefined;
    focusAncestors:[(Trunk|undefined)?];
    setHead:(child:Trunk|undefined)=>void;
    setFocus:(child:Trunk|undefined)=>void;
    setCollapsed:(child:Trunk, collapsed:boolean)=>void;
    setTitle:(child:Trunk, title:string)=>void;
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
            return <Item trunk={child}
                         key={child._serial}
                         focus={props.focus}
                         hasFocus={props.focus === child}
                         focusAncestors={props.focusAncestors}
                         setHead={props.setHead}
                         setFocus={props.setFocus}
                         setCollapsed={props.setCollapsed}
                         entryEnabled={props.entryEnabled}
                         setTitle={props.setTitle}/>;
        });
    }

    const toggleCollapsed = () => {
        props.setCollapsed(props.trunk, !props.trunk.collapsed);
    };

    const onFocus = () => {
        props.setFocus(props.trunk);
    };

    const hasContent = props.trunk.value.content !== null && props.trunk.value.content !== undefined;
    const hasLink = props.trunk.value.link !== null && props.trunk.value.link !== undefined;
    const listItem = (
        <li>
            <rb.Col lg={12}>
                <rb.Row onFocus={onFocus}>
                <Decoration trunk={props.trunk}
                                    collapseable={props.trunk.childs.length > 0} 
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
                               hasContent={hasContent}
                               hasLink={hasLink}
                               hasFocus={props.hasFocus}/>
                </rb.Row>
                <rb.Row className="MAGNOLIAL_list">
                    <ul>
                        {children()}
                    </ul>
                </rb.Row>
            </rb.Col>
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

export default Item;
