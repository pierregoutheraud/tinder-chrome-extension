import React, { useEffect } from "react";
import styles from "./App.css";

// console.log("ok");
// console.log("ok", styles);

export default function App() {
  console.log("render App...");
  // console.log("wuut. ?");

  // useEffect(() => {
  //   console.log("what !?");
  // }, []);

  return (
    <div className={styles.container}>
      <p className={styles.text}>COCO</p>
      <p className={styles.text34}>COCO</p>
      <p className={styles.text345}>COCO</p>
      <p className={styles.text345}>whaeeeet mmmm ? WHAT ? THE FUCKeee</p>
    </div>
  );
}
