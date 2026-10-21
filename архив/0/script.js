const quizData = [
    {
        question: "Сколько денег на карточке?",
        options: [
            { label: "Средний капучино", emoji: "☕" },
            { label: "Жигуль на ходу", emoji: "🚗" },
            { label: "Яхта", emoji: "🛥️" },
            { label: "Новостройка в Сочи", emoji: "🏢" }
        ]
    }
];

// Подключение всех звуковых файлов
const coffeeSound = new Audio("coffee.mp3");
const carSound = new Audio("car.mp3");
const cashSound = new Audio("cash.mp3");
const sochiSound = new Audio("sochi.mp3");

const questionTitle = document.getElementById("question-title");
const optionsGrid = document.getElementById("options-grid");

function loadQuestion() {
    const currentQuiz = quizData[0];
    questionTitle.innerText = currentQuiz.question;

    optionsGrid.innerHTML = "";
    
    currentQuiz.options.forEach((option) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerHTML = `
            <span class="option-emoji">${option.emoji}</span>
            <span class="option-label">${option.label}</span>
        `;
        
        btn.addEventListener("click", (e) => {
            // Обработка вариантов
            if (option.label === "Средний капучино") {
                btn.classList.remove("smooth-press");
                void btn.offsetWidth;
                btn.classList.add("smooth-press");

                coffeeSound.currentTime = 0;
                coffeeSound.play().catch(() => {});
            } 
            else if (option.label === "Жигуль на ходу") {
                // Вибрация двигателя
                btn.classList.remove("car-vibration");
                void btn.offsetWidth;
                btn.classList.add("car-vibration");

                carSound.currentTime = 0;
                carSound.play().catch(() => {});
            } 
            else if (option.label === "Яхта") {
                btn.classList.remove("smooth-press");
                void btn.offsetWidth;
                btn.classList.add("smooth-press");

                cashSound.currentTime = 0;
                cashSound.play().catch(() => {});
                shootDollars(e.clientX, e.clientY);
            }
            else if (option.label === "Новостройка в Сочи") {
                btn.classList.remove("smooth-press");
                void btn.offsetWidth;
                btn.classList.add("smooth-press");

                sochiSound.currentTime = 0;
                sochiSound.play().catch(() => {});
                spawnDivineGlow(e.clientX, e.clientY);
            } 
        });

        optionsGrid.appendChild(btn);
    });
}

// Залп долларов для Яхты
function shootDollars(originX, originY) {
    const count = 25;

    for (let i = 0; i < count; i++) {
        const dollar = document.createElement("span");
        dollar.classList.add("dollar-particle");
        dollar.innerText = i % 3 === 0 ? "💰" : "💵";
        
        dollar.style.left = `${originX}px`;
        dollar.style.top = `${originY}px`;

        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
        const speed = 120 + Math.random() * 140;
        const x = Math.cos(angle) * speed;
        const y = Math.sin(angle) * speed;
        const rotation = (Math.random() - 0.5) * 720;

        dollar.style.setProperty("--x", `${x}px`);
        dollar.style.setProperty("--y", `${y}px`);
        dollar.style.setProperty("--rot", `${rotation}deg`);

        document.body.appendChild(dollar);
        setTimeout(() => dollar.remove(), 1200);
    }
}

// Божественное сияние для Сочи
function spawnDivineGlow(originX, originY) {
    const glow = document.createElement("div");
    glow.classList.add("divine-glow");
    glow.style.left = `${originX}px`;
    glow.style.top = `${originY}px`;
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 1400);

    const sparklesCount = 12;
    const icons = ["✨", "🌟", "💫", "☀️"];

    for (let i = 0; i < sparklesCount; i++) {
        const sparkle = document.createElement("span");
        sparkle.classList.add("divine-sparkle");
        sparkle.innerText = icons[i % icons.length];
        
        sparkle.style.left = `${originX}px`;
        sparkle.style.top = `${originY}px`;

        const angle = (Math.PI * 2 / sparklesCount) * i;
        const distance = 80 + Math.random() * 90;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.setProperty("--x", `${x}px`);
        sparkle.style.setProperty("--y", `${y}px`);

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1300);
    }
}

loadQuestion();