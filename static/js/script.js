// --- Configurações e Estado Inicial ---
let isRunning = false;
let isFocus = true;
let interval = null;
let cycles = 0;
let totalFocusMinutes = 0;

// Referências do DOM que vamos usar direto
const timerEl = document.getElementById("timer");
const modeEl = document.getElementById("mode");
const cyclesEl = document.getElementById("cycles");
const focusTotalEl = document.getElementById("focusTotal");
const focusInput = document.getElementById("focusTime");
const breakInput = document.getElementById("breakTime");
const alarmSound = document.getElementById("alarmSound");
const startButton = document.querySelector(".buttons button");

// Lógica do Círculo de Progresso (SVG)
const circle = document.getElementById("progressCircle");
const radius = 90;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;

// Tempo inicial baseado no input
let timeLeft = focusInput.value * 60;

// Atualiza o texto do relógio (00:00)
function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    
    timerEl.innerText = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// Controla o desenho da borda do círculo
function setProgress(percent) {
    const offset = circumference - (percent * circumference);
    circle.style.strokeDashoffset = offset;
}

// Atalho para o botão Iniciar/Pausar
function toggleTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.innerText = "Pausar";
        interval = setInterval(countdown, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    isRunning = false;
    startButton.innerText = "Iniciar";
    clearInterval(interval);
}

// O que acontece a cada segundo
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;

        // Calcula o progresso baseado no modo atual
        const total = isFocus ? focusInput.value * 60 : breakInput.value * 60;
        const progress = 1 - (timeLeft / total);
        
        setProgress(progress);
        updateDisplay();
    } else {
        switchMode(); // Acabou o tempo
    }
}

// Troca entre Foco e Pausa
function switchMode() {
    pauseTimer();
    alarmSound.play();

    if (isFocus) {
        // Incrementa estatísticas se terminou um ciclo de foco
        cycles++;
        totalFocusMinutes += parseInt(focusInput.value);

        cyclesEl.innerText = cycles;
        focusTotalEl.innerText = `${totalFocusMinutes} min`;

        timeLeft = breakInput.value * 60;
        modeEl.innerText = "Modo Pausa";
    } else {
        timeLeft = focusInput.value * 60;
        modeEl.innerText = "Modo Foco";
    }

    isFocus = !isFocus;
    setProgress(0);
    updateDisplay();
}

// Limpa tudo e volta ao estado original
function resetTimer() {
    pauseTimer();

    isFocus = true;
    cycles = 0;
    totalFocusMinutes = 0;

    cyclesEl.innerText = "0";
    focusTotalEl.innerText = "0 min";

    timeLeft = focusInput.value * 60;
    modeEl.innerText = "Modo Foco";

    setProgress(0);
    updateDisplay();
}

// Troca de tema Dark/Light
function toggleTheme() {
    document.body.classList.toggle("light");
}

// Listeners para atualizar o tempo se o usuário mexer nos inputs
focusInput.addEventListener("change", resetTimer);
breakInput.addEventListener("change", resetTimer);

// Inicia o display zerado
updateDisplay();