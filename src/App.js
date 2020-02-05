import React, { useEffect } from "react";
import styles from "./App.css";
import SendMessagesToAll from "./components/SendMessagesToAll/SendMessagesToAll";

export default function App() {
  return (
    <div className={styles.container}>
      <SendMessagesToAll />
      {/* <p>cacaprout WHAT ? DA FUYCJK</p> */}
    </div>
  );
}
