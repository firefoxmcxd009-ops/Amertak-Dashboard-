const SERVER_IP = "mazerclub.net"; 
const STATUS_API = `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`;
const PLAYER_API = `http://${SERVER_IP}:62153/v1/players`;
const HISTORY_KEY = "foxmc_terminal_history";

let allPlayers = [];
let activePage = 'players';

/**
 * Live Stock Path Generator
 * Creates a jittery, realistic market line
 */
function generateMarketPath(isUp) {
    let points = [];
    const segments = 15;
    const width = 100;
    const height = 40;
    
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        let y;
        
        if (isUp) {
            y = (height - 5) - (i * (height / segments)) + (Math.random() * 8 - 4);
        } else {
            y = 5 + (i * (height / segments)) + (Math.random() * 8 - 4);
        }
        
        y = Math.max(5, Math.min(35, y));
        points.push(`${x},${y}`);
    }

    const d = `M ${points.join(' L ')}`;
    const fillD = `${d} V 40 H 0 Z`;
    
    return { d, fillD };
}

/**
 * Circular Progress Update
 */
function updateProgress(current, max) {
    const progress = document.getElementById("progress");

    if (!progress) return;

    // calculate from max players
    const percent = max > 0 ? (current / max) * 100 : 0;

    // Convert to degrees
    const deg = percent * 3.6;

    progress.style.background = `
        conic-gradient(
            #ff0000 0deg,
            #ff0000 ${deg}deg,
            #1e293b ${deg}deg,
            #1e293b 360deg
        )
    `;

    progress.innerHTML = `<span>${current}</span>`;
}

/*
 * Calculated as (Current / Max) * 100
 */
function updateStockTrend(currentCount, maxCount) {
    const trendCard = document.getElementById('trendCard');
    const trendText = document.getElementById('trendPercent');
    const trendLine = document.getElementById('trendLine');
    const trendFill = document.getElementById('trendFill');

    if (!trendCard || !trendText || !trendLine || !trendFill) return;

    // Calculate percentage based on MAX players
    const capacityPercent = maxCount > 0 
        ? (currentCount / maxCount) * 100 
        : 0;

    const now = Date.now();

    let history = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
    );

    history.push({
        time: now,
        count: currentCount
    });

    history = history.filter(
        h => now - h.time < 3600000
    );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    // Determine color
    let isUp = true;

    if (history.length > 1) {
        isUp = currentCount >= history[history.length - 2].count;
    }

    // Update SVG Paths
    const paths = generateMarketPath(isUp);

    trendLine.setAttribute('d', paths.d);
    trendFill.setAttribute('d', paths.fillD);
    
    // UI Updates
    trendCard.className = `
        analytics-card ${isUp ? 'trend-up' : 'trend-down'}
    `;

    trendText.innerText = `${capacityPercent.toFixed(1)}%`;
    
    // Update Subtext
    const volatilityText = trendCard.querySelector(
        'span[style*="opacity: 0.6"]'
    );
    if (volatilityText) {
        volatilityText.innerText = `
            CAPACITY: ${currentCount}/${maxCount}
        `;
    }
}

/**
 * Main Data Fetching
 */
async function refreshDashboard() {
    try {
        const [statusRes, playerRes] = await Promise.allSettled([
            fetch(STATUS_API).then(res => res.json()),
            fetch(PLAYER_API).then(res => res.json())
        ]);

        if (
            statusRes.status === 'fulfilled' &&
            statusRes.value.online
        ) {
            const data = statusRes.value;

            const dot = document.getElementById("statusDot");

            document.getElementById("progressCount").innerText = `THANKS FOR ${data.players.online} PLAYERS`;

            document.getElementById('playerCounter').innerText =
                `${data.players.online} / ${data.players.max} ONLINE`;
            
            // Update trend
            updateStockTrend(
                data.players.online,
                data.players.max
            );

            // Update circular progress here
            updateProgress(
                data.players.online,
                data.players.max
            );
        }

        if (playerRes.status === 'fulfilled') {
            allPlayers = playerRes.value.data || [];
            renderPlayerList();
        }
        if(data.online) {
            dot.style.backgroundColor = `green`;
        }
        

    } catch (e) {
        console.error("Terminal Sync Error:", e);
    }
}

/*
 * List Rendering
 */
function renderPlayerList() {
    const container = document.getElementById('playerContainer');

    if (!container) return;

    const search = document
        .getElementById('searchInput')
        ?.value
        .toLowerCase() || "";
    
    let filtered = allPlayers.filter(
        p => p.name.toLowerCase().includes(search)
    );

    if (activePage === 'topkills') {
        filtered.sort(
            (a, b) => (b.kills?.v || 0) - (a.kills?.v || 0)
        );
    }

    if (activePage === 'topdeaths') {
        filtered.sort(
            (a, b) => (b.deaths?.v || 0) - (a.deaths?.v || 0)
        );
    }

    container.innerHTML = filtered.map(p => `
        <div class="player-card">
            <img 
                src="https://crafthead.net/helm/${p.name}/64"
                style="
                    width:42px;
                    height:42px;
                    border-radius:8px;
                "
            >

            <div style="flex:1">
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">
                    <span style="
                        font-weight:800;
                        font-size:14px;
                        letter-spacing:0.5px;
                    ">
                        ${p.name.toUpperCase()}
                    </span>

                    <span style="
                        font-size:8px;
                        color:var(--accent);
                        border:1px solid var(--accent);
                        padding:1px 5px;
                        border-radius:4px;
                    ">
                        ONLINE
                    </span>
                </div>

                <div style="
                    display:flex;
                    gap:12px;
                    margin-top:5px;
                    opacity:0.5;
                    font-size:10px;
                ">
                    <span>KILLS: ${p.kills?.v || 0}</span>
                    <span>DEATHS: ${p.deaths?.v || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Sidebar & Navigation
 */
function toggleSidebar() {
    document.getElementById('sidebar')
        ?.classList.toggle('sidebar-open');

    document.getElementById('overlay')
        ?.classList.toggle('hidden');
    
    document.querySelector(".hamburger-btn")
        ?.classList.toggle("rotate")
}

// Global Listeners
document.getElementById('searchInput')
    ?.addEventListener('input', renderPlayerList);

// Boot
refreshDashboard();

setInterval(refreshDashboard, 15000); 

// Live Jitter Loop
setInterval(() => {
    const trendCard =
        document.getElementById('trendCard');

    if (!trendCard) return;
    
    const isUp =
        trendCard.classList.contains('trend-up');

    const paths = generateMarketPath(isUp);

    document.getElementById('trendLine')
        ?.setAttribute('d', paths.d);

    document.getElementById('trendFill')
        ?.setAttribute('d', paths.fillD);

}, 3000);

/* =========================
   RANKS KITS CONTAINER
========================= */
// Data
const dataList = [
    { img:"/images/logo.svg", rankTag:"vip", price: "3$" },
    { img:"/images/logo.svg", rankTag:"mvp", price: "5$" },
    { img:"/images/logo.svg", rankTag:"mvp+", price: "6.5$" },
    { img:"/images/logo.svg", rankTag:"epic", price: "8$" },
    { img:"/images/logo.svg", rankTag:"Amertak", price: "10$" }
];

const kitImg = document.getElementById("kitImg");
const dotsBox = document.getElementById("dots");


// ======================
// CREATE SLIDES
// ======================

// LAST CLONE
createCard(dataList[dataList.length - 1]);

// REAL
dataList.forEach(data=>{
    createCard(data);
});

// FIRST CLONE
createCard(dataList[0]);

function createCard(data){

    const card = document.createElement("div");

    card.className = "kitCard";

    card.innerHTML = `
        <img src="${data.img}">
        <div class="tagPrice">
            <div class="rankTag">${data.rankTag}</div>
        </div>
    `;

    kitImg.appendChild(card);
}


// ======================
// VARIABLES
// ======================

const realSlides = dataList.length;

let index = 1;

let startX = 0;
let currentX = 0;
let dragging = false;

let autoSlide;


// START POSITION
kitImg.style.transform = `translateX(-100%)`;


// ======================
// CREATE DOTS
// ======================

for(let i=0;i<realSlides;i++){

    const dot = document.createElement("div");

    dot.className = "dot";

    if(i === 0){
        dot.classList.add("active");
    }

    dotsBox.appendChild(dot);
}

const dots = document.querySelectorAll(".dot");


// ======================
// UPDATE DOTS
// ======================

function updateDots(){

    let realIndex = index - 1;

    if(realIndex < 0){
        realIndex = realSlides - 1;
    }

    if(realIndex >= realSlides){
        realIndex = 0;
    }

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    dots[realIndex].classList.add("active");
}


// ======================
// MOVE SLIDE
// ======================

function moveSlide(){

    kitImg.style.transition = "transform .5s ease";

    kitImg.style.transform = `translateX(-${index * 100}%)`;

    updateDots();
}


// NEXT
function nextSlide(){
    index++;
    moveSlide();
}

// PREV
function prevSlide(){
    index--;
    moveSlide();
}


// ======================
// INFINITE LOOP
// ======================

kitImg.addEventListener("transitionend", ()=>{

    // AFTER LAST
    if(index === realSlides + 1){

        kitImg.style.transition = "none";

        index = 1;

        kitImg.style.transform = `translateX(-${index * 100}%)`;
    }

    // BEFORE FIRST
    if(index === 0){

        kitImg.style.transition = "none";

        index = realSlides;

        kitImg.style.transform = `translateX(-${index * 100}%)`;
    }
});


// ======================
// AUTO SLIDE
// ======================

function startAuto(){

    autoSlide = setInterval(()=>{
        nextSlide();
    },3000);
}

function resetAuto(){

    clearInterval(autoSlide);

    startAuto();
}

startAuto();


// ======================
// TOUCH / DRAG
// ======================

function dragStart(x){

    dragging = true;

    startX = x;
}

function dragMove(x){

    if(!dragging) return;

    currentX = x;
}

function dragEnd(){

    if(!dragging) return;

    let diff = startX - currentX;

    if(diff > 50){
        nextSlide();
    }

    else if(diff < -50){
        prevSlide();
    }

    dragging = false;

    resetAuto();
}


// MOBILE
kitImg.addEventListener("touchstart", e=>{
    dragStart(e.touches[0].clientX);
});

kitImg.addEventListener("touchmove", e=>{
    dragMove(e.touches[0].clientX);
});

kitImg.addEventListener("touchend", dragEnd);


// DESKTOP
kitImg.addEventListener("mousedown", e=>{
    dragStart(e.clientX);
});

kitImg.addEventListener("mousemove", e=>{
    dragMove(e.clientX);
});

kitImg.addEventListener("mouseup", dragEnd);

kitImg.addEventListener("mouseleave", dragEnd);