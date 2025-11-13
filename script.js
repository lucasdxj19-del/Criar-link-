const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sons
const shootSound = new Audio('https://freesound.org/data/previews/66/66717_931655-lq.mp3'); // tiro
const hitSound = new Audio('https://freesound.org/data/previews/174/174027_3242494-lq.mp3'); // acerto

let targetColor = 'red';
let difficulty = 'facil';
let targetRadius = 30;
let targetX = Math.random() * (canvas.width - 60) + 30;
let targetY = Math.random() * (canvas.height - 60) + 30;
let score = 0;
let time = 30; 
let interval;
let movingSpeed = 0;

function drawTarget() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
  ctx.fillStyle = targetColor;
  ctx.fill();
  ctx.closePath();
}

function setTargetColor(color) {
  targetColor = color;
  drawTarget();
}

function setDifficulty(level) {
  difficulty = level;
  switch(level) {
    case 'facil':
      targetRadius = 50;
      movingSpeed = 0;
      break;
    case 'medio':
      targetRadius = 35;
      movingSpeed = 1;
      break;
    case 'dificil':
      targetRadius = 25;
      movingSpeed = 2;
      break;
    case 'superDificil':
      targetRadius = 15;
      movingSpeed = 3;
      break;
  }
  drawTarget();
}

canvas.addEventListener('click', function(event) {
  shootSound.currentTime = 0;
  shootSound.play();

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const distance = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));

  if(distance <= targetRadius) {
    score++;
    document.getElementById('score').innerText = `Pontuação: ${score}`;
    
    hitSound.currentTime = 0;
    hitSound.play();

    ctx.beginPath();
    ctx.arc(clickX, clickY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.closePath();
    setTimeout(drawTarget, 100);

    targetX = Math.random() * (canvas.width - 60) + 30;
    targetY = Math.random() * (canvas.height - 60) + 30;

    if(difficulty !== 'facil') movingSpeed += 0.1;

    time += 2;
    if(time > 30) time = 30;
    document.getElementById('timer').innerText = `Tempo: ${time}s`;

    drawTarget();
  }
});

function moveTarget() {
  if(movingSpeed > 0){
    targetX += (Math.random() - 0.5) * movingSpeed * 4;
    targetY += (Math.random() - 0.5) * movingSpeed * 4;
    if(targetX < targetRadius) targetX = targetRadius;
    if(targetX > canvas.width - targetRadius) targetX = canvas.width - targetRadius;
    if(targetY < targetRadius) targetY = targetRadius;
    if(targetY > canvas.height - targetRadius) targetY = canvas.height - targetRadius;
    drawTarget();
  }
  requestAnimationFrame(moveTarget);
}

function startGame() {
  score = 0;
  time = 30;
  document.getElementById('score').innerText = `Pontuação: ${score}`;
  document.getElementById('timer').innerText = `Tempo: ${time}s`;
  if(interval) clearInterval(interval);
  interval = setInterval(() => {
    time--;
    document.getElementById('timer').innerText = `Tempo: ${time}s`;
    if(time <= 0){
      clearInterval(interval);
      alert(`Fim de jogo! Sua pontuação foi: ${score}`);
      score = 0;
      time = 30;
      movingSpeed = 0;
      setDifficulty(difficulty);
    }
  }, 1000);
}

// Inicialização
setDifficulty('facil');
drawTarget();
moveTarget();
startGame();