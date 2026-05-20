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

const heroes = [

{
    name:'Анатоль Курагин',
    x:1004,
    y:414,
    color:'#d13a2f',
    bio:'Ранен под Бородино.'
},

{
    name:'Петя Ростов',
    x:965,
    y:482,
    color:'#ff5555',
    bio:'Погиб под Вязьмой.'
},

{
    name:'Князь Болконский',
    x:1270,
    y:235,
    color:'#992222',
    bio:'Умер в Ярославле.'
},

{
    name:'Элен Безухова',
    x:848,
    y:127,
    color:'#e6b85c',
    bio:'Светская красавица Петербурга.'
},

{
    name:'Михаил Кутузов',
    x:481,
    y:551,
    color:'#c9a227',
    bio:'Умер в Бунцлау.'
},

{
    name:'Наполеон',
    x:68,
    y:630,
    color:'#555',
    bio:'Император Франции.'
}

];

function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawMap();
}

window.addEventListener('resize', resizeCanvas);

function toCanvasX(x){
    return offsetX + (x / ORIGINAL_WIDTH) * drawWidth;
}

function toCanvasY(y){
    return offsetY + (y / ORIGINAL_HEIGHT) * drawHeight;
}

function drawMap(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const imageRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    const canvasRatio = canvas.width / canvas.height;

    if(canvasRatio > imageRatio){

        drawHeight = canvas.height;
        drawWidth = drawHeight * imageRatio;

    }else{

        drawWidth = canvas.width;
        drawHeight = drawWidth / imageRatio;
    }

    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = (canvas.height - drawHeight) / 2;

    ctx.drawImage(
        mapImage,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
    );

    drawHeroes();
}

function drawHeroes(){

    heroes.forEach(hero=>{

        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);

        const scale = Math.max(2, drawWidth / ORIGINAL_WIDTH * 4);

        ctx.shadowColor = '#ffcc66';
        ctx.shadowBlur = 8;

        ctx.fillStyle = '#ffd39a';

        ctx.fillRect(x-scale,y-scale*4,scale*2,scale*2);

        ctx.fillStyle = hero.color;

        ctx.fillRect(x-scale*1.5,y-scale*2,scale*3,scale*3);

        ctx.fillStyle = '#700';

        ctx.fillRect(x-scale*2,y-scale*1.5,scale*4,scale);

        ctx.fillStyle = '#ffd700';

        ctx.fillRect(x+scale*2,y-scale*2,scale,scale*4);

        ctx.shadowBlur = 0;

        ctx.font = '14px Courier New';

        ctx.fillStyle = '#000';

        ctx.fillText(hero.name,x+18,y-10);

        ctx.fillStyle = '#ffe2a0';

        ctx.fillText(hero.name,x+17,y-11);

    });
}

canvas.addEventListener('click',(e)=>{

    const rect = canvas.getBoundingClientRect();

    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    heroes.forEach(hero=>{

        const x = toCanvasX(hero.x);
        const y = toCanvasY(hero.y);

        if(
            mx >= x-20 &&
            mx <= x+20 &&
            my >= y-20 &&
            my <= y+20
        ){
            openModal(hero);
        }

    });

});

function openModal(hero){

    document.getElementById('modal').style.display = 'flex';

    document.getElementById('modalTitle').textContent =
    hero.name;

    document.getElementById('modalText').textContent =
    hero.bio;
}

function closeModal(){

    document.getElementById('modal').style.display = 'none';
}

mapImage.onload = ()=>{

    ORIGINAL_WIDTH = mapImage.width;
    ORIGINAL_HEIGHT = mapImage.height;

    resizeCanvas();
};
