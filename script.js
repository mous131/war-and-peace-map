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
let animationFrame = null;
let time = 0;

// Для отслеживания наведения мыши
let mouseX = 0;
let mouseY = 0;

const heroes = [
    {
        name: 'Анатоль Курагин',
        x: 1004, y: 414,
        color: '#d13a2f',
        bio: 'Ранен под Бородино, умер от гангрены.'
    },
    {
        name: 'Петя Ростов',
        x: 965, y: 482,
        color: '#ff5555',
        bio: '15-летний юноша. Погиб в партизанском бою под Вязьмой.'
    },
    {
        name: 'Князь Болконский',
        x: 1270, y: 235,
        color: '#992222',
        bio: 'Старый князь. Умер в Лысых Горах при приближении французов.'
    },
    {
        name: 'Элен Безухова',
        x: 848, y: 127,
        color: '#e6b85c',
        bio: 'Светская красавица. Умерла в Петербурге в 1812 году.'
    },
    {
        name: 'Михаил Кутузов',
        x: 481, y: 551,
        color: '#c9a227',
        bio: 'Великий полководец. Умер в Бунцлау в 1813 году.'
    },
    {
        name: 'Наполеон',
        x: 68, y: 630,
        color: '#555',
        bio: 'Император Франции. Умер в ссылке на острове Святой Елены в 1821 году.'
    }
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawMap();
}

window.addEventListener('resize', resizeCanvas);

// Отслеживание движения мыши
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Проверяем, на какого героя навели
    let newHovered = null;
    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        const scale = Math.max(2, drawWidth / ORIGINAL_WIDTH * 4);
        
        if (mouseX >= x - 25 && mouseX <= x + 25 && mouseY >= y - 30 && mouseY <= y + 30) {
            newHovered = hero;
        }
    });
    
    hoveredHero = newHovered;
});

// Анимация (пульсация)
function animate() {
    time += 0.05;
    drawMap();
    requestAnimationFrame(animate);
}

function toCanvasX(x) {
    return offsetX + (x / ORIGINAL_WIDTH) * drawWidth;
}

function toCanvasY(y) {
    return offsetY + (y / ORIGINAL_HEIGHT) * drawHeight;
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!mapImage.complete || mapImage.naturalWidth === 0) {
        ctx.fillStyle = '#ff6666';
        ctx.font = '16px monospace';
        ctx.fillText('ОШИБКА: Файл map.jpg не найден!', canvas.width/2 - 200, canvas.height/2);
        ctx.fillStyle = '#c99a2e';
        ctx.font = '12px monospace';
        ctx.fillText('Проверь: файл карты должен называться map.jpg', canvas.width/2 - 200, canvas.height/2 + 30);
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

function drawHeroes() {
    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        let scale = Math.max(2, drawWidth / ORIGINAL_WIDTH * 4);
        
        // Анимация: если герой под курсором — увеличивается и пульсирует
        let isHovered = (hoveredHero === hero);
        let animScale = 1;
        
        if (isHovered) {
            // Пульсация: масштаб от 1.1 до 1.3
            animScale = 1.1 + Math.sin(time * 10) * 0.05;
            scale = scale * animScale;
        }
        
        // Тень при наведении
        if (isHovered) {
            ctx.shadowColor = '#ffcc66';
            ctx.shadowBlur = 15;
        } else {
            ctx.shadowColor = '#ffcc66';
            ctx.shadowBlur = 8;
        }

        // ОСНОВНАЯ ИКОНКА (голова)
        ctx.fillStyle = '#ffd39a';
        ctx.fillRect(x - scale, y - scale * 4, scale * 2, scale * 2);
        
        // ТЕЛО
        ctx.fillStyle = hero.color;
        ctx.fillRect(x - scale * 1.5, y - scale * 2, scale * 3, scale * 3);
        
        // ПОЯС / ДЕТАЛЬ
        ctx.fillStyle = '#700';
        ctx.fillRect(x - scale * 2, y - scale * 1.5, scale * 4, scale);
        
        // ОРУЖИЕ / СИМВОЛ
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + scale * 2, y - scale * 2, scale, scale * 4);
        
        // ДОПОЛНИТЕЛЬНЫЙ БЛИК ПРИ НАВЕДЕНИИ
        if (isHovered) {
            ctx.fillStyle = 'rgba(255,255,200,0.6)';
            ctx.fillRect(x - scale * 1.2, y - scale * 3.5, scale * 2.4, scale * 1.2);
        }
        
        ctx.shadowBlur = 0;
        
        // ИМЯ ГЕРОЯ (с лёгкой анимацией при наведении)
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

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    heroes.forEach(hero => {
        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);
        const scale = Math.max(2, drawWidth / ORIGINAL_WIDTH * 4);

        if (mx >= x - 30 && mx <= x + 30 && my >= y - 35 && my <= y + 35) {
            openModal(hero);
        }
    });
});

function openModal(hero) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = hero.name;
    document.getElementById('modalText').textContent = hero.bio;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

mapImage.onload = () => {
    ORIGINAL_WIDTH = mapImage.width;
    ORIGINAL_HEIGHT = mapImage.height;
    resizeCanvas();
    animate(); // Запускаем анимацию
};

mapImage.onerror = () => {
    resizeCanvas();
};

resizeCanvas();
