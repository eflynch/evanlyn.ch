import React from 'react';
import ReactDOM from 'react-dom';
import Item from './item';
import Breadcrumbs from './breadcrumbs';
import ImmutableTree from './immutable-tree';
import Title from './title';

var rb = require('react-bootstrap');

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
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
    componentDidMount() {
        this.props.setFocusCapture(false);
    }
    onLoad (e) {
        var iframe = ReactDOM.findDOMNode(this.refs.iframe);
        iframe.focus();
        iframe.contentWindow.document.body.onkeydown = function (e){
            if (e.key === "Escape"){
                this.props.onEscape();
            }
        }.bind(this);
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
            focusCapture: true,
            MODE: 'vim-default'
        };
        this.initTrunk = this.initTrunk.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setContent = this.setContent.bind(this);
        this.setLink = this.setLink.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.setFocusCapture = this.setFocusCapture.bind(this);
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
                if (this.t.node_hash[this.props.initHead] !== undefined){
                    this.setState({headSerial: this.props.initHead});
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('initHead')){
            this.setState({headSerial: nextProps.initHead});
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextState.focusSerial === null && this.state.focusCapture){
            if (nextState.headSerial !== this.state.headSerial){
                this.setFocus(this.t.node_hash[nextState.headSerial]);
            } else {
                this.setFocus(this.t.node_hash[this.state.focusSerial]);
            }
        }
    }
    initTrunk(initTrunk){
        this.t = new ImmutableTree(initTrunk, function (trunk){
            this.props.onUpdate(trunk, this.state.headSerial, this.state.focusSerial);
            this.setState({trunk: trunk});
        }.bind(this), {title: "", content: null, link: null});
        this.setState({
            trunk: this.t.getTrunk(),
            headSerial: this.t.getTrunk()._serial,
            focusSerial: this.t.getTrunk()._serial
        });
    }
    // Mutators
    setTitle(child, title){
        return this.t.setValue(child, {
            title: title,
            content: child.value.content,
            link: child.value.link
        });
    }
    setContent(child, content){
        return this.t.setValue(child, {
            title: child.value.title,
            content: content,
            link: child.value.link
        });
    }
    setLink(child, link){
        return this.t.setValue(child, {
            title: child.value.title,
            content: child.value.content,
            link: link
        });
    }
    setCollapsed(child, state){
        return this.t.setCollapsed(child, state);
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
                this.setFocus(this.t.predOf(child));
                this.t.deleteItem(child);
            } else {
                if (child.value.title === '' && child.childs.length === 0){
                    e.preventDefault();
                    this.setFocus(this.t.predOf(child));
                    this.t.deleteItem(child);
                }
            }
        }
        
        if (e.keyCode === 9){ // === 'Tab'){
            e.preventDefault();
            if (e.shiftKey){
                this.t.outdentItem(child);
            } else {
                this.t.indentItem(child);
            }
        }
        if (e.keyCode === 39){ // 'ArrowRight'){
            if (e.shiftKey){
                e.preventDefault();
                this.t.indentItem(child); 
            }
        }
        if (e.keyCode === 37){ // 'ArrowLeft'){
            if (e.shiftKey){
                e.preventDefault();
                this.t.outdentItem(child); 
            }
        }
        if (e.keyCode === 38){  //'ArrowUp'){
            e.preventDefault();
            if (e.shiftKey){
                this.t.moveItemUp(child);
            } else {
                this.setFocus(this.t.predOf(child));
            }
        }
        if (e.keyCode === 40){ //'ArrowDown'){
            e.preventDefault();
            if (e.shiftKey){
                if (!this.t.moveItemDown(child)){
                    this.t.indentItem(child);
                }
            } else {
                if (this.state.headSerial === child._serial){
                    this.setFocus(child.childs[0]);
                } else {
                    this.setFocus(this.t.succOf(child));
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
                this.t.outdentItem(child); 
            }
        }
        if (e.keyCode === 74){ // j
            if (e.shiftKey){
                if (!this.t.moveItemDown(child)){
                    this.t.indentItem(child);
                }
            } else {
                if (this.state.headSerial === child._serial){
                    this.setFocus(child.childs[0]);
                } else {
                    this.setFocus(this.t.succOf(child));
                }
            }
        }
        if (e.keyCode === 75){ // k
            if (e.shiftKey){
                this.t.moveItemUp(child);
            } else {
                this.setFocus(this.t.predOf(child));
            }
        }
        if (e.keyCode === 76){ // l
            if (e.shiftKey){
                this.t.indentItem(child); 
            } else {
            }
        }
        if (e.keyCode === 79){ // o
            if (e.shiftKey){
                this.setFocus(this.t.newItemAbove(child));
                this.setState({MODE: 'vim-input'});
            } else {
                this.setFocus(this.t.newItemBelow(child));
                this.setState({MODE: 'vim-input'});
            }
        }
        if (e.keyCode === 85){ // u
            this.t.undo();
        }
        if (e.keyCode === 87){ // w
            if (e.shiftKey){
                copyTextToClipboard(JSON.stringify(this.t.getTrunk()));
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
            this.t.redo();
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
            var head = this.t.node_hash[this.state.headSerial];
            if (head === child){
                return;
            }
            if (e.shiftKey){
                this.setFocus(this.t.predOf(child));
                this.t.deleteItem(child);
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
            var head = this.t.node_hash[this.state.headSerial];
            if (head === this.state.trunk){
                return;
            }
            this.setHead(this.t.parentOf(head));
            this.setFocus(head);
        }
        if (e.keyCode === 13){ // === 'Enter'){
            e.preventDefault();
            this.setHead(child);
            this.setFocus(child.childs[0]);
        }
        if (e.keyCode === 27){ //'Escape'){
            e.preventDefault();
            var head = this.t.node_hash[this.state.headSerial];
            if (head === this.state.trunk){
                return;
            }
            this.setHead(this.t.parentOf(head));
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
                if (!this.t.outdentItem(child)){
                    this.setFocus(this.t.newItemBelow(child));
                }
            } else {
                this.setFocus(this.t.newItemBelow(child));
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
                var head = this.t.node_hash[this.state.headSerial];
                if (head === this.state.trunk){
                    return;
                }
                this.setHead(this.t.parentOf(head));
                this.setFocus(this.t.parentOf(head));
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

        this.props.onUpdate(this.state.trunk, child._serial, this.state.focusSerial);
        // this.t.setCollapsed(child, false);
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
            if (this.t.ancestorsOf(child).indexOf(this.t.node_hash[this.state.headSerial]) < 0){
                return;
            }
        }
        this.setState({
            focusSerial: child._serial
        });
    }
    setFocusCapture(toggle){
        this.setState({focusCapture: toggle});
    }
    onBlur(e){
        this.setState({focusSerial: null});
        this.props.onBlur(e);
    }
    // Render
    render(){
        var head = this.t.node_hash[this.state.headSerial];
        var focus = this.t.node_hash[this.state.focusSerial];
        var items = head.childs.map(function(child, i){
            return <Item trunk={child}
                         key={child._serial}
                         focus={focus}
                         focusAncestors={this.t.ancestorsOf(focus)}
                         setHead={this.setHead}
                         setFocus={this.setFocus}
                         keyDownHandler={this.keyDownHandler}
                         setCollapsed={this.setCollapsed}
                         entryEnabled={this.state.MODE !== 'vim-default'}
                         hasFocus={focus === child}
                         setTitle={this.setTitle}/>;
        }.bind(this));
        if (!items.length && head.value.content !== null){
            items = <ContentIFrame src={head.value.content} setFocusCapture={this.setFocusCapture} onEscape={function(){
                this.setFocusCapture(true);
                this.setHead(this.t.parentOf(head));
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
                                     ancestors={this.t.ancestorsOf(head)}/>
                        <h1>
                            <Title trunk={head}
                                   setTitle={this.setTitle}
                                   setFocus={this.setFocus}
                                   setHead={this.setHead}
                                   entryEnabled={this.state.MODE !== 'vim-default'}
                                   hasFocus={focus === head}/>
                        </h1>
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

module.exports = Magnolial;
