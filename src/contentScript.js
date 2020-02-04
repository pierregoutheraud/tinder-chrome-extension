import "babel-polyfill";
import tinder from "./Tinder.js";
import "./contentScript.css";

const whenToken = new Promise(resolve => {
  chrome.extension.onMessage.addListener(function(request) {
    console.log(request);
    if (request.payload) {
      resolve(request.payload);
      return true;
    }
  });
});

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
