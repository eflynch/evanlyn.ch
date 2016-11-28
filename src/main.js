import React from 'react';
import {render} from 'react-dom';

import App from './app';

const numBoxes = 12;
const gridSize = Math.ceil(Math.sqrt(numBoxes)) + 1;

var selectedMass = 80;


var selectedBox = null;

var selectBox = function (box){
    selectedBox = box;
    renderApp();
}

var prevSelectedBox = null;
var timeouts = [];
var renderApp = function () {
    var vs = [];
    var hs = [];

    var a_v, b_v, a_h, b_h, gap_v, gap_h, acc_v, acc_h;

    acc_v = acc_h = 0;

    for (var i=0; i < gridSize; i++){
        if (selectedBox === null){
            gap_h = 100 / gridSize;
            gap_v = 100 / gridSize;
        } else {
            gap_h = (100 - selectedMass) / (gridSize - 1);
            gap_v = (100 - selectedMass) / (gridSize - 1);

            if (i === selectedBox[0]) {
                gap_v = selectedMass;
            }

            if (i === selectedBox[1]){
                gap_h = selectedMass;
            }
        }
        
        

        a_v = Math.random() * gap_v + acc_v;
        b_v = Math.random() * gap_v + acc_v;
        a_h = Math.random() * gap_h + acc_h;
        b_h = Math.random() * gap_h + acc_h;

        if (selectedBox !== null){
            if (i === selectedBox[0] || i === selectedBox[0] + 1){
                a_v = acc_v;
                b_v = acc_v + 5;
            }

            if (i === selectedBox[1] || i === selectedBox[1] + 1){
                a_h = acc_h;
                b_h = acc_h + 5;
            }
        }
        
        vs.push([a_v, b_v]);
        hs.push([a_h, b_h]);

        acc_v += gap_v;
        acc_h += gap_h;

    }

    if (prevSelectedBox !== selectedBox){
        render(<App fast={true} hs={hs} vs={vs} selectedBox={selectedBox} onSelect={selectBox}/>, document.getElementById("content"));
        timeouts.forEach((t)=>{clearTimeout(t);});
        timeouts.push(setTimeout(renderApp, 1000));
    } else {
        render(<App fast={false} hs={hs} vs={vs} selectedBox={selectedBox} onSelect={selectBox}/>, document.getElementById("content"));
        timeouts.forEach((t)=>{clearTimeout(t);});
        timeouts.push(setTimeout(renderApp, 10000));
    }
    prevSelectedBox = selectedBox;
}



document.addEventListener("DOMContentLoaded", function (){
    renderApp();
    setTimeout(renderApp, 0);
});
