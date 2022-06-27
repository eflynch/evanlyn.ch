import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Magnolial from './components/Magnolial';
import Whose from './components/Whose';
import { Trunk } from './immutable-tree';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const whose = ReactDOM.createRoot(
  document.getElementById('whose') as HTMLElement
);

var getJSON = function(url:string, successHandler:(data:any)=>void, errorHandler:(data:any)=>void) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // `DONE`
            let status = xhr.status;
            if (status == 200) {
                let data = JSON.parse(xhr.responseText);
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};

var initMagnolial = function(trunk:Trunk, saveMethod:(trunk:Trunk)=>void){
    const content = document.getElementById("content");

    const renderMagnolial = () => {
        let initHead:string|undefined = undefined;
        if (window.location.hash !== ""){
            initHead = window.location.hash.substring(1);
        } 
        root.render(
          <React.StrictMode>
            <Magnolial initTrunk={trunk} initHead={initHead} onUpdate={({trunk, headSerial}) => {
              if (window.location.hash !== "#"+headSerial){
                  window.history.pushState(null, "", "#"+headSerial);
              }
              saveMethod(trunk);
            }} />
          </React.StrictMode>
        );
    }

    renderMagnolial();
    window.onpopstate = (e) => {
        renderMagnolial();
    };
    saveMethod(trunk);
}

var loadPage = () => {
    const whose = window.localStorage.getItem('whose');

    const saveMethod = (trunk:Trunk) => {
        window.localStorage.setItem('trunk', JSON.stringify(trunk));
    };
  
    if (whose === "mine") {
        getJSON("trunk.mgl", (trunk:Trunk) => {
            initMagnolial(trunk, (trunk)=>{});
        }, ()=>{});
    } else if (whose === "yours") {
        const trunk = JSON.parse(window.localStorage.getItem('trunk') || "{}");
        if (trunk){
            initMagnolial(trunk, saveMethod);
        } else {
            getJSON("trunk.mgl", (trunk:Trunk) => {
                initMagnolial(trunk, saveMethod);
            }, ()=>{});
        }
    }
};



  const renderWhose = (whoseItNow:string) => {
    const reset = () => {
        window.localStorage.setItem("whose", "mine");
        window.localStorage.removeItem("trunk");
        renderWhose("mine");
        loadPage();
    };
  
      whose.render(<Whose reset={reset} changeWhose={(whose)=>{
          window.localStorage.setItem('whose', whose);
          loadPage();
          renderWhose(whose);
      }} whose={whoseItNow}/>);
  };


  var whoseItNow = window.localStorage.getItem('whose');
  if (whoseItNow !== "mine" && whoseItNow !== "yours"){
      window.localStorage.setItem('whose', 'mine');
      whoseItNow = 'mine';
  }

  renderWhose(whoseItNow);
  loadPage();
