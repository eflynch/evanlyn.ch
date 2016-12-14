import React from 'react';
import Title from './title';
import Decoration from './decoration';

var rb = require('react-bootstrap');

class Item extends React.Component {
    constructor(props){
        super(props);
        this.genChildren = this.genChildren.bind(this);
        this.toggleCollapsed = this.toggleCollapsed.bind(this);
        this.setHead = this.setHead.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState){
        if (this.props.trunk !== nextProps.trunk){
            return true;
        }
        if (this.props.hasFocus !== nextProps.hasFocus){
            return true;
        }
        if (this.props.entryEnabled !== nextProps.entryEnabled){
            return true;
        }
        if (nextProps.hasFocus){
            return true;
        }
        var focusWasBeneath = this.props.focusAncestors.indexOf(this.props.trunk) > -1;
        var focusIsBeneath = nextProps.focusAncestors.indexOf(nextProps.trunk) > -1;
        if (focusWasBeneath !== focusIsBeneath){
            return true;
        }
        if (this.props.focus !== nextProps.focus){
            if (focusIsBeneath){
                return true;
            } 
        }
        return false;
    }

    genChildren(){
        if (this.props.trunk.childs === undefined){
            return [];
        }
        if (this.props.trunk.collapsed){
            return [];
        }
        return this.props.trunk.childs.map(function(child){
            return <Item trunk={child}
                         key={child._serial}
                         focus={this.props.focus}
                         hasFocus={this.props.focus === child}
                         focusAncestors={this.props.focusAncestors}
                         setHead={this.props.setHead}
                         setFocus={this.props.setFocus}
                         keyDownHandler={this.props.keyDownHandler}
                         setCollapsed={this.props.setCollapsed}
                         entryEnabled={this.props.entryEnabled}
                         setTitle={this.props.setTitle}/>;
        }.bind(this));
    }

    toggleCollapsed(){
        this.props.setCollapsed(this.props.trunk, !this.props.trunk.collapsed);
    }

    setHead(){
        this.props.setHead(this.props.trunk);
    }

    onFocus(){
        this.props.setFocus(this.props.trunk);
    }

    onKeyDown(e){
        this.props.keyDownHandler(e, this.props.trunk);
    }

    render(){
        var listItem = (
            <li>
                <rb.Col lg={12}>
                    <rb.Row onFocus={this.onFocus}>
                        <Decoration collapseable={this.props.trunk.childs.length > 0} 
                                    collapsed={this.props.trunk.collapsed}
                                    toggleCollapsed={this.toggleCollapsed}
                                    setHead={this.setHead}/>
                        <Title trunk={this.props.trunk}
                               onKeyDown={this.onKeyDown}
                               setTitle={this.props.setTitle}
                               setFocus={this.props.setFocus}
                               setHead={this.setHead}
                               entryEnabled={this.props.entryEnabled}
                               hasFocus={this.props.hasFocus}/>
                    </rb.Row>
                    <rb.Row className="MAGNOLIAL_list">
                        <ul>
                            {this.genChildren()}
                        </ul>
                    </rb.Row>
                </rb.Col>
            </li>
        );

        if (this.props.trunk.value.link !== null && this.props.trunk.value.link !== undefined){
            return <a href={this.props.trunk.value.link}>{listItem}</a>;
        } 
        if (this.props.trunk.value.content !== null && this.props.trunk.value.content !== undefined){
            return <div className="iframe-link">{listItem}</div>;
        }
        return <div className="normal">{listItem}</div>;
    }
}

module.exports = Item;
