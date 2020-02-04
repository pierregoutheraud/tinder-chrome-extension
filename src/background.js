let token = null;
window.chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const header = details.requestHeaders.find(h => h.name === "X-Auth-Token");
    if (header /* && !token*/) {
      token = header.value;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { payload: token });
      });
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// chrome.management.uninstallSelf();
