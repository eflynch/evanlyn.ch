import React from 'react';
import ReactDOM from 'react-dom';
import Item from './item';
import Breadcrumbs from './breadcrumbs';
import {OutdentItem, IndentItem, MoveItemUp, Undo, Redo, CreateTrunkCache, GetTrunk, ParentOf, SetValue, SetCollapsed, AncestorsOf, DeleteItem, NewItemAbove, NewItemBelow, MoveItemDown, SuccOf, PredOf} from '../immutable-tree';
import Title from './title';

var rb = require('react-bootstrap');

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

class ContentIFrame extends React.Component {
    onLoad (e) {
        var iframe = ReactDOM.findDOMNode(this.refs.iframe);
        iframe.contentWindow.focus();
        iframe.contentWindow.document.body.onkeydown = function (e){
            if (e.key === "Escape"){
                this.props.onEscape();
            }
        }.bind(this);
        iframe.contentWindow.focus();
    }
    render () {
        return <iframe onLoad={this.onLoad.bind(this)} ref="iframe" src={this.props.src} />
    }
}

class Magnolial extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            trunk: {},
            headSerial: null,
            focusSerial: null,
            MODE: 'vim-default'
        };
        this.initTrunk = this.initTrunk.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setContent = this.setContent.bind(this);
        this.setLink = this.setLink.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.setHead = this.setHead.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.setCollapsed = this.setCollapsed.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyDownCommon = this.keyDownCommon.bind(this);
        this.keyDownStandard = this.keyDownStandard.bind(this);
        this.keyDownVimDefault = this.keyDownVimDefault.bind(this);
        this.keyDownVimInput = this.keyDownVimInput.bind(this);
    }
    defaultProps() {
        return {
            initTrunk: {childs:[{}]},
            onUpdate: function (){},
        };
    }
    componentWillMount() {
        if (this.props.hasOwnProperty('initTrunk')){
            this.initTrunk(this.props.initTrunk);

            if (this.props.hasOwnProperty('initHead')){
                if (GetTrunk(this.props.initHead, this.t) !== undefined){
                    this.setState({
                        headSerial: this.props.initHead,
                        focusSerial: this.props.initHead
                    });
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('initTrunk')){
            this.initTrunk(nextProps.initTrunk);
        }
        if (nextProps.hasOwnProperty('initHead')){
            if (GetTrunk(nextProps.initHead, this.t) !== undefined){
                this.setState({
                    headSerial: nextProps.initHead,
                    focusSerial: nextProps.initHead
                });
            }
        }
    }
    componentWillUpdate(nextProps, nextState){
        const content = GetTrunk(this.state.headSerial, this.t).value.content;
        let focusCapture = content === null || content === undefined;
        if (nextState.focusSerial === null && focusCapture){
            if (nextState.headSerial !== this.state.headSerial){
                this.setFocus(GetTrunk(nextState.headSerial, this.t));
            } else {
                this.setFocus(GetTrunk(this.state.focusSerial, this.t));
            }
        }
        const head = GetTrunk(nextState.headSerial, this.t);
        if (head.content === null && head.childs.length === 0) {
            const parent = ParentOf(head, this.t);
            if (parent !== undefined){
                this.setHead(parent);
                this.setFocus(head);
            }
        }
        nextProps.onUpdate(nextState.trunk, nextState.headSerial, nextState.focusSerial);
    }

    initTrunk(initTrunk){
        this.t = CreateTrunkCache(initTrunk, function (trunk){
            this.setState({trunk: trunk});
        }.bind(this), {title: "", content: null, link: null});
        this.setState({
            trunk: this.t.current,
            headSerial: this.t.current._serial,
            focusSerial: this.t.current._serial
        });
    }

    // Mutators
    setTitle(child, title){
        return SetValue(child, this.t, {
            title: title,
            content: child.value.content,
            link: child.value.link
        });
    }
    setContent(child, content){
        return SetValue(child, this.t, {
            title: child.value.title,
            content: content,
            link: child.value.link
        });
    }
    setLink(child, link){
        return SetValue(child, this.t, {
            title: child.value.title,
            content: child.value.content,
            link: link
        });
    }
    setCollapsed(child, state){
        return SetCollapsed(child, this.t, state);
    }
    keyDownHandler(e, child){
        switch (this.state.MODE){
            case 'vim-default':
                this.keyDownVimDefault(e, child);
                break;
            case 'vim-input':
                this.keyDownVimInput(e, child);
                break;
            case 'standard':
                this.keyDownStandard(e, child);
                break;
            default:
                this.keyDownStandard(e, child);
                break;
        }
        this.keyDownCommon(e, child);
    }
    keyDownCommon(e, child){
        if (e.keyCode === 8){ // === 'Backspace'){
            if (e.shiftKey){
                e.preventDefault();
                this.setFocus(PredOf(child, this.t));
                DeleteItem(child, this.t);
            } else {
                if (child.value.title === '' && child.childs.length === 0){
                    e.preventDefault();
                    this.setFocus(PredOf(child, this.t));
                    DeleteItem(child, this.t);
                }
            }
        }

        if (e.keyCode === 9){ // === 'Tab'){
            e.preventDefault();
            if (e.shiftKey){
                OutdentItem(child, this.t);
            } else {
                IndentItem(child, this.t);
            }
        }
        if (e.keyCode === 39){ // 'ArrowRight'){
            if (e.shiftKey){
                e.preventDefault();
                IndentItem(child, this.t);
            }
        }
        if (e.keyCode === 37){ // 'ArrowLeft'){
            if (e.shiftKey){
                e.preventDefault();
                OutdentItem(child, this.t);
            }
        }
        if (e.keyCode === 38){  //'ArrowUp'){
            e.preventDefault();
            if (e.shiftKey){
                MoveItemUp(child, this.t);
            } else {
                this.setFocus(PredOf(child, this.t));
            }
        }
        if (e.keyCode === 40){ //'ArrowDown'){
            e.preventDefault();
            if (e.shiftKey){
                if (!MoveItemDown(child, this.t)){
                    IndentItem(child, this.t);
                }
            } else {
                if (this.state.headSerial === child._serial){
                    this.setFocus(child.childs[0]);
                } else {
                    this.setFocus(SuccOf(child, this.t));
                }
            }
        }
    }
    keyDownVimDefault(e, child){
        if (e.metaKey){
            return;
        }
        e.preventDefault();
        if (e.keyCode === 72){ // h
            if (e.shiftKey){
                OutdentItem(child, this.t);
            }
        }
        if (e.keyCode === 74){ // j
            if (e.shiftKey){
                if (!MoveItemDown(child, this.t)){
                    IndentItem(child, this.t);
                }
            } else {
                if (this.state.headSerial === child._serial){
                    this.setFocus(child.childs[0]);
                } else {
                    this.setFocus(SuccOf(child, this.t));
                }
            }
        }
        if (e.keyCode === 75){ // k
            if (e.shiftKey){
                MoveItemUp(child, this.t);
            } else {
                this.setFocus(PredOf(child, this.t));
            }
        }
        if (e.keyCode === 76){ // l
            if (e.shiftKey){
                IndentItem(child, this.t);
            } else {
            }
        }
        if (e.keyCode === 79){ // o
            if (e.shiftKey){
                this.setFocus(NewItemAbove(child, this.t));
                this.setState({MODE: 'vim-input'});
            } else {
                this.setFocus(NewItemBelow(child, this.t));
                this.setState({MODE: 'vim-input'});
            }
        }
        if (e.keyCode === 85){ // u
            Undo(this.t);
        }
        if (e.keyCode === 87){ // w
            if (e.shiftKey){
                copyTextToClipboard(JSON.stringify(this.t.current));
            }
        }
        if (e.keyCode === 69){ // e
            if (e.shiftKey){
                this.setContent(child, child.value.title);
            }
        }
        if (e.keyCode === 70){ // f
            if (e.shiftKey){
                this.setLink(child, child.value.title);
            }
        }
        if (e.keyCode === 82){ // r
            Redo(this.t);
        }
        if (e.keyCode === 73){ // i
            this.setState({MODE: 'vim-input'});
        }
        if (e.keyCode === 65){ // a
        }
        if (e.keyCode === 67){ // c
            this.setTitle(child, "");
            this.setState({MODE: 'vim-input'});
        }
        if (e.keyCode === 68){ // d
            const head = GetTrunk(this.state.headSerial, this.t);
            if (head === child){
                return;
            }
            if (e.shiftKey){
                this.setFocus(PredOf(child, this.t));
                DeleteItem(child, this.t);
            }
        }
        if (e.keyCode === 32){ // space
            e.preventDefault();
            this.setCollapsed(child, !child.collapsed);
        }
        if (e.keyCode === 190){ // >
            e.preventDefault();
            this.setHead(child);
            this.setFocus(child.childs[0]);
        }
        if (e.keyCode === 188){ // <
            e.preventDefault();
            var head = GetTrunk(this.state.headSerial, this.t);
            if (head === this.state.trunk){
                return;
            }
            this.setHead(ParentOf(head, this.t));
            this.setFocus(head);
        }
        if (e.keyCode === 13){ // === 'Enter'){
            e.preventDefault();
            this.setHead(child);
            this.setFocus(child.childs[0]);
        }
        if (e.keyCode === 27){ //'Escape'){
            e.preventDefault();
            var head = GetTrunk(this.state.headSerial, this.t);
            if (head === this.state.trunk){
                return;
            }
            this.setHead(ParentOf(head, this.t));
            this.setFocus(head);
        }
    }
    keyDownVimInput(e, child){
        if (e.keyCode === 27){ //'Escape'){
            e.preventDefault();
            this.setState({MODE: 'vim-default'});
        }

        if (e.keyCode === 13){ // === 'Enter'){
            if (e.shiftKey){
                return;
            }
            e.preventDefault();
            if (child.value.title === ''){
                var head = GetTrunk(this.state.headSerial, this.t);
                if (head === ParentOf(child, this.t)){
                    this.setFocus(NewItemBelow(child, this.t));
                } else {
                    if (!this.t.outdentItem(child)){
                        this.setFocus(NewItemBelow(child, this.t));
                    }
                }
            } else {
                this.setFocus(NewItemBelow(child, this.t));
            }
        }
    }
    keyDownStandard(e, child){
        if (e.keyCode === 32){ // Spacebar
            if (e.shiftKey){
                e.preventDefault();
                this.setCollapsed(child, !child.collapsed);
            }

        }
        if (e.key === 27){ //'Escape'){
            e.preventDefault();
            if (e.shiftKey){
                if (child.childs.length > 0){
                    this.setHead(child);
                    this.setFocus(child.childs[0]);
                }
            } else {
                var head = (this.state.headSerial, this.t);
                if (head === this.state.trunk){
                    return;
                }
                this.setHead(ParentOf(head, this.t));
                this.setFocus(ParentOf(head, this.t));
            }
        }
    }

    // Focus Relevant (internal state)
    setHead(child){
        if (child.childs.length === 0 && child.value.link !== null && child.value.link !== undefined){
            window.location = child.value.link;
        }
        if (child.childs.length === 0 && child.value.content === null){
            return;
        }

        this.setState({
            headSerial: child._serial,
            focusSerial: child._serial
        });
    }
    setFocus(child){
        if (child === undefined){
            return;
        }
        if (child._serial !== this.state.headSerial){
            if (AncestorsOf(child, this.t).indexOf(GetTrunk(this.state.headSerial, this.t)) < 0) {
                return;
            }
        }
        this.setState({
            focusSerial: child._serial
        });
    }
    onBlur(e){
        this.setState({focusSerial: null});
        this.props.onBlur(e);
    }
    // Render
    render(){
        var head = GetTrunk(this.state.headSerial, this.t);
        var focus = GetTrunk(this.state.focusSerial, this.t);
        var items = head.childs.map(function(child, i){
            return <Item trunk={child}
                         key={child._serial}
                         focus={focus}
                         focusAncestors={AncestorsOf(focus, this.t)}
                         setHead={this.setHead}
                         setFocus={this.setFocus}
                         keyDownHandler={this.keyDownHandler}
                         setCollapsed={this.setCollapsed}
                         entryEnabled={this.state.MODE !== 'vim-default'}
                         hasFocus={focus === child}
                         setTitle={this.setTitle}/>;
        }.bind(this));
        if (!items.length && head.value.content !== null){
            items = <ContentIFrame src={head.value.content} onEscape={function(){
                this.setHead(ParentOf(head,this.t));
                this.setFocus(head);
            }.bind(this)}/>;
        }
        return (
            <rb.Grid className="MAGNOLIAL" onBlur={this.onBlur} onFocus={this.onFocus} onKeyDown={function(e){
                this.keyDownHandler(e, focus);
            }.bind(this)}>
                <rb.Row>
                    <rb.Col xs={12} lg={12}>
                        <Breadcrumbs setHead={this.setHead} setFocus={this.setFocus}
                                     ancestors={AncestorsOf(head, this.t)}/>
                        <div className="title">
                            <Title trunk={head}
                                   setTitle={this.setTitle}
                                   setFocus={this.setFocus}
                                   setHead={this.setHead}
                                   entryEnabled={this.state.MODE !== 'vim-default'}
                                   hasFocus={focus === head}/>
                        </div>
                    </rb.Col>
                </rb.Row>
                <rb.Row>
                    <rb.Col xs={12} lg={12}>
                        {items}
                    </rb.Col>
                </rb.Row>
            </rb.Grid>
        );
    }
}

export default Magnolial;

