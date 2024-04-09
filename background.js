let timer;
let startTime;
let elapsedTime = 0;
let running = false;

const startStopwatch = () => {
  startTime = new Date() - elapsedTime;
  timer = setInterval(updateStopwatch);
  running = true;
  chrome.action.setBadgeText({ text: "ON" });
  chrome.action.setBadgeTextColor({ color: "white" });
  chrome.action.setBadgeBackgroundColor({ color: "#cc3333" });
};

const stopStopwatch = () => {
  clearInterval(timer);
  running = false;
  chrome.action.setBadgeText({ text: "" });
};

const updateStopwatch = () => {
  const currentTime = new Date();
  elapsedTime = currentTime - startTime;
};

const resetStopwatch = () => {
  stopStopwatch();
  elapsedTime = 0;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "reboot") {
    sendResponse({ elapsedTime: elapsedTime, running: running });
  } else if (message === "start") {
    startStopwatch();
  } else if (message === "stop") {
    stopStopwatch();
  } else if (message === "reset") {
    resetStopwatch();
  } else if (message === "running") {
    sendResponse(elapsedTime);
  }
});
