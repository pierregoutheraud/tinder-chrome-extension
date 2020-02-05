import React from "react";
import styles from "./SendMessagesToAll.css";

export default function SendMessagesToAll() {
  function handleClick() {
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
  }

  console.log("render");

  return (
    <div className={styles.container}>
      <h2>Send a message to all your matches</h2>
      <textarea placeholder="Type your message here."></textarea>
      <button onClick={handleClick}>Send</button>
      <p>
        *name* will be replaced by the name of the match. Example: Hello *name*!
      </p>
    </div>
  );
}

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
