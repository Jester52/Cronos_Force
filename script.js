let startTime, elapsedTime = 0, timerInterval;
let isRunning = false;
let isForced = false;
let forcedCents = "00"; 
let displayTapCount = 0; 
let lapBtnTapCount = 0; 

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const forceInput = document.getElementById('forceValue');
const settingsMenu = document.getElementById('settings');
const statusIndicator = document.getElementById('statusIndicator');

// Actualiza el indicador visual para el mago
function updateSecretUI() {
    if (isForced) {
        statusIndicator.classList.remove('hidden');
    } else {
        statusIndicator.classList.add('hidden');
    }
}

// --- LOGICA BOTÓN INICIAR / DETENER ---
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10);
        isRunning = true;
        startBtn.innerText = "Detener";
        startBtn.className = "btn stop";
        lapBtn.innerText = "Vuelta"; 
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
        lapBtn.innerText = "Reiniciar"; 
    }
});

// --- LOGICA BOTÓN IZQUIERDO (Doble Toque + Reset) ---
lapBtn.addEventListener('click', () => {
    lapBtnTapCount++;

    if (lapBtnTapCount === 1) {
        setTimeout(() => {
            if (lapBtnTapCount === 1) {
                // Toque único: Función normal
                if (!isRunning && lapBtn.innerText === "Reiniciar") {
                    resetTimer();
                }
            } else if (lapBtnTapCount === 2) {
                // DOBLE TOQUE: Activar/Desactivar Force
                isForced = !isForced;
                updateSecretUI();
                if (navigator.vibrate) navigator.vibrate(60); 
            }
            lapBtnTapCount = 0; 
        }, 300); 
    }
});

function resetTimer() {
    elapsedTime = 0;
    display.innerHTML = `00:00.<span class="ms">00</span>`;
    lapBtn.innerText = "Vuelta";
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