import React from 'react';
import classNames from "classnames";

class Box extends React.Component {
    constructor () {
        super();
    }

    intersect (v, h) {
        var deltaV = v[1] - v[0];
        var deltaH = h[1] - h[0];
        var x = (100*h[0]*deltaV + v[0] * 10000) / (10000 - deltaH*deltaV);
        var y = deltaH * x / 100 + h[0];
        return [x, y];
    }

    render () {

        // Coords
        var tl = this.intersect(this.props.v1, this.props.h1);
        var tr = this.intersect(this.props.v2, this.props.h1);
        var br = this.intersect(this.props.v2, this.props.h2);
        var bl = this.intersect(this.props.v1, this.props.h2);

        // Bounding Box
        var width = Math.max(tr[0], br[0]) - Math.min(tl[0],bl[0]);
        var height = Math.max(br[1], bl[1]) - Math.min(tl[1],tr[1]);
        var left = Math.min(tl[0], bl[0]);
        var top = Math.min(tl[1], tr[1]);

        // Path
        var path = "polygon(" +
            (100 * (tl[0] - left) / width) + "% " + (100 * (tl[1] - top) / height) + "%, " +
            (100 * (tr[0] - left) / width) + "% " + (100 * (tr[1] - top) / height) + "%, " +
            (100 * (br[0] - left) / width) + "% " + (100 * (br[1] - top) / height) + "%, " +
            (100 * (bl[0] - left) / width) + "% " + (100 * (bl[1] - top) / height) + "%)";


        return (
            <div {...this.props} className={classNames({
                box: true,
                "fast-transitions": this.props.fast,
                "slow-transitions": !this.props.fast
            })} style={{
                    width:width + "%",
                    height:height + "%",
                    left: left+"%",
                    top: top+"%",
                    WebkitClipPath: path,
                }}>
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 3,
                    display: this.props.selected ? "none" : "block"}} onClick={this.props.onClick}/>
                {this.props.children}
            </div>
        );
    }
}


module.exports = Box;
