const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const minutesInput = document.getElementById("minutes-input");

let interval = null;
let defaultTime = 1500; // 25 min default
let totalTime = defaultTime;
let timeleft = totalTime;

// ⏱️ Update Timer UI
function updateTimer() {
    let minutes = Math.floor(timeleft / 60);
    let seconds = timeleft % 60;

    timer.innerHTML = `${minutes.toString().padStart(2, "0")} : ${seconds
        .toString()
        .padStart(2, "0")}`;
}

// 📊 Update Progress Bar
function updateProgressBar() {
    let progress = (timeleft / totalTime) * 100;
    progressBar.style.width = progress + "%";

    // 🎨 Color change
    if (progress < 30) {
        progressBar.style.background = "#ff4d4d";
    } else if (progress < 60) {
        progressBar.style.background = "#ffa500";
    } else {
        progressBar.style.background =
            "linear-gradient(90deg, #667eea, #764ba2)";
    }
}

// ▶️ Start Timer
function startTimer() {
    if (interval) return; // prevent multiple timers

    // ✅ If user entered time (only before starting)
    if (minutesInput.value && timeleft === totalTime) {
        let userMinutes = parseInt(minutesInput.value);

        if (!isNaN(userMinutes) && userMinutes > 0) {
            totalTime = userMinutes * 60;
            timeleft = totalTime;
        }
    }

    minutesInput.disabled = true;

    interval = setInterval(() => {
        timeleft--;

        updateTimer();
        updateProgressBar();

        if (timeleft <= 0) {
            clearInterval(interval);
            interval = null;
            timeleft = 0;

            updateTimer();
            updateProgressBar();

            alert("⏰ Time's up!");
        }
    }, 1000);
}

// ⏹ Stop Timer
function stopTimer() {
    clearInterval(interval);
    interval = null;
}

// 🔄 Reset Timer
function resetTimer() {
    clearInterval(interval);
    interval = null;

    minutesInput.disabled = false;
    minutesInput.value = "";

    totalTime = defaultTime;
    timeleft = totalTime;

    updateTimer();
    updateProgressBar();
}

// 🎯 Event Listeners
start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

// 🚀 Initialize UI
updateTimer();
updateProgressBar();