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
    },
    {
        question: "Уровень английского:",
        options: [
            { label: "Лондон из зе кэпитал…", emoji: "🇬🇧" },
            { label: "Говорю руками и гугл-переводчиком", emoji: "📱" },
            { label: "Могу заказать пиво и найти туалет", emoji: "🍺" },
            { label: "Могу спорить на кокни с британским бомжом", emoji: "🎩" }
        ]
    },
    {
        question: "Главная фобия в отпуске:",
        options: [
            { label: "Отравиться", emoji: "🤢" },
            { label: "Встретить коллег из зума", emoji: "💼" },
            { label: "Сгореть в первый день", emoji: "🔥" },
            { label: "Остаться без интернета", emoji: "📵" }
        ]
    }
    // weather question is a special slider — handled in startWeatherSlider()
];

let currentQuestionIndex = 0;
let isAnimating = false;

// Переменные контроля мини-игры
let gameLoopId = null;
let spawnTimeoutId = null;
let isGameActive = false;

const coffeeSound = new Audio("coffee.mp3");
const carSound = new Audio("car.mp3");
const cashSound = new Audio("cash.mp3");
const sochiSound = new Audio("sochi.mp3");

const mosquitoSound = new Audio("mosquito.mp3");
const snoreSound = new Audio("snore.mp3");
const frySound = new Audio("fry.mp3");
const harpSound = new Audio("harp.mp3");

const londonSound = new Audio("london.mp3");
const translateSound = new Audio("translate.mp3");
const beerSound = new Audio("beer.mp3");
const cockneySound = new Audio("cockney.mp3");

const catchSound = new Audio("catch.mp3");

const poisonSound = new Audio("poison.mp3");
const zoomSound = new Audio("zoom.mp3");
const sunburnSound = new Audio("sunburn.mp3");
const noWifiSound = new Audio("nowifi.mp3");

// Weather slider sounds — crossfade between them
const weatherSounds = [
    new Audio("weather1.mp3"), // мороз
    new Audio("weather2.mp3"), // прохлада
    new Audio("weather3.mp3"), // +25
    new Audio("weather4.mp3"), // влажность
    new Audio("weather5.mp3"), // расплавиться
];
weatherSounds.forEach(s => { s.loop = true; s.volume = 0; });

const questionTitle = document.getElementById("question-title");
const optionsGrid = document.getElementById("options-grid");
const questionCard = document.getElementById("question-card");
const skipBtn = document.getElementById("skip-btn");

if (skipBtn) {
    skipBtn.addEventListener("click", () => {
        isAnimating = false;
        transitionToNextQuestion();
    });
}

function stopMiniGame() {
    isGameActive = false;
    if (spawnTimeoutId) {
        clearTimeout(spawnTimeoutId);
        spawnTimeoutId = null;
    }
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    document.querySelectorAll('.falling-item, .stuck-food, .game-plate, .game-progress-container, .game-gradient-top').forEach(el => el.remove());
}

function loadQuestion(index) {
    if (index === 2) {
        startMiniGame();
        return;
    }
    if (index === 5) {
        startWeatherSlider();
        return;
    }

    // index mapping: mini-game is at slot 2, weather at slot 5
    // quizData slots: 0,1 → index 0,1 | index 3 → quizData[2] | index 4 → quizData[3]
    const quizIndex = index > 2 ? index - 1 : index;
    const currentQuiz = quizData[quizIndex];

    if (!currentQuiz) {
        questionTitle.innerText = "Квиз завершен!";
        optionsGrid.className = "options-grid";
        optionsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #6c757d;'>Спасибо за прохождение!</p>";
        if (skipBtn) skipBtn.style.display = "none";
        return;
    }

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
            } else if (index === 3) {
                handleThirdQuestion(option.label, btn);
            } else if (index === 4) {
                handleFourthQuestion(option.label, btn);
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

function handleThirdQuestion(label, btn) {
    let sound = null;

    btn.classList.remove("smooth-press");
    void btn.offsetWidth;
    btn.classList.add("smooth-press");

    if (label === "Лондон из зе кэпитал…") {
        sound = londonSound;
    } 
    else if (label === "Говорю руками и гугл-переводчиком") {
        sound = translateSound;
    } 
    else if (label === "Могу заказать пиво и найти туалет") {
        sound = beerSound;
    }
    else if (label === "Могу спорить на кокни с британским бомжом") {
        sound = cockneySound;
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

function handleFourthQuestion(label, btn) {
    let sound = null;

    btn.classList.remove("smooth-press", "anim-sunburn", "anim-zoom-panic");
    void btn.offsetWidth;

    if (label === "Отравиться") {
        btn.classList.add("anim-mosquito"); // переиспользуем — трясёт как тошнит
        sound = poisonSound;
        btn.addEventListener('animationend', () => btn.classList.remove("anim-mosquito"), { once: true });
    }
    else if (label === "Встретить коллег из зума") {
        btn.classList.add("anim-zoom-panic");
        sound = zoomSound;
        btn.addEventListener('animationend', () => btn.classList.remove("anim-zoom-panic"), { once: true });
    }
    else if (label === "Сгореть в первый день") {
        btn.classList.add("anim-sunburn");
        sound = sunburnSound;
        btn.addEventListener('animationend', () => btn.classList.remove("anim-sunburn"), { once: true });
    }
    else if (label === "Остаться без интернета") {
        triggerNoInternetEffect(btn);
        return; // обрабатываем отдельно — там свой таймаут
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

function triggerNoInternetEffect(btn) {
    btn.classList.add("smooth-press");

    // Курсор → спиннер
    document.body.style.cursor = "wait";
    document.body.classList.add("no-internet-freeze");

    // Показываем оверлей «загрузки»
    const overlay = document.createElement("div");
    overlay.id = "no-internet-overlay";
    overlay.innerHTML = `<div class="no-internet-spinner"></div><p class="no-internet-text">Загрузка…</p>`;
    document.body.appendChild(overlay);

    // Играем звук если есть
    noWifiSound.currentTime = 0;
    noWifiSound.play().catch(() => {});

    // Подвисаем ~2.2 секунды, потом переходим
    setTimeout(() => {
        document.body.style.cursor = "";
        document.body.classList.remove("no-internet-freeze");
        overlay.remove();
        transitionToNextQuestion();
    }, 2200);
}

function transitionToNextQuestion() {
    stopMiniGame();
    stopWeatherSlider();
    questionCard.classList.remove("game-mode");
    optionsGrid.classList.remove("game-container");

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
    stopMiniGame();
    isGameActive = true;

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
    let isEnding = false;
    
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
        if (!isGameActive) return;
        const rect = gameContainer.getBoundingClientRect();
        targetPlateX = e.clientX - rect.left;
    });

    function scheduleNextSpawn() {
        if (!isGameActive || score >= maxScore || isEnding) return;
        const nextInterval = 1800 + Math.random() * 800;
        spawnItem();
        spawnTimeoutId = setTimeout(scheduleNextSpawn, nextInterval);
    }

    function spawnItem() {
        if (!isGameActive || score >= maxScore || isEnding) return;

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

    spawnTimeoutId = setTimeout(scheduleNextSpawn, 400);

    function updateGame() {
        if (!isGameActive) return;

        if (score >= maxScore) {
            if (!isEnding) {
                isEnding = true;
                activeItems.forEach(i => i.el.remove());
                setTimeout(() => {
                    if (!isGameActive) return;
                    transitionToNextQuestion();
                }, 500);
            }
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

        gameLoopId = requestAnimationFrame(updateGame);
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

    gameLoopId = requestAnimationFrame(updateGame);
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

// ─── WEATHER SLIDER ────────────────────────────────────────────────────────

const weatherStages = [
    { label: "Отморозить уши",           emoji: "🥶", temp: "-15°", mercuryColor: "#5aacf5", effect: "frost"    },
    { label: "Приятная прохлада",         emoji: "🍂", temp: "+10°", mercuryColor: "#e53935", effect: "leaves"   },
    { label: "Комфортные +25",            emoji: "☀️", temp: "+25°", mercuryColor: "#e53935", effect: "sunbeams" },
    { label: "Тропическая влажность",     emoji: "💧", temp: "+35°", mercuryColor: "#e53935", effect: "fog"      },
    { label: "Расплавиться на асфальте",  emoji: "🔥", temp: "+45°", mercuryColor: "#e53935", effect: "melt"     }
];

let weatherAnimFrameId = null;
let weatherParticleInterval = null;
let weatherConfirmTimeout = null;
let currentWeatherStage = 2;
let weatherSoundsStarted = false;

function stopWeatherSlider() {
    if (weatherAnimFrameId)    { cancelAnimationFrame(weatherAnimFrameId); weatherAnimFrameId = null; }
    if (weatherParticleInterval){ clearInterval(weatherParticleInterval); weatherParticleInterval = null; }
    if (weatherConfirmTimeout)  { clearTimeout(weatherConfirmTimeout); weatherConfirmTimeout = null; }
    weatherSounds.forEach(s => { try { s.pause(); s.currentTime = 0; s.volume = 0; } catch(e){} });
    weatherSoundsStarted = false;
    document.body.classList.remove('weather-frost','weather-leaves','weather-sunbeams','weather-fog','weather-melt');
    stopMeltDrips();
    questionCard.classList.remove('card-shiver','card-melt');
    document.querySelectorAll('.wx-particle,.wx-overlay,.melt-drip').forEach(el => el.remove());
}

function startWeatherSlider() {
    stopWeatherSlider();
    currentWeatherStage = 2;
    questionTitle.innerText = "Какую погоду хочешь?";
    questionCard.classList.remove("game-mode");
    optionsGrid.className = "options-grid";
    optionsGrid.style.display = "block";

    optionsGrid.innerHTML = `
        <div class="weather-slider-wrap">
            <div class="thermometer-track" id="thermo-track">
                <div class="thermo-tube-wrap">
                    <div class="thermo-tube" id="thermo-tube">
                        <div class="thermo-mercury" id="thermo-mercury"></div>
                    </div>
                    <div class="thermo-bulb" id="thermo-bulb"></div>
                </div>
                <div class="weather-stage-label" id="weather-stage-label"></div>
            </div>
            <button class="weather-confirm-btn" id="weather-confirm-btn">Да!</button>
        </div>`;

    updateThermometer(currentWeatherStage, true);
    applyWeatherEffect(currentWeatherStage);
    updateStageLabel(currentWeatherStage);
    setupWeatherDrag();

    const confirmBtn = document.getElementById('weather-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Поехали!';
            setTimeout(() => {
                stopWeatherSlider();
                transitionToNextQuestion();
            }, 700);
        });
    }
}

function updateStageLabel(stage) {
    const lbl = document.getElementById('weather-stage-label');
    if (!lbl) return;
    lbl.style.opacity = '0';
    setTimeout(() => {
        lbl.innerHTML = `<span class="wsl-emoji">${weatherStages[stage].emoji}</span><span class="wsl-text">${weatherStages[stage].label}</span>`;
        lbl.style.opacity = '1';
    }, 120);
}

function setupWeatherDrag() {
    const track = document.getElementById('thermo-track');
    if (!track) return;
    let dragStartY = null, dragStartStage = currentWeatherStage, isDragging = false;

    function onStart(clientY) {
        dragStartY = clientY; dragStartStage = currentWeatherStage; isDragging = true;
        if (weatherConfirmTimeout) { clearTimeout(weatherConfirmTimeout); weatherConfirmTimeout = null; }
        if (!weatherSoundsStarted) {
            weatherSoundsStarted = true;
            weatherSounds.forEach(s => s.play().catch(()=>{}));
            crossfadeWeatherSounds(currentWeatherStage);
        }
    }
    function onMove(clientY) {
        if (!isDragging || dragStartY === null) return;
        const dy = dragStartY - clientY;
        const shift = Math.round(dy / 52);
        const newStage = Math.max(0, Math.min(4, dragStartStage + shift));
        if (newStage !== currentWeatherStage) {
            currentWeatherStage = newStage;
            updateThermometer(currentWeatherStage, false);
            applyWeatherEffect(currentWeatherStage);
            crossfadeWeatherSounds(currentWeatherStage);
            updateStageLabel(currentWeatherStage);
        }
    }
    function onEnd() { isDragging = false; }

    track.addEventListener('mousedown',  e => onStart(e.clientY));
    window.addEventListener('mousemove', e => { if(isDragging) onMove(e.clientY); });
    window.addEventListener('mouseup',   onEnd);
    track.addEventListener('touchstart', e => onStart(e.touches[0].clientY), {passive:true});
    window.addEventListener('touchmove', e => { if(isDragging) onMove(e.touches[0].clientY); }, {passive:true});
    window.addEventListener('touchend',  onEnd);

    // no label elements anymore — drag only
}

function scheduleWeatherConfirm() { /* handled by confirm button */ }

function updateThermometer(stage, instant) {
    const mercury = document.getElementById('thermo-mercury');
    const bulb    = document.getElementById('thermo-bulb');
    if (!mercury || !bulb) return;
    const pct   = 10 + stage * 20;
    const color = weatherStages[stage].mercuryColor;
    if (instant) {
        mercury.style.transition = 'none';
        bulb.style.transition    = 'none';
    } else {
        mercury.style.transition = 'height 0.4s cubic-bezier(0.25,1,0.5,1), background 0.4s ease';
        bulb.style.transition    = 'background 0.4s ease';
    }
    mercury.style.height     = `${pct}%`;
    mercury.style.background = color;
    bulb.style.background    = color;
}

function crossfadeWeatherSounds(stage) {
    weatherSounds.forEach((s, i) => {
        const target = i === stage ? 0.7 : 0;
        const start  = s.volume;
        const steps  = 20;
        const delta  = (target - start) / steps;
        let step = 0;
        const iv = setInterval(() => {
            step++;
            s.volume = Math.max(0, Math.min(1, start + delta * step));
            if (step >= steps) clearInterval(iv);
        }, 30);
    });
}

// ── Live particle effects ────────────────────────────────────────

function applyWeatherEffect(stage) {
    const cls = ['weather-frost','weather-leaves','weather-sunbeams','weather-fog','weather-melt'];
    document.body.classList.remove(...cls);
    document.querySelectorAll('.wx-overlay').forEach(el=>el.remove());
    if (weatherParticleInterval) { clearInterval(weatherParticleInterval); weatherParticleInterval = null; }
    if (weatherAnimFrameId) { cancelAnimationFrame(weatherAnimFrameId); weatherAnimFrameId = null; }

    if (stage !== 4) stopMeltDrips();
    document.body.classList.add(cls[stage]);
    // card effects
    questionCard.classList.remove('card-shiver', 'card-melt');
    void questionCard.offsetWidth;
    if (stage === 0) questionCard.classList.add('card-shiver');
    if (stage === 4) questionCard.classList.add('card-melt');

    if      (stage===0) startFrostEffect();
    else if (stage===1) startLeavesEffect();
    else if (stage===2) startSunbeamsEffect();
    else if (stage===3) startFogEffect();
    else if (stage===4) startMeltEffect();
}

function spawnWxParticle(html, style) {
    const p = document.createElement('div');
    p.className = 'wx-particle';
    Object.assign(p.style, { position:'fixed', pointerEvents:'none', zIndex:'9990', ...style });
    p.innerHTML = html;
    document.body.appendChild(p);
    return p;
}

function startFrostEffect() {
    const ov = document.createElement('div');
    ov.className = 'wx-overlay frost-overlay';
    document.body.appendChild(ov);
}

function startLeavesEffect() {
    const ov = document.createElement('div');
    ov.className = 'wx-overlay leaves-overlay';
    document.body.appendChild(ov);
}

function startSunbeamsEffect() {
    const ov = document.createElement('div');
    ov.className = 'wx-overlay sunbeam-overlay';
    document.body.appendChild(ov);
    let angle = 0;
    function loop() {
        if (!document.body.classList.contains('weather-sunbeams')) return;
        angle += 0.25;
        ov.style.setProperty('--sun-angle', angle+'deg');
        weatherAnimFrameId = requestAnimationFrame(loop);
    }
    weatherAnimFrameId = requestAnimationFrame(loop);
}

function startFogEffect() {
    const ov = document.createElement('div');
    ov.className = 'wx-overlay fog-overlay';
    document.body.appendChild(ov);
}

function startMeltEffect() {
    const ov = document.createElement('div');
    ov.className = 'wx-overlay melt-overlay';
    document.body.appendChild(ov);

    if (typeof gsap === 'undefined') return;

    const header = document.querySelector('.hero-header');
    const card   = document.querySelector('.question-card');
    const W      = window.innerWidth;

    // Build animated SVG wave edge — sits between header and card, no filter on text
    function buildWavePath(phase, amp) {
        const pts = 12;
        const step = W / pts;
        let d = `M 0 0 L 0 100%`;
        // bottom wavy edge
        d = `M 0 100 `;
        for (let i = 0; i <= pts; i++) {
            const x = i * step;
            const y = 100 + Math.sin(i * 0.9 + phase) * amp + Math.sin(i * 1.7 + phase * 1.3) * amp * 0.5;
            d += `L ${x} ${y} `;
        }
        d += `L ${W} 0 L 0 0 Z`;
        return d;
    }

    // Drip overlay — absolutely positioned div under header with SVG wave bottom
    let dripSvg = document.getElementById('melt-drip-svg');
    if (!dripSvg) {
        dripSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        dripSvg.id = 'melt-drip-svg';
        dripSvg.style.cssText = `position:fixed;top:0;left:0;width:100%;pointer-events:none;z-index:9990;overflow:visible;`;
        dripSvg.setAttribute('height', '300');
        dripSvg.innerHTML = `<path id="melt-wave-path" fill="#007bff"/>`;
        document.body.appendChild(dripSvg);
    }

    const wavePath = document.getElementById('melt-wave-path');
    const headerRect = header ? header.getBoundingClientRect() : { bottom: 120 };
    const baseY = headerRect.bottom;

    let phase = 0;
    let amp = 0;
    let drip = 0; // how far down the wave has dripped

    function animWave() {
        const melting = document.body.classList.contains('weather-melt');

        if (melting) {
            amp  = Math.min(18, amp + 0.15);
            drip = Math.min(60, drip + 0.4);
        } else {
            amp  = Math.max(0, amp  - 1.5);
            drip = Math.max(0, drip - 4);
        }

        if (!melting && amp <= 0) {
            dripSvg.style.display = 'none';
            return;
        }

        dripSvg.style.display = '';
        phase += 0.03;

        const pts = 16;
        const step = W / pts;
        let d = `M 0 ${baseY + drip + amp} `;
        for (let i = 0; i <= pts; i++) {
            const x = i * step;
            const y = baseY + drip
                + Math.sin(i * 0.85 + phase) * amp
                + Math.sin(i * 1.6  + phase * 1.4) * amp * 0.4;
            d += `L ${x} ${y} `;
        }
        d += `L ${W} 0 L 0 0 Z`;
        if (wavePath) wavePath.setAttribute('d', d);

        weatherAnimFrameId = requestAnimationFrame(animWave);
    }

    dripSvg.style.display = '';
    weatherAnimFrameId = requestAnimationFrame(animWave);

    // Card: gentle sag with GSAP
    if (card) {
        card.style.transformOrigin = 'top center';
        gsap.to(card, {
            scaleY: 1.04,
            skewX: 1,
            y: 8,
            duration: 3.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    }

    if (false) { // disabled old canvas code
    const W = window.innerWidth;
    const H = window.innerHeight;

    // canvas overlay
    let cvs = document.getElementById('melt-canvas');
    if (cvs) cvs.remove();
    cvs = document.createElement('canvas');
    cvs.id = 'melt-canvas';
    cvs.width  = W;
    cvs.height = H;
    cvs.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9995;';
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');

    // per-column drip state
    const STRIP = 8;
    const cols  = Math.ceil(W / STRIP);
    const dripY = new Float32Array(cols); // current drip offset px
    const spd   = new Float32Array(cols);
    const ph    = new Float32Array(cols);
    for (let i = 0; i < cols; i++) {
        spd[i] = 0.5 + Math.random() * 0.7;
        ph[i]  = Math.random() * Math.PI * 2;
        dripY[i] = -(30 + Math.random() * H * 0.5); // staggered
    }

    let srcImg   = null;
    let intensity = 0;
    let active   = true;

    // take screenshot after short delay so page has rendered
    setTimeout(() => { if (!active) return;
    html2canvas(document.body, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        width: W, height: H,
        windowWidth: W, windowHeight: H,
        scrollX: 0, scrollY: 0,
        ignoreElements: el => el.id === 'melt-canvas',
    }).then(snap => {
        if (!active) return;
        const off = document.createElement('canvas');
        off.width = W; off.height = H;
        off.getContext('2d').drawImage(snap, 0, 0, W, H);
        srcImg = off.getContext('2d').getImageData(0, 0, W, H);
    }).catch(() => {
        // oklab parse error — patch CSS and retry once
        if (!active) return;
        const style = document.createElement('style');
        style.id = 'h2c-oklab-patch';
        style.textContent = `* { color: inherit !important; }`;
        document.head.appendChild(style);

        html2canvas(document.body, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            width: W, height: H,
            windowWidth: W, windowHeight: H,
            scrollX: 0, scrollY: 0,
            ignoreElements: el => el.id === 'melt-canvas',
            onclone: doc => {
                // strip all stylesheets from clone to avoid oklab
                doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
                // inject simple fallback styles
                const s = doc.createElement('style');
                s.textContent = `
                    body { background: #f0f2f5; }
                    .hero-header { background: #007bff; }
                    .question-card { background: #fff; }
                    * { color: #000; box-shadow: none; }
                `;
                doc.head.appendChild(s);
            }
        }).then(snap => {
            document.getElementById('h2c-oklab-patch')?.remove();
            if (!active) return;
            const off = document.createElement('canvas');
            off.width = W; off.height = H;
            off.getContext('2d').drawImage(snap, 0, 0, W, H);
            srcImg = off.getContext('2d').getImageData(0, 0, W, H);
            if (weatherAnimFrameId) cancelAnimationFrame(weatherAnimFrameId);
            intensity = 0;
            weatherAnimFrameId = requestAnimationFrame(frame);
        }).catch(() => {
            document.getElementById('h2c-oklab-patch')?.remove();
        });
    }); }, 300); // end setTimeout

    function frame() {
        if (!active) return;

        const melting = document.body.classList.contains('weather-melt');
        intensity = melting
            ? Math.min(1, intensity + 0.003)   // ~5s ramp up
            : Math.max(0, intensity - 0.1);     // fast snap back

        if (!melting && intensity <= 0) {
            cvs.remove();
            active = false;
            return;
        }

        if (!srcImg) {
            weatherAnimFrameId = requestAnimationFrame(frame);
            return;
        }

        ctx.clearRect(0, 0, W, H);
        const src    = srcImg.data;
        const maxDrip = H * 0.6 * intensity;

        for (let c = 0; c < cols; c++) {
            const x  = c * STRIP;
            const sw = Math.min(STRIP, W - x);
            if (sw <= 0) break;

            // advance drip
            dripY[c] += spd[c] * intensity;
            const raw    = Math.max(0, dripY[c]);
            const offset = Math.min(raw, maxDrip);
            const xw     = Math.sin(ph[c] + raw * 0.012) * 2.5 * intensity;

            if (offset < 1) {
                // not yet dripping — draw normally
                putStrip(ctx, src, W, H, x, sw, 0, H, x + xw, 0);
            } else {
                // main content shifted down
                const srcH = Math.max(1, H - offset);
                putStrip(ctx, src, W, H, x, sw, 0, srcH, x + xw, offset);
                // stretched tail — last 8 rows pulled into a drip
                putStrip(ctx, src, W, H, x, sw, H - 8, 8, x + xw, H - 8, sw, offset + 8);
            }
        }

        weatherAnimFrameId = requestAnimationFrame(frame);
    }

    weatherAnimFrameId = requestAnimationFrame(frame);
    } // end disabled canvas block
}

function stopMeltDrips() {
    document.querySelectorAll('.css-drip').forEach(d => d.remove());

    const header = document.querySelector('.hero-header');
    const card   = document.querySelector('.question-card');

    if (typeof gsap !== 'undefined') {
        if (header) gsap.killTweensOf(header);
        if (card)   gsap.killTweensOf(card);
    }
    if (header) { header.style.transform = ''; header.style.filter = ''; header.style.willChange = ''; }
    if (card)   { card.style.transform   = ''; card.style.filter   = ''; card.style.willChange   = ''; }

    document.getElementById('melt-filter-svg')?.remove();
    document.getElementById('melt-drip-svg')?.remove();
    document.getElementById('melt-canvas')?.remove();
    document.body.style.filter = '';
}

// ────────────────────────────────────────────────────────────────

loadQuestion(currentQuestionIndex);