import React from 'react';
import {render} from 'react-dom';

import Magnolial from './magnolial';
import ImmutableTree from './immutable-tree';

var getJSON = function(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            if (status == 200) {
                data = JSON.parse(xhr.responseText);
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};


document.addEventListener("DOMContentLoaded", function (){
    getJSON("trunk.mgl", function(trunk){
        var content = document.getElementById("content");

        render(<Magnolial initTrunk={trunk} onUpdate={function(trunk, head, focus){
        }} onBlur={function(e){}}j/>, content);
    });
});
