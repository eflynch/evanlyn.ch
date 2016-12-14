import React from 'react';
import ReactDOM from 'react-dom';
import ContentEditable from './content-editable';

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

class Title extends React.Component {
    constructor (props){
        super(props);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        if (this.props.hasFocus){
            var inputNode = ReactDOM.findDOMNode(this.refs.input);
            if (document.activeElement !== inputNode){
                inputNode.focus();
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.hasFocus){
            var inputNode = ReactDOM.findDOMNode(this.refs.input);
            if (document.activeElement !== inputNode){
                inputNode.focus();
            }
        }
    }

    onBlur (e){
        if (e.relatedTarget === null){
            this.props.setFocus(null);
        }
    }

    onFocus (e){
        placeCaretAtEnd(ReactDOM.findDOMNode(this.refs.input));
    }

    onClick (e){
        if (!e.metaKey){
            this.props.setHead();
            this.props.setFocus(this.props.trunk);
            e.preventDefault();
        }
    }

    setValue (e){
        if (e.target.value !== this.props.trunk.value.title){
            this.props.setTitle(this.props.trunk, e.target.value);
        }
    }

    render (){
        var className = 'MAGNOLIAL_ce';
        if (!this.props.entryEnabled){
            className += ' MAGNOLIAL_readonly';
        }
        if (this.props.hasFocus){
            className += ' MAGNOLIAL_focused';
        }
        return (
            <div className="MAGNOLIAL_ce_wrapper" onClick={this.onClick.bind(this)}>
                <ContentEditable className={className + " MAGNOLIAL_ce_bottom"}
                                 ref="bottom"
                                 html={this.props.trunk.value.title}
                                 disabled={true}/>
                <ContentEditable ref='input' className={className + " MAGNOLIAL_ce_top"}
                                 html={this.props.trunk.value.title}
                                 onKeyDown={this.props.onKeyDown}
                                 onBlur={this.onBlur}
                                 onFocus={this.onFocus}
                                 onChange={this.setValue}/>
            </div>
        );
    }
}

module.exports = Title;
