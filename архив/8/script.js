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

const coffeeSound = new Audio("coffee.mp3");
const carSound = new Audio("car.mp3");
const cashSound = new Audio("cash.mp3");
const sochiSound = new Audio("sochi.mp3");

const mosquitoSound = new Audio("mosquito.mp3");
const snoreSound = new Audio("snore.mp3");
const frySound = new Audio("fry.mp3");
const harpSound = new Audio("harp.mp3");

const catchSound = new Audio("catch.mp3");

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
        
        btn.addEventListener("click", () => {
            if (isAnimating) return; 
            isAnimating = true; 
            
            if (index === 0) {
                handleFirstQuestion(option.label, btn);
            } else if (index === 1) {
                handleSecondQuestion(option.label, btn);
            }
        });

        optionsGrid.appendChild(btn);
    });
}

function handleFirstQuestion(label, btn) {
    let sound = null;

    btn.classList.remove("smooth-press", "car-vibration");
    void btn.offsetWidth;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

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
        shootDollars(btnCenterX, btnCenterY);
    }
    else if (label === "Новостройка в Сочи") {
        btn.classList.add("smooth-press");
        sound = sochiSound;
        spawnDivineGlow(btnCenterX, btnCenterY);
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
    let animClass = "";

    btn.classList.remove("anim-mosquito", "anim-hostel", "anim-simple-press", "anim-harp");
    void btn.offsetWidth;

    if (label === "В спальнике под кустом") {
        animClass = "anim-mosquito";
        sound = mosquitoSound;
    } 
    else if (label === "Хостел на 20 человек") {
        animClass = "anim-hostel";
        sound = snoreSound;
    } 
    else if (label === "Апартаменты с кухней") {
        animClass = "anim-simple-press";
        sound = frySound;
    }
    else if (label === "На лебяжьем пуху в 5⭐") {
        animClass = "anim-harp";
        sound = harpSound;
    }

    btn.classList.add(animClass);

    // Удаляем класс анимации по её завершении, если нужно, но главное — завязываем переход на звук
    if (animClass) {
        btn.addEventListener('animationend', () => {
            btn.classList.remove(animClass);
        }, { once: true });
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
        <div class="game-progress-container">
            <div class="game-progress-bar" id="game-progress-bar"></div>
        </div>
        <div class="game-gradient-top"></div>
        <div class="game-plate" id="game-plate" style="transform: translate(-50%, -50%);">🍽️</div>
    `;
    
    optionsGrid.classList.add("game-container");

    const gamePlate = document.getElementById("game-plate");
    const progressBar = document.getElementById("game-progress-bar");
    const gameContainer = document.querySelector('.game-container');

    let score = 0;
    const maxScore = 10; 
    
    let plateX = gameContainer.clientWidth / 2;
    const plateY = gameContainer.clientHeight - 60;
    let targetPlateX = plateX;

    const foodCategories = {
        fruitsVeg: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠"],
        meatFastFood: ["🥩", "🍗", "🍖", "🍔", "🌭", "🌮", "🌯", "🥙", "🍕", "🍟", "🥓", "🥚", "🍳", "🦗", "🐛"],
        seafood: ["🐟", "🐠", "🐡", "🦐", "🦑", "🐙", "🦞", "🦀", "🦪", "🍜", "🍣"],
        desserts: ["🍞", "🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀", "🍰", "🧁", "🥧", "🍦", "🍨", "🍩", "🍪"]
    };
    
    const categoryKeys = Object.keys(foodCategories);
    let lastCategory = null;
    let usedEmojis = []; 

    let activeItems = [];
    let stuckItems = [];

    gameContainer.addEventListener("mousemove", (e) => {
        const rect = gameContainer.getBoundingClientRect();
        targetPlateX = e.clientX - rect.left;
    });

    function scheduleNextSpawn() {
        if (score >= maxScore) return;
        const nextInterval = 1800 + Math.random() * 800;
        spawnItem();
        setTimeout(scheduleNextSpawn, nextInterval);
    }

    function spawnItem() {
        if (score >= maxScore) return;

        let availableCats = categoryKeys.filter(c => c !== lastCategory);
        let chosenCat = availableCats[Math.floor(Math.random() * availableCats.length)];
        lastCategory = chosenCat;

        let catEmojis = foodCategories[chosenCat].filter(e => !usedEmojis.includes(e));
        if (catEmojis.length === 0) {
            catEmojis = foodCategories[chosenCat];
        }
        
        let emoji = catEmojis[Math.floor(Math.random() * catEmojis.length)];
        usedEmojis.push(emoji);

        const startX = 40 + Math.random() * (gameContainer.clientWidth - 80);
        const startY = 25; 
        const speed = 1.0 + Math.random() * 0.5; 

        const itemEl = document.createElement("div");
        itemEl.classList.add("falling-item");
        itemEl.innerText = emoji;
        itemEl.style.left = `${startX}px`;
        itemEl.style.top = `${startY}px`;
        
        gameContainer.appendChild(itemEl);

        activeItems.push({
            el: itemEl,
            x: startX,
            y: startY,
            speed: speed,
            emoji: emoji,
            isMagnetized: false,
            vx: 0,
            vy: 0
        });
    }

    setTimeout(scheduleNextSpawn, 400);

    function updateGame() {
        if (score >= maxScore) {
            activeItems.forEach(i => i.el.remove());
            gameContainer.style.height = `${gameContainer.clientHeight}px`;
            return;
        }

        plateX += (targetPlateX - plateX) * 0.2;
        
        gamePlate.style.left = `${plateX}px`;
        gamePlate.style.top = `${plateY}px`;

        const plateCenterY = plateY + 5; 

        for (let i = activeItems.length - 1; i >= 0; i--) {
            let item = activeItems[i];

            const dx = plateX - item.x;
            const dy = plateCenterY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 85 || item.isMagnetized) {
                item.isMagnetized = true;
                
                item.vx = (item.vx || 0) * 0.75 + dx * 0.12;
                item.vy = (item.vy || 0) * 0.75 + dy * 0.12;
                
                item.x += item.vx;
                item.y += item.vy;

                if (Math.hypot(plateX - item.x, plateCenterY - item.y) < 10) {
                    score += 1; 
                    progressBar.style.width = `${(score / maxScore) * 100}%`;

                    catchSound.currentTime = 0;
                    catchSound.play().catch(() => {});

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

            if (item.y > gameContainer.clientHeight + 40) {
                item.el.remove();
                activeItems.splice(i, 1);
            }
        }

        let stuckFoods = gameContainer.querySelectorAll('.stuck-food');
        stuckFoods.forEach(sf => {
            let baseOffsetX = parseFloat(sf.dataset.offsetX);
            let baseOffsetY = parseFloat(sf.dataset.offsetY);
            let tilt = (plateX - targetPlateX) * 0.2;
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
            const radius = Math.random() * 22; 
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