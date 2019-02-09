import React from 'react';


class Whose extends React.PureComponent {
    render (){
        return (
            <div>
                <span onClick={()=>this.props.changeWhose("mine")} style={{
                    color: this.props.whose === "mine" ? "#807861" : "",
                    cursor: "pointer"
                }}>mine</span> | <span onClick={()=>this.props.changeWhose("yours")} style={{
                    color: this.props.whose === "yours" ? "#807861" : "",
                    cursor: "pointer"
                }}>yours</span>
            </div>
        );
    }
}

module.exports = Whose;
