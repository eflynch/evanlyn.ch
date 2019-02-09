import React from 'react';
import {render} from 'react-dom';

import Magnolial from './magnolial';
import ImmutableTree from './immutable-tree';
import Whose from './whose';

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

var initMagnolial = function(trunk, saveMethod){
    const content = document.getElementById("content");

    const renderMagnolial = () => {
        if (window.location.hash !== ""){
            var initHead = window.location.hash.substring(1);
        } else {
            var initHead = undefined;
        }
        render(<Magnolial initTrunk={trunk} initHead={initHead} onUpdate={function(trunk, head, focus){
            respond_to_hashchange = false;
            window.location.hash = head;
            saveMethod(trunk);
        }} onBlur={function(e){}}/>, content);
    }

    renderMagnolial();
    window.onhashchange = (e) => {
        if (respond_to_hashchange){
            renderMagnolial();
        }
        respond_to_hashchange = true;
    };
    respond_to_hashchange = true;
    saveMethod(trunk);
}

var loadPage = () => {
    const whose = window.localStorage.getItem('whose');

    const saveMethod = (trunk) => {
        window.localStorage.setItem('trunk', JSON.stringify(trunk));
    };
    if (whose === "mine") {
        getJSON("trunk.mgl", function(trunk){
            initMagnolial(trunk, (trunk)=>{});
        });
    } else if (whose === "yours") {
        var trunk = JSON.parse(window.localStorage.getItem('trunk'));
        if (trunk !== undefined && trunk !== null){
            initMagnolial(trunk, saveMethod);
        } else {
            getJSON("trunk.mgl", function(trunk){
                initMagnolial(trunk, saveMethod);
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", function (){
    var whoseItNow = window.localStorage.getItem('whose');
    if (whoseItNow === "mine" && whoseItNow === "yours"){
        window.localStorage.setItem('whose', 'mine');
    }

    let whoseTag = document.getElementById("whose");
    const renderWhose = (whoseItNow) => {
        render(<Whose changeWhose={(whose)=>{
            window.localStorage.setItem('whose', whose);
            loadPage();
            renderWhose(whose);
        }} whose={whoseItNow}/>, whoseTag);
    };

    let divTag = document.getElementById("reset");
    divTag.onclick = (e) => {
        window.localStorage.setItem("whose", "mine");
        window.localStorage.removeItem("trunk");
        renderWhose("mine");
        loadPage();
    };

    renderWhose(whoseItNow);
    loadPage();
});
