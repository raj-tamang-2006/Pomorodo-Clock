let timer;
let timeLeft = 0;
let isRunning = false;
let isFocus = true;
let currentCycle = 0;

const focusSound = document.getElementById("focusSound");
const breakSound = document.getElementById("breakSound");

function startTimer() {
    if (isRunning) return;

    const focusTime = parseInt(document.getElementById("Ftime").value) * 60;
    const breakTime = parseInt(document.getElementById("Btime").value) * 60;
    const totalCycles = parseInt(document.getElementById("cycle").value);

    if (timeLeft === 0) {
        if (isFocus) {
            timeLeft = focusTime;
            document.getElementById("mode").textContent = "Focus Time";

            focusSound.currentTime = 0;
            focusSound.play();

        } else {
            timeLeft = breakTime;
            document.getElementById("mode").textContent = "Break Time";

            breakSound.currentTime = 0;
            breakSound.play();
        }
    }

    isRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;

            if (isFocus) {
                isFocus = false;
                timeLeft = 0;
                startTimer(); // Start break
            } else {
                currentCycle++;

                if (currentCycle < totalCycles) {
                    isFocus = true;
                    timeLeft = 0;
                    startTimer(); // Start next focus
                } else {
                    document.getElementById("mode").textContent = "Completed 🎉";
                }
            }
        }
    }, 1000);

    updateDisplay();
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);

    isRunning = false;
    isFocus = true;
    currentCycle = 0;
    timeLeft = 0;

    document.getElementById("mode").textContent = "Ready";
    document.getElementById("timer").textContent = "00:00";
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}