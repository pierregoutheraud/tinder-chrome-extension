import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import styles from "./App.css";
import SendMessagesToAll from "./components/SendMessagesToAll/SendMessagesToAll";
import Settings from "./components/Settings/Settings";
import configureStore from "./store/configureStore";

const store = configureStore();

export default function App() {
  const [display, setDisplay] = useState(null);

  return (
    <Provider store={store}>
      <div className={styles.container}>
        <div className={styles.settings}>
          <h2>Tinder +</h2>
          <Settings
            displaySendMessages={() =>
              display === "SEND_MESSAGES"
                ? setDisplay(null)
                : setDisplay("SEND_MESSAGES")
            }
          />
        </div>
        {display === "SEND_MESSAGES" && (
          <SendMessagesToAll className={styles.sendMessages} />
        )}
      </div>
    </Provider>
  );
}
