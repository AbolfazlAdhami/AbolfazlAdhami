// docs/snake.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('start');
const speedRange = document.getElementById('speed');

const CELL = 20;
let cols, rows;
let snake, dir, food, running, score, best;

function reset() {
  cols = Math.floor(canvas.width / CELL);
  rows = Math.floor(canvas.height / CELL);
  snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  dir = {x:1, y:0};
  placeFood();
  score = 0;
  running = false;
  best = Number(localStorage.getItem('snake-best') || 0);
  bestEl.textContent = best;
  scoreEl.textContent = score;
}

function placeFood(){
  let ok=false;
  while(!ok){
    food = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
    ok = !snake.some(s => s.x===food.x && s.y===food.y);
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#061025';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#ffd166';
  roundRect(ctx, food.x*CELL, food.y*CELL, CELL, CELL, 4);
  ctx.fill();

  ctx.fillStyle = '#80ffdb';
  snake.forEach((s, i) => {
    roundRect(ctx, s.x*CELL, s.y*CELL, CELL, CELL, 4);
    ctx.fill();
  });
}

function step(){
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  if(head.x < 0) head.x = cols-1;
  if(head.y < 0) head.y = rows-1;
  if(head.x >= cols) head.x = 0;
  if(head.y >= rows) head.y = 0;

  if(snake.some(s => s.x===head.x && s.y===head.y)){
    running = false;
    if(score > best){
      best = score; localStorage.setItem('snake-best', best);
      bestEl.textContent = best;
    }
    return;
  }

  snake.unshift(head);
  if(head.x===food.x && head.y===food.y){
    score += 1; scoreEl.textContent = score; placeFood();
  } else {
    snake.pop();
  }
}

function gameLoop(){
  if(running){
    step();
    draw();
  }
}

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

window.addEventListener('keydown', e => {
  const k = e.key;
  if(k==='ArrowUp' && dir.y!==1) dir = {x:0,y:-1};
  if(k==='ArrowDown' && dir.y!==-1) dir = {x:0,y:1};
  if(k==='ArrowLeft' && dir.x!==1) dir = {x:-1,y:0};
  if(k==='ArrowRight' && dir.x!==-1) dir = {x:1,y:0};
  if(k===' '){ running = !running; }
});

startBtn.addEventListener('click', ()=>{ reset(); running = true; });

speedRange.addEventListener('input', ()=>{
  clearInterval(loopId);
  loopId = setInterval(gameLoop, 1000 / Number(speedRange.value));
});

canvas.addEventListener('click', ()=> canvas.focus());

reset();
let loopId = setInterval(gameLoop, 1000 / Number(speedRange.value));

draw();
