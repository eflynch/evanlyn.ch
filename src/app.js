import React from 'react';
import FontAwesome from "react-fontawesome";

import Sound from './sound';
import Resume from './resume';
import Things from './things';

class View extends React.Component {
    render () {
        if (this.props.view === this.props.tag){
            return (
                <div>
                    <h1>> <a href="">evanlyn.ch</a> > {this.props.name}</h1>
                    <div>{this.props.children}</div>
                </div>
            );
        } else {
            return <div/>;
        }
    }
}

class App extends React.Component {
    render () {
        if (this.props.view === ""){
            return (
                <div>
                    <h1>> <a href="">evanlyn.ch</a></h1>
                    <div style={{marginLeft: 50}}>
                        <h2>> res</h2>
                        <h2>> <a href="#things">things</a></h2>
                        <h2>> <a href="#sounds">sounds</a></h2>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <View view={this.props.view} name="sounds" tag="#sounds"><Sound/></View>
                <View view={this.props.view} name="things" tag="#things"><Things/></View>
                <View view={this.props.view} name="res" tag="#res"><Resume/></View>
            </div>
        );
    }
}

module.exports = App;

