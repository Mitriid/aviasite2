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
    if (index === 2) {
        startMiniGame();
        return;
    }

    const currentQuiz = quizData[index];
    questionTitle.innerText = currentQuiz.question;

    optionsGrid.className = "options-grid";
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
        sound.onended = () => {
            sound.onended = null;
            transitionToNextQuestion();
        };
    } else {
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
        transitionToNextQuestion();
    }, duration);
}

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

function startMiniGame() {
    questionTitle.innerText = "Что будем есть?";
    
    questionCard.classList.add("game-mode");
    
    optionsGrid.innerHTML = `
        <div class="game-score" id="game-score">Очки: 0 / 25</div>
        <div class="game-plate" id="game-plate" style="transform: translate(-50%, -50%);">🍽️</div>
    `;
    
    optionsGrid.classList.add("game-container");

    const gamePlate = document.getElementById("game-plate");
    const scoreDisplay = document.getElementById("game-score");
    const gameContainer = document.querySelector('.game-container');

    let score = 0;
    let plateX = gameContainer.clientWidth / 2;
    let plateY = gameContainer.clientHeight - 40; 
    let targetPlateX = plateX;
    let targetPlateY = plateY;

    const uniqueFoodConfigs = [
        { emoji: "🥩", points: 2, type: "food" },
        { emoji: "🍖", points: 2, type: "food" },
        { emoji: "🍗", points: 2, type: "food" },
        { emoji: "🦗", points: 3, type: "food" },
        { emoji: "🐛", points: 2, type: "food" },
        { emoji: "🦐", points: 2, type: "food" },
        { emoji: "🌮", points: 1, type: "food" },
        { emoji: "🥞", points: 1, type: "food" },
        { emoji: "🍰", points: 2, type: "food" },
        { emoji: "🍔", points: 1, type: "food" },
        { emoji: "🍕", points: 1, type: "food" },
        { emoji: "🥑", points: 1, type: "food" },
        { emoji: "🍣", points: 2, type: "food" },
        { emoji: "🍉", points: 1, type: "food" },
        { emoji: "🥐", points: 1, type: "food" },
        { emoji: "🧀", points: 1, type: "food" },
        { emoji: "🍜", points: 2, type: "food" }
    ];

    let activeItems = [];
    let stuckItems = [];

    gameContainer.addEventListener("mousemove", (e) => {
        const rect = gameContainer.getBoundingClientRect();
        targetPlateX = e.clientX - rect.left;
        let relativeY = e.clientY - rect.top;
        
        const minY = gameContainer.clientHeight - 65;
        const maxY = gameContainer.clientHeight - 20;
        
        if (relativeY < minY) relativeY = minY;
        if (relativeY > maxY) relativeY = maxY;
        targetPlateY = relativeY;
    });

    function scheduleNextSpawn() {
        if (score >= 25) return;

        // Спокойный интервал между спавном (~3 секунды)
        const nextInterval = 3000;

        spawnItem();
        setTimeout(scheduleNextSpawn, nextInterval);
    }

    function spawnItem() {
        if (score >= 25) return;

        const activeEmojis = activeItems.map(i => i.emoji);
        const availableFood = uniqueFoodConfigs.filter(f => !activeEmojis.includes(f.emoji));
        if (availableFood.length === 0) return; 

        const config = availableFood[Math.floor(Math.random() * availableFood.length)];

        const containerWidth = gameContainer.clientWidth;
        const numZones = 4;
        const zoneWidth = containerWidth / numZones;
        let zoneCounts = [0, 0, 0, 0];

        activeItems.forEach(item => {
            let zIndex = Math.floor(item.x / zoneWidth);
            if (zIndex >= numZones) zIndex = numZones - 1;
            if (zIndex < 0) zIndex = 0;
            zoneCounts[zIndex]++;
        });

        let minCount = Infinity;
        let bestZones = [];
        for (let i = 0; i < numZones; i++) {
            if (zoneCounts[i] < minCount) {
                minCount = zoneCounts[i];
                bestZones = [i];
            } else if (zoneCounts[i] === minCount) {
                bestZones.push(i);
            }
        }

        const chosenZone = bestZones[Math.floor(Math.random() * bestZones.length)];
        const minX = chosenZone * zoneWidth + 30;
        const maxX = (chosenZone + 1) * zoneWidth - 30;
        const startX = Math.random() * (maxX - minX) + minX;
        const startY = 10; 

        // Постоянная равномерная скорость
        const speed = 0.6 + Math.random() * 0.2;

        const itemEl = document.createElement("div");
        itemEl.classList.add("falling-item");
        itemEl.innerText = config.emoji;
        itemEl.style.left = `${startX}px`;
        itemEl.style.top = `${startY}px`;
        
        gameContainer.appendChild(itemEl);

        activeItems.push({
            el: itemEl,
            x: startX,
            y: startY,
            speed: speed,
            points: config.points,
            type: config.type,
            emoji: config.emoji,
            isMagnetized: false,
            vx: 0,
            vy: 0
        });
    }

    setTimeout(scheduleNextSpawn, 1000);

    function updateGame() {
        if (score >= 25) {
            activeItems.forEach(i => i.el.remove());
            questionTitle.innerText = "Ужин удался! 🎉";
            questionCard.classList.remove("game-mode");
            return;
        }

        plateX += (targetPlateX - plateX) * 0.25;
        plateY += (targetPlateY - plateY) * 0.25;

        gamePlate.style.left = `${plateX}px`;
        gamePlate.style.top = `${plateY}px`;

        // Смещение +6px по вертикали для попадания в самый центр белого круга с учетом transform
        const plateCenterY = plateY + 6;

        for (let i = activeItems.length - 1; i >= 0; i--) {
            let item = activeItems[i];

            const dx = plateX - item.x;
            const dy = plateCenterY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 75 || item.isMagnetized) {
                item.isMagnetized = true;
                
                item.vx = (item.vx || 0) * 0.75 + dx * 0.12;
                item.vy = (item.vy || 0) * 0.75 + dy * 0.12;
                
                item.x += item.vx;
                item.y += item.vy;

                if (Math.hypot(plateX - item.x, plateCenterY - item.y) < 6) {
                    score += item.points;
                    if (score < 0) score = 0;
                    scoreDisplay.innerText = `Очки: ${score} / 25`;

                    item.el.remove();
                    activeItems.splice(i, 1);

                    createSmartStuckFood(item.emoji, plateX, plateCenterY, gameContainer);
                    continue;
                }
            } else {
                item.y += item.speed;
            }

            item.el.style.left = `${item.x}px`;
            item.el.style.top = `${item.y}px`;

            if (item.y > gameContainer.clientHeight + 30) {
                item.el.remove();
                activeItems.splice(i, 1);
            }
        }

        let stuckFoods = gameContainer.querySelectorAll('.stuck-food');
        stuckFoods.forEach(sf => {
            let baseOffsetX = parseFloat(sf.dataset.offsetX);
            let baseOffsetY = parseFloat(sf.dataset.offsetY);
            let tilt = (plateX - targetPlateX) * 0.25;
            sf.style.left = `${plateX + baseOffsetX}px`;
            sf.style.top = `${plateCenterY + baseOffsetY}px`;
            sf.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
        });

        requestAnimationFrame(updateGame);
    }

    function createSmartStuckFood(emoji, pX, pY, container) {
        const stuck = document.createElement("div");
        stuck.classList.add("stuck-food");
        stuck.innerText = emoji;
        
        let bestOffsetX = 0;
        let bestOffsetY = 0;
        let maxMinDist = -1;

        for (let attempt = 0; attempt < 12; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 14; 
            const candidateX = Math.cos(angle) * radius;
            const candidateY = Math.sin(angle) * radius;

            let minDistToOthers = Infinity;
            if (stuckItems.length === 0) {
                minDistToOthers = 999;
            } else {
                stuckItems.forEach(item => {
                    const d = Math.hypot(candidateX - item.offsetX, candidateY - item.offsetY);
                    if (d < minDistToOthers) minDistToOthers = d;
                });
            }

            if (minDistToOthers > maxMinDist) {
                maxMinDist = minDistToOthers;
                bestOffsetX = candidateX;
                bestOffsetY = candidateY;
            }
        }

        stuck.dataset.offsetX = bestOffsetX;
        stuck.dataset.offsetY = bestOffsetY;
        
        stuck.style.left = `${pX + bestOffsetX}px`;
        stuck.style.top = `${pY + bestOffsetY}px`;
        
        container.appendChild(stuck);
        stuckItems.push({ el: stuck, offsetX: bestOffsetX, offsetY: bestOffsetY });

        if (stuckItems.length > 10) {
            let old = stuckItems.shift();
            old.el.remove();
        }
    }

    requestAnimationFrame(updateGame);
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