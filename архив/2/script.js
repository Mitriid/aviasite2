const quizData = [
    {
        question: "Сколько денег на карточке?",
        options: [
            { label: "Средний капучино", emoji: "☕" },
            { label: "Жигуль на ходу", emoji: "🚗" },
            { label: "Яхта", emoji: "🛥️" },
            { label: "Новостройка в Сочи", emoji: "🏢" }
        ]
    },
    {
        question: "Как спать будем?",
        options: [
            { label: "В спальнике под кустом", emoji: "🏕️" },
            { label: "Хостел на 20 человек", emoji: "🛏️" },
            { label: "Апартаменты с кухней", emoji: "🍳" },
            { label: "На лебяжьем пуху в 5⭐", emoji: "🪶" }
        ]
    }
];

let currentQuestionIndex = 0;
let isAnimating = false;

// Звуки 1 вопроса
const coffeeSound = new Audio("coffee.mp3");
const carSound = new Audio("car.mp3");
const cashSound = new Audio("cash.mp3");
const sochiSound = new Audio("sochi.mp3");

// Звуки 2 вопроса
const mosquitoSound = new Audio("mosquito.mp3");
const snoreSound = new Audio("snore.mp3");
const frySound = new Audio("fry.mp3");
const harpSound = new Audio("harp.mp3");

const questionTitle = document.getElementById("question-title");
const optionsGrid = document.getElementById("options-grid");
const questionCard = document.getElementById("question-card");

function loadQuestion(index) {
    const currentQuiz = quizData[index];
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
            if (isAnimating) return; 
            isAnimating = true; 
            
            if (index === 0) {
                handleFirstQuestion(option.label, btn, e);
            } else if (index === 1) {
                handleSecondQuestion(option.label, btn);
            }
        });

        optionsGrid.appendChild(btn);
    });
}

function handleFirstQuestion(label, btn, e) {
    let sound = null;

    btn.classList.remove("smooth-press", "car-vibration");
    void btn.offsetWidth;

    if (label === "Средний капучино") {
        btn.classList.add("smooth-press");
        sound = coffeeSound;
    } 
    else if (label === "Жигуль на ходу") {
        btn.classList.add("car-vibration");
        sound = carSound;
    } 
    else if (label === "Яхта") {
        btn.classList.add("smooth-press");
        sound = cashSound;
        shootDollars(e.clientX, e.clientY);
    }
    else if (label === "Новостройка в Сочи") {
        btn.classList.add("smooth-press");
        sound = sochiSound;
        spawnDivineGlow(e.clientX, e.clientY);
    }

    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
        
        // Переворот запустится СТРОГО когда звук физически закончится
        sound.onended = () => {
            sound.onended = null; // Очищаем событие, чтобы не дублировалось
            transitionToNextQuestion();
        };
    } else {
        // Защита, если звук не найден
        transitionToNextQuestion();
    }
}

function handleSecondQuestion(label, btn) {
    let sound = null;
    let duration = 500;
    let animClass = "";

    btn.classList.remove("anim-mosquito", "anim-hostel", "anim-simple-press", "anim-harp");
    void btn.offsetWidth;

    if (label === "В спальнике под кустом") {
        animClass = "anim-mosquito";
        sound = mosquitoSound;
        duration = 1500;
    } 
    else if (label === "Хостел на 20 человек") {
        animClass = "anim-hostel";
        sound = snoreSound;
        duration = 3000;
    } 
    else if (label === "Апартаменты с кухней") {
        animClass = "anim-simple-press";
        sound = frySound;
        duration = 800;
    }
    else if (label === "На лебяжьем пуху в 5⭐") {
        animClass = "anim-harp";
        sound = harpSound;
        duration = 1000;
    }

    btn.classList.add(animClass);

    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    setTimeout(() => {
        btn.classList.remove(animClass);
        isAnimating = false;
    }, duration);
}

// Быстрый 3D-переворот карточки (75мс)
function transitionToNextQuestion() {
    questionCard.classList.add("flip-out");
    
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
        
        questionCard.classList.remove("flip-out");
        questionCard.classList.add("flip-in-start");
        
        setTimeout(() => {
            questionCard.classList.remove("flip-in-start");
            isAnimating = false;
        }, 10); 
    }, 75); 
}

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

loadQuestion(currentQuestionIndex);