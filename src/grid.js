import React from 'react';
import FontAwesome from "react-fontawesome";

import {HLine, VLine} from "./line";

class GridButton extends React.Component {
    render () {
        return (
            <div onClick={this.props.onClick} style={{
                display: this.props.show ? "block": "none",
                position: "absolute",
                right: 20,
                bottom: 20,
                color: "white",
                backgroundColor: "rgba(256,256,256,0.6)",
                borderRadius: 15,
                width: 30,
                height: 30,
                textAlign: "center"
            }}>
                <span style={{
                    display:"table-cell",
                    height: 30,
                    width: 30,
                    lineHeight: "normal",
                    verticalAlign: "middle"
                }}>
                    <FontAwesome name="th"/>
                </span>
            </div>
        );
    }
}

class Grid extends React.Component {
    constructor () {
        super();
        this.state = {
            active: null
        };
    }

    renderChildren () {
        var vs = this.props.vs;
        var hs = this.props.hs;
        var onSelect = this.props.onSelect;
        return React.Children.map(this.props.children,(box, i)=>{
            var gridX = i % (vs.length - 1);
            var gridY = (i - gridX) / (vs.length - 1);
            return React.cloneElement(box, {
                v1: vs[gridX],
                v2: vs[gridX + 1],
                h1: hs[gridY], 
                h2: hs[gridY + 1],
                fast: this.props.fast,
                selected: this.props.selectedBox !== null && gridX === this.props.selectedBox[0] && gridY === this.props.selectedBox[1],
                onClick: (e) => {onSelect([gridX, gridY]);}
            });
        });
    }

    render () {
        return (
            <div>
                <GridButton onClick={(e)=>{this.props.onSelect(null);}} show={this.props.selectedBox !== null}/>
                {this.props.vs.map((coord, i) => <VLine fast={this.props.fast} key={i} a={coord[0]} b={coord[1]}/>)}
                {this.props.vs.map((coord, i) => <VLine fast={this.props.fast} key={i} a={coord[0]} b={coord[1]}/>)}
                {this.props.hs.map((coord, i) => <HLine fast={this.props.fast} key={i} a={coord[0]} b={coord[1]}/>)}
                {this.props.hs.map((coord, i) => <HLine fast={this.props.fast} key={i} a={coord[0]} b={coord[1]}/>)}
                {this.renderChildren()}
            </div>
        );
    }
}

module.exports = Grid;
