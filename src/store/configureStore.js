import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";

let store = null;

export function getStore() {
  return store;
}

const __DEV__ = true;

export default (preloadedState = {}) => {
  let middlewares = [thunk];

  const composeEnhancers =
    (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers/index.js", () => {
      const nextReducer = require("../reducers/index.js");
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};
