import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
// import tinder from "./Tinder.js";
// import "./contentScript.css";
import App from "./App";

console.log("Restart contentScript.js");

const whenToken = new Promise(resolve => {
  chrome.extension.onMessage.addListener(function(request) {
    // console.log(request);
    if (request.payload) {
      resolve(request.payload);
      return true;
    }
  });
});

// Create root
const rootId = "rootReactChromeExtension";
let div = document.getElementById(rootId);
if (!div) {
  div = document.createElement("div");
  div.id = rootId;
  document.body.appendChild(div);
}
ReactDOM.render(<App />, div);

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

/*
function reloadCss() {
  return [].forEach.call(
    document.querySelectorAll("link[rel=stylesheet]"),
    function(link) {
      link.href +=
        (link.href.indexOf("?") > -1 ? "&refresh" : "?refresh") +
        "=" +
        Date.now();
    }
  );
}

if (module.hot) {
  module.hot.accept(reloadCss);
}
*/

/*
const whenMatches = whenToken.then(token => {
  tinder.setToken(token);
  return tinder.getAllMatches();
});

// Create form
const div = document.createElement("div");
div.id = "sendMessageToAll";
const defaultButtonText = "Send to all matches";
div.innerHTML = `
<textarea placeholder="Type your message here." ></textarea>
<button>${defaultButtonText}</button>
<p>*name* will be replaced by the name of the match. Example: Hello *name*!</p>
`;
document.body.appendChild(div);

// Stop shortcut
div.addEventListener("keydown", e => {
  e.stopPropagation();
});

const textarea = div.querySelector("textarea");
const button = div.querySelector("button");

button.addEventListener("click", e => {
  button.disabled = true;
  const message = textarea.value;
  button.innerText = "Fetching your matches...";
  return whenMatches
    .then(matches => {
      button.innerText = "Sending messages...";
      return tinder.sendMessage(message, matches);
    })
    .then(() => {
      button.disabled = false;
      button.innerText = "Messages sent!";
      setTimeout(() => {
        button.innerText = defaultButtonText;
      }, 2000);
    });
});
*/
