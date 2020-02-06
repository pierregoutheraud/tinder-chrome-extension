import React, { useState, useEffect, useRef } from "react";
import styles from "./SendMessagesToAll.css";
import tinder from "../../lib/Tinder";

const BUTTON_TEXTS = {
  DEFAULT: "Send",
  FETCHING: "Fetching your matches...",
  SENDING: "Sending messages...",
  SENT: "Messages sent.",
};

export default function SendMessagesToAll() {
  const [buttonText, setButtonText] = useState(BUTTON_TEXTS.DEFAULT);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const promiseMatches = useRef(null);
  const [onlyToNew, setOnlyToNew] = useState(false);

  useEffect(() => {
    promiseMatches.current = tinder.fetchAllMatches();
    promiseMatches.current.then(matches => {
      console.log(matches);
    });
  }, []);

  async function handleClick() {
    if (!message.length) {
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to send this message to ${
          onlyToNew ? "your new" : "all your"
        } matches ?`
      )
    ) {
      return;
    }

    setDisabled(true);
    setButtonText(BUTTON_TEXTS.FETCHING);

    const matches = await promiseMatches.current;
    console.log(matches);

    setButtonText(BUTTON_TEXTS.SENDING);
    await tinder.sendMessages(message, matches, onlyToNew, (current, total) => {
      console.log(current, total);
      setButtonText(`${BUTTON_TEXTS.SENDING} (${current}/${total})`);
    });

    setDisabled(false);
    setButtonText(BUTTON_TEXTS.SENT);
    setTimeout(() => {
      setButtonText(BUTTON_TEXTS.DEFAULT);
    }, 2000);
  }

  return (
    <div className={styles.container}>
      <h2>Send a message to all your matches</h2>
      <textarea
        placeholder={`Type your message here.
The expression *name* will be replaced by the name of the match.
Example: "Hello *name*!" will output "Hello Nancy!"`}
        value={message}
        onChange={e => {
          setMessage(e.target.value);
          e.stopPropagation();
        }}
      />
      <button onClick={() => handleClick()} disabled={disabled}>
        {buttonText}
      </button>
      {/* <p>
        *name* will be replaced by the name of the match. Example: Hello *name*!
      </p> */}
      <div className={styles.checkboxField}>
        <input
          type="checkbox"
          id="onlyToNew"
          name="onlyToNew"
          checked={onlyToNew}
          onChange={() => setOnlyToNew(!onlyToNew)}
        />
        <label htmlFor="onlyToNew">Only send to new matches</label>
      </div>
    </div>
  );
}
