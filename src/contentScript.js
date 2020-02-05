import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import tinder from "./lib/Tinder.js";
// import "./contentScript.css";
import App from "./App";

console.log("Restart contentScript.js");

const rootId = "rootReactChromeExtension";
function render() {
  let div = document.getElementById(rootId);
  if (!div) {
    div = document.createElement("div");
    div.id = rootId;
    document.body.appendChild(div);
  }
  ReactDOM.render(<App />, div);
}
render();

const whenToken = new Promise(resolve => {
  chrome.extension.onMessage.addListener(function(request) {
    // console.log(request);
    if (request.payload) {
      resolve(request.payload);
      return true;
    }
  });
});

// const whenMatches = whenToken.then(token => {
//   tinder.setToken(token);
//   render();
// });

// FOR HMR TO WORK CORRECTLY https://parceljs.org/hmr.html
// if (module.hot) {
//   module.hot.accept();
// }

////////
/*
If you inject style using "content_scripts " in manifest.json
css is not updated, so we import with "web_accessible_resources"
and inject style in html. When file is refreshed, chrome automatically refreshes the tag.
*/
let stylesId = rootId + "Styles";
function injectStyles(url) {
  let stylesElement = document.getElementById(stylesId);

  if (!stylesElement) {
    stylesElement = document.createElement("link");
    stylesElement.id = stylesId;
    stylesElement.rel = "stylesheet";
    document.body.appendChild(stylesElement);
  }

  const date = (url.includes("?") ? "&" : "?") + "refresh=" + Date.now();
  stylesElement.setAttribute("href", url + date);
}
injectStyles(chrome.extension.getURL("dist/contentScript.css"));

if (module.hot) {
  module.hot.dispose(function() {
    // module is about to be replaced
    console.log("dispose");
  });

  module.hot.accept(function() {
    // module or one of its dependencies was just updated
    console.log("accept");
  });
}
