import React from 'react';
import {render} from 'react-dom';

import App from './app';


document.addEventListener("DOMContentLoaded", function (){
    render(<App view=''/>, document.getElementById("content"));
});

window.onhashchange = function () {
    render(<App view={location.hash} />, document.getElementById("content"));
};

