// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

let startTime, elapsedTime = 0, timerInterval;
let isRunning = false;
let isForced = false;
let forcedCents = "00"; 
let displayTapCount = 0; 
let resetBtnTapCount = 0; 
let lapCount = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const forceInput = document.getElementById('forceValue');
const settingsMenu = document.getElementById('settings');
const statusIndicator = document.getElementById('statusIndicator');

function updateSecretUI() {
    isForced ? statusIndicator.classList.remove('hidden') : statusIndicator.classList.add('hidden');
}

// --- BOTÓN INICIAR / DETENER ---
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10);
        isRunning = true;
        startBtn.innerText = "Detener";
        startBtn.className = "btn stop";
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        
        if (isForced && elapsedTime > 3000) {
            let currentTimeStr = display.innerText.split('.')[0]; 
            display.innerHTML = `${currentTimeStr}.<span class="ms">${forcedCents}</span>`;
            isForced = false; 
            updateSecretUI();
        }
        startBtn.innerText = "Iniciar";
        startBtn.className = "btn start";
    }
});

// --- BOTÓN VUELTA ---
lapBtn.addEventListener('click', () => {
    if (isRunning) {
        lapCount++;
        const li = document.createElement('li');
        li.className = 'lap-item';
        li.innerHTML = `<span class="lap-number">Vuelta ${lapCount}</span> <span>${display.innerText}</span>`;
        lapsList.prepend(li);
    }
});

// --- BOTÓN REINICIAR (Con Doble Toque Secreto) ---
resetBtn.addEventListener('click', () => {
    resetBtnTapCount++;

    if (resetBtnTapCount === 1) {
        setTimeout(() => {
            if (resetBtnTapCount === 1) {
                if (!isRunning) resetTimer();
            } else if (resetBtnTapCount === 2) {
                // DOBLE TOQUE: Activar/Desactivar Force
                isForced = !isForced;
                updateSecretUI();
                if (navigator.vibrate) navigator.vibrate(60); 
            }
            resetBtnTapCount = 0; 
        }, 300); 
    }
});

function resetTimer() {
    elapsedTime = 0;
    lapCount = 0;
    display.innerHTML = `00:00.<span class="ms">00</span>`;
    lapsList.innerHTML = "";
    isForced = false; 
    updateSecretUI();
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    display.innerHTML = formatTime(elapsedTime);
}

function formatTime(time) {
    let date = new Date(time);
    let m = String(date.getUTCMinutes()).padStart(2, '0');
    let s = String(date.getUTCSeconds()).padStart(2, '0');
    let ms = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
    return `${m}:${s}.<span class="ms">${ms}</span>`;
}

// Menú Triple Tap en el tiempo
display.addEventListener('click', () => {
    displayTapCount++;
    if (displayTapCount === 3) {
        settingsMenu.classList.toggle('hidden');
        displayTapCount = 0;
    }
    setTimeout(() => displayTapCount = 0, 500);
});

function toggleSettings() {
    if (forceInput.value !== "") {
        forcedCents = forceInput.value.padStart(2, '0').slice(-2);
    }
    settingsMenu.classList.add('hidden');
}