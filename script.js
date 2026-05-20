const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

const mapImage = new Image();
mapImage.src = 'map.jpg';

let ORIGINAL_WIDTH = 1;
let ORIGINAL_HEIGHT = 1;

let drawWidth = 0;
let drawHeight = 0;

let offsetX = 0;
let offsetY = 0;

// Для анимации
let hoveredHero = null;
let time = 0;
let mouseX = 0;
let mouseY = 0;

// ===== ГЕРОИ С ПОЛНЫМИ ДАННЫМИ =====
const heroes = [
    {
        name: 'Анатоль Курагин',
        birthYear: 'ок. 1780',
        deathYear: '1812',
        deathPlace: 'После Бородинского сражения',
        x: 1004, y: 414,
        color: '#d13a2f',
        bio: 'Красавец и повеса, брат Элен. Участвовал в Бородинском сражении, где был тяжело ранен. Ему ампутировали ногу, но спасти не смогли. Умер от гангрены.'
    },
    {
        name: 'Петя Ростов',
        birthYear: '1797',
        deathYear: '1812',
        deathPlace: 'Под Вязьмой',
        x: 965, y: 482,
        color: '#ff5555',
        bio: 'Младший сын графа Ростова. В 15 лет ушёл на войну. Погиб в партизанском бою, бросившись вперёд лошади. Его смерть стала тяжёлым ударом для семьи.'
    },
    {
        name: 'Князь Николай Болконский',
        birthYear: '1736',
        deathYear: '1812',
        deathPlace: 'Лысые Горы',
        x: 1270, y: 235,
        color: '#992222',
        bio: 'Старый князь, отец Андрея. При приближении французов отказался бежать. Был разбит параличом и умер в своём имении.'
    },
    {
        name: 'Элен Безухова',
        birthYear: '1785',
        deathYear: '1812',
        deathPlace: 'Санкт-Петербург',
        x: 848, y: 127,
        color: '#e6b85c',
        bio: 'Светская красавица, жена Пьера. Умерла при загадочных обстоятельствах (от сердечного приступа или последствий неудачного аборта).'
    },
    {
        name: 'Михаил Кутузов',
        birthYear: '1745',
        deathYear: '1813',
        deathPlace: 'Бунцлау, Силезия',
        x: 481, y: 551,
        color: '#c9a227',
        bio: 'Главнокомандующий русской армией. Сдал Москву, чтобы сохранить армию. Умер через год после изгнания Наполеона.'
    },
    {
        name: 'Наполеон Бонапарт',
        birthYear: '1769',
        deathYear: '1821',
        deathPlace: 'Остров Святой Елены',
        x: 68, y: 630,
        color: '#555',
        bio: 'Император Франции. Вторгся в Россию с 600-тысячной армией, занял пустую Москву, позорно бежал. Умер в ссылке от рака желудка.'
    }
];

// ===== ФУНКЦИИ ПЕРЕСЧЁТА =====
function toCanvasX(x) {
    return offsetX + (x / ORIGINAL_WIDTH) * drawWidth;
}

function toCanvasY(y) {
    return offsetY + (y / ORIGINAL_HEIGHT) * drawHeight;
}

// ===== ОТРИСОВКА КАРТЫ =====
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!mapImage.complete || mapImage.naturalWidth === 0) {
        ctx.fillStyle = '#ff6666';
        ctx.font = '16px monospace';
        ctx.fillText('ОШИБКА: Файл map.jpg не найден!', canvas.width/2 - 200, canvas.height/2);
        return;
    }
    
    const imageRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    const canvasRatio = canvas.width / canvas.height;

    if (canvasRatio > imageRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageRatio;
    } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageRatio;
    }

    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = (canvas.height - drawHeight) / 2;

    ctx.drawImage(mapImage, offsetX, offsetY, drawWidth, drawHeight);
    drawHeroes();
}

// ===== ОТРИСОВКА ГЕРОЕВ С АНИМАЦИЕЙ =====
function drawHeroes() {
    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        let scale = Math.max(2, drawWidth / ORIGINAL_WIDTH * 4);
        
        let isHovered = (hoveredHero === hero);
        let animScale = 1;
        
        if (isHovered) {
            animScale = 1.1 + Math.sin(time * 10) * 0.05;
            scale = scale * animScale;
        }
        
        if (isHovered) {
            ctx.shadowColor = '#ffcc66';
            ctx.shadowBlur = 15;
        } else {
            ctx.shadowColor = '#ffcc66';
            ctx.shadowBlur = 8;
        }

        // Голова
        ctx.fillStyle = '#ffd39a';
        ctx.fillRect(x - scale, y - scale * 4, scale * 2, scale * 2);
        
        // Тело
        ctx.fillStyle = hero.color;
        ctx.fillRect(x - scale * 1.5, y - scale * 2, scale * 3, scale * 3);
        
        // Пояс
        ctx.fillStyle = '#700';
        ctx.fillRect(x - scale * 2, y - scale * 1.5, scale * 4, scale);
        
        // Оружие/символ
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + scale * 2, y - scale * 2, scale, scale * 4);
        
        // Блик при наведении
        if (isHovered) {
            ctx.fillStyle = 'rgba(255,255,200,0.6)';
            ctx.fillRect(x - scale * 1.2, y - scale * 3.5, scale * 2.4, scale * 1.2);
        }
        
        ctx.shadowBlur = 0;
        
        // Имя героя
        let fontSize = 14;
        let nameOffsetX = 18;
        let nameOffsetY = -10;
        
        if (isHovered) {
            fontSize = 15;
            nameOffsetX = 19;
            nameOffsetY = -11;
        }
        
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = '#000';
        ctx.fillText(hero.name, x + nameOffsetX, y + nameOffsetY);
        ctx.fillStyle = '#ffe2a0';
        ctx.fillText(hero.name, x + nameOffsetX - 1, y + nameOffsetY - 1);
    });
}

// ===== СМЕНА КУРСОРА =====
function updateCursor() {
    let isOverHero = false;
    
    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        
        if (mouseX >= x - 30 && mouseX <= x + 30 && mouseY >= y - 35 && mouseY <= y + 35) {
            isOverHero = true;
        }
    });
    
    canvas.style.cursor = isOverHero ? 'pointer' : 'default';
}

// ===== ОТСЛЕЖИВАНИЕ МЫШИ =====
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    let newHovered = null;
    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        
        if (mouseX >= x - 30 && mouseX <= x + 30 && mouseY >= y - 35 && mouseY <= y + 35) {
            newHovered = hero;
        }
    });
    
    hoveredHero = newHovered;
    updateCursor();
});

// ===== КЛИК ПО ГЕРОЮ =====
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);

        if (mx >= x - 30 && mx <= x + 30 && my >= y - 35 && my <= y + 35) {
            openModal(hero);
        }
    });
});

// ===== МОДАЛЬНОЕ ОКНО =====
function openModal(hero) {
    document.getElementById('modalName').textContent = hero.name;
    document.getElementById('modalDates').textContent = `${hero.birthYear} — ${hero.deathYear}`;
    document.getElementById('modalDeathPlace').textContent = hero.deathPlace;
    document.getElementById('modalBio').textContent = hero.bio;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// ===== АНИМАЦИЯ =====
function animate() {
    time += 0.05;
    drawMap();
    requestAnimationFrame(animate);
}

// ===== RESIZE =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawMap();
}

window.addEventListener('resize', resizeCanvas);

// ===== ЗАПУСК =====
mapImage.onload = () => {
    ORIGINAL_WIDTH = mapImage.width;
    ORIGINAL_HEIGHT = mapImage.height;
    resizeCanvas();
    animate();
};

mapImage.onerror = () => {
    resizeCanvas();
    console.error('Ошибка: map.jpg не найден');
};

resizeCanvas();
