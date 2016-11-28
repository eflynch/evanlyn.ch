import React from "react";
import classNames from "classnames";

class VLine extends React.Component {
    render () {
        var topWidth = Math.random() * 10;
        var bottomWidth = Math.random() * 10;
        var width = Math.abs(this.props.a - this.props.b);
        if (this.props.a > this.props.b){
            var style = {
                height: "100%",
                width: width + "%",
                WebkitClipPath: "polygon(" + (100 - topWidth) + "% 0, 100% 0, " + bottomWidth + "% 100%, 0 100%)",
                left: this.props.b + "%",
                top: 0,
            }
        } else {
            var style = {
                height: "100%",
                width: width + "%",
                WebkitClipPath: "polygon(0 0, " + topWidth + "% 0, 100% 100%, " + (100 - bottomWidth) + "% 100%)",
                left: this.props.a + "%",
                top: 0,
            }
        }
        
        return <div className={classNames({
            line: true,
            "fast-transitions": this.props.fast,
            "slow-transitions": !this.props.fast
        })} style={style}/>
    }
}

class HLine extends React.Component {
    render () {
        var topWidth = Math.random() * 20;
        var bottomWidth = Math.random() * 20;
        var width = Math.abs(this.props.a - this.props.b);
        if (this.props.a > this.props.b){
            var style = {
                width: "100%",
                height: width + "%",
                WebkitClipPath: "polygon(0 " + (100 - topWidth) + "%, 0 100%, 100% " + bottomWidth + "%, 100% 0)",
                top: this.props.b + "%",
                left: 0,
            }
        } else {
            var style = {
                width: "100%",
                height: width + "%",
                WebkitClipPath: "polygon(0 0, 0 " + topWidth + "%, 100% 100%, 100% " + (100 - bottomWidth) + "%)",
                top: this.props.a + "%",
                left: 0,
            }
        }

        return <div className={classNames({
            line: true,
            "fast-transitions": this.props.fast,
            "slow-transitions": !this.props.fast
        })} style={style}/>;
    }
}

module.exports = {
    VLine: VLine,
    HLine: HLine
};
