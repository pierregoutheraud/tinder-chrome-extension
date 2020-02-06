import React, { useEffect, useState, useRef } from "react";
import Switch from "react-switch";
import styles from "./Settings.css";

/*
const likeButton = document.getElementsByClassName(
  "button Lts($ls-s) Z(0) Cur(p) Tt(u) Bdrs(50%) P(0) Fw($semibold) recsGamepad__button D(b) Bgc(#fff) Wc($transform) End(15px) Scale(1.1):h"
);
setInterval(() => {
  likeButton[0].click();
  let keepSwiping = document.getElementsByClassName(
    "button Lts($ls-s) Z(0) Whs(nw) Cur(p) Tt(u) Bdrs(100px) Px(24px) Py(0) H(54px) Mih(54px) Lh(50px) button--outline Bdw(2px) Bds(s) Trsdu($fast) Bdc($c-gray) C($c-gray) Bdc($c-base):h C($c-base):h Fw($semibold) Bdc($c-pink) Bdc($c-orange):h C(#fff)!:h Bg(t):h W(100%) D(b) C(#fff) Bg(t) Mt(24px) Mt(12px)--xs Mt(10px)--lsh"
  );
  if (keepSwiping[0]) {
    keepSwiping[0].click();
  }
}, 50);
*/

export default function Settings({ displaySendMessages = () => {} }) {
  const [autoLike, setAutoLike] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    clearInterval(interval.current);
    if (autoLike) {
      const likeButton = document.querySelectorAll(".recsGamepad__button")[3];
      interval.current = setInterval(() => {
        likeButton.click();

        // in case we match
        const keepSwiping = document.getElementsByClassName(
          "button Lts($ls-s) Z(0) Whs(nw) Cur(p) Tt(u) Bdrs(100px) Px(24px) Py(0) H(54px) Mih(54px) Lh(50px) button--outline Bdw(2px) Bds(s) Trsdu($fast) Bdc($c-gray) C($c-gray) Bdc($c-base):h C($c-base):h Fw($semibold) Bdc($c-pink) Bdc($c-orange):h C(#fff)!:h Bg(t):h W(100%) D(b) C(#fff) Bg(t) Mt(24px) Mt(12px)--xs Mt(10px)--lsh"
        );
        if (keepSwiping[0]) {
          keepSwiping[0].click();
        }
      }, 50);
    }
  }, [autoLike]);

  function handleChange(value) {
    setAutoLike(value);
  }

  function handleClickMatches(e) {
    e.preventDefault();
    displaySendMessages();
  }

  return (
    <div className={styles.container}>
      <fieldset>
        <label>
          <span>Auto like</span>
          <Switch
            onChange={handleChange}
            checked={autoLike}
            uncheckedIcon={false}
            checkedIcon={false}
            height={18}
            width={32}
            handleDiameter={12}
            offColor="#e53a40"
            onColor="#12b36d"
          />
        </label>
      </fieldset>
      <fieldset>
        <a href="" onClick={handleClickMatches}>
          Send message to all matches
        </a>
      </fieldset>
    </div>
  );
}
