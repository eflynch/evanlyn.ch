import React from 'react';
import FontAwesome from "react-fontawesome";

import Grid from './grid';
import Box from "./box";

class App extends React.Component {
    render () {
        return (
            <div>
                <h1 style={{height:"5%", minHeight: 30}}>evanlyn.ch</h1>
                <div style={{height:"95%", width: "100%", position: "relative"}}>
                    <Grid selectedBox={this.props.selectedBox} fast={this.props.fast} vs={this.props.vs} hs={this.props.hs} onSelect={this.props.onSelect}>
                        <Box>
                            <div style={{
                                margin:"auto",
                                width: 20,
                                color: "white",
                                fontSize: 40
                            }}>
                                <FontAwesome name="th" style={{display:"inline-block", lineHeight:"100%", height:"100%", verticalAlign:"middle"}}/> 
                            </div>
                        </Box>
                        <Box>
                        </Box>
                        <Box>
                            <iframe src="http://evanlyn.ch/static/conway/phase2/phase2.html" style={{width: "100%", height: "100%"}}/>
                        </Box>
                        <Box>
                        </Box>
                        <Box>
                        </Box>
                        <Box>
                        </Box>
                    </Grid>
                </div>
            </div>
        );
    }
}
App.defaultProps = {numBoxes: 4};

module.exports = App;
