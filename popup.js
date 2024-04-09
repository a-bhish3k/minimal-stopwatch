let watchBtn = document.getElementById("watchBtn");
let resetBtn = document.getElementById("resetBtn");
let stopwatch = document.getElementById("stopwatch");
let spinner = document.getElementById("spinner");

let timer;
let running;

window.onload = () => {
  chrome.runtime.sendMessage("reboot", (response) => {
    formatTime(response.elapsedTime);
    running = response.running;
    ifRunning();
  });
};

const startTimer = () => {
  chrome.runtime.sendMessage("start");
  running = true;
  ifRunning();
};

const stopTimer = () => {
  chrome.runtime.sendMessage("stop");
  clearInterval(timer);
  running = false;
  ifRunning();
};

const formatTime = (elapsedTime) => {
  const totalSeconds = elapsedTime / 1000;
  const milliseconds = Math.floor(elapsedTime % 1000);
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);

  const span = `<span class="text-2xl font-normal text-red-600">.${
    milliseconds.toString()[0]
  }<span>`;

  stopwatch.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${span}`;
};

const pad = (num) => {
  return num.toString().padStart(2, "0");
};

const resetTimer = () => {
  chrome.runtime.sendMessage("reset");
  stopTimer();
  formatTime(0);
};

watchBtn.addEventListener("click", () => {
  !running ? startTimer() : stopTimer();
});

resetBtn.addEventListener("click", resetTimer);

function ifRunning() {
  if (running) {
    watchBtn.textContent = "STOP";
    watchBtn.classList.replace("bg-neutral-950", "bg-red-600");
    spinner.classList.add("animate-spin");
    timer = setInterval(() => {
      chrome.runtime.sendMessage("running", (response) => {
        formatTime(response);
      });
    });
  } else {
    watchBtn.textContent = "START";
    watchBtn.classList.replace("bg-red-600", "bg-neutral-950");
    spinner.classList.remove("animate-spin");
  }
}
