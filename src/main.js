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

var respond_to_hashchange = true;
var onhashchange = function(e){
    if (respond_to_hashchange){
        var headSerial = window.location.hash.substring(1);
        reloadMagnolial(headSerial);
    }
    respond_to_hashchange = true;
}

var initMagnolial = function(trunk){
    var content = document.getElementById("content");

    if (window.location.hash !== ""){
        var initHead = window.location.hash.substring(1);
    } else {
        var initHead = undefined;
    }
    render(<Magnolial initTrunk={trunk} initHead={initHead} onUpdate={function(trunk, head, focus){
        respond_to_hashchange = false;
        window.location.hash = head;
    }} onBlur={function(e){}}/>, content);
}

var reloadMagnolial = function (headSerial){
    var content = document.getElementById("content");
    render(<Magnolial initHead={headSerial} onUpdate={function(trunk, head, focus){
        respond_to_hashchange = false;
        window.location.hash = head;
    }} onBlur={function(e){}}/>, content);
}

document.addEventListener("DOMContentLoaded", function (){
    window.onhashchange = onhashchange;
    getJSON("trunk.mgl", function(trunk){
        initMagnolial(trunk);
    });
});
