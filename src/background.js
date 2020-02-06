let token = null;
window.chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const header = details.requestHeaders.find(h => h.name === "X-Auth-Token");
    if (
      header
      // && !token
    ) {
      token = header.value;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { payload: token });
        }
      });
    }
    return { requestHeaders: details.requestHeaders };
  },
  {
    urls: ["*://api.gotinder.com/*"],
  },
  ["blocking", "requestHeaders"]
);

// Send cross origin requests
// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const { type, method, url, headers, data } = request;
  if (type === "FETCH") {
    console.log(method, url, headers);
    fetch(url, {
      credentials: "omit",
      headers: {
        accept: "application/json",
        "app-session-id": "f672d1ab-f170-487e-991c-aab4bb54afca",
        "app-session-time-elapsed": "2225321",
        "app-version": "1022200",
        "persistent-device-id": "0949589e-d80b-46a5-9d2d-b82ebf3a9460",
        platform: "web",
        "sec-fetch-dest": "empty",
        "tinder-version": "2.22.0",
        "user-session-id": "bf2e6876-8ecb-48b7-9764-096122ce4205",
        "user-session-time-elapsed": "453",
        "x-supported-image-formats": "webp,jpeg",
        ...headers,
      },
      referrer: "https://tinder.com/",
      referrerPolicy: "origin",
      body: method === "POST" ? JSON.stringify(data) : null,
      method,
      mode: "cors",
    })
      .then(res => res.json())
      .then(json => {
        return sendResponse(json.data);
      });
  }

  return true;
});
