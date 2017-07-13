import React from 'react';

import FontAwesome from 'react-fontawesome';

class Decoration extends React.Component {
    onClick (e){
        if (e.metaKey){
            this.props.setHead();
        } else {
            this.props.toggleCollapsed();
        }
    }

    render (){
        var className = "MAGNOLIAL_decoration";
        if (this.props.collapseable){
            if (this.props.collapsed){
                var name = 'chevron-circle-right';
            } else {
                var name = 'chevron-down';
            }
        } else {
            var name = 'circle';
        }
        return (
            <FontAwesome name={name} className={className} onClick={this.onClick.bind(this)}/>
        );
    }
}

module.exports = Decoration;
