const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events,
  Composite = Matter.Composite,
  Query = Matter.Query;

const engine = Engine.create({
  positionIterations: 10,
  velocityIterations: 10,
  constraintIterations: 5,
});
engine.gravity.y = 0.3;

const pieceMaterial = {
  friction: 0.3,
  restitution: 0.1,
  frictionStatic: 0.1,
  frictionAir: 0.02,
  slop: 0.05,
  chamfer: { radius: 5 },
};

// Получаем элементы DOM
const gameWrapper = document.getElementById("game-wrapper");
const gameContainer = document.getElementById("game-container");
const gameOverDisplay = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettings = document.querySelector(".close-settings");
const musicToggle = document.getElementById("music-toggle");
const soundEffects = document.getElementById("sound-effects");
const bgMusic = document.getElementById("bg-music");
const collisionSound = document.getElementById("collision-sound");
const explosionSound = document.getElementById("explosion-sound");

bgMusic.volume = 0.3;
collisionSound.volume = 0.2;
explosionSound.volume = 0.3;

const gameWidth = gameWrapper.clientWidth;
const gameHeight = gameWrapper.clientHeight;

const render = Render.create({
  element: gameContainer,
  engine: engine,
  options: {
    width: gameWidth,
    height: gameHeight,
    wireframes: false,
    background: "#19153A",
    showSleeping: true,
    wireframeBackground: "#19153A",
    showStats: false,
    showPerformance: false,
  },
});

function createSimpleStyle(color) {
  return {
    fillStyle: color,
    strokeStyle: color,
    lineWidth: 1,
  };
}

const pieces = [];
const allColors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FF9900", // Orange
  "#9900FF", // Purple
  "#00FF99", // Teal
  "#FF0099", // Pink
  "#99FF00", // Lime
  "#0099FF", // Sky Blue
  "#FF6600", // Dark Orange
  "#6600FF", // Violet
  "#00FF66", // Spring Green
  "#FF0066", // Rose
  "#33FF00", // Bright Green
  "#0033FF", // Royal Blue
  "#FF3300", // Red Orange
  "#3300FF", // Blue Violet
];
const shapes = [
  "circle",
  "square",
  "rectangle",
  "triangle",
  "pentagon",
  "hexagon",
  "trapezoid",
  "rhombus",
  "oval",
];
let colors = [];
let score = 0;
let displayedScore = 0;
let gameActive = true;
let currentPiece = null;
let canSpawnNewPiece = true;
let scoreAnimationFrame;
let pieceInterval;
let checkLinesInterval;
let baseArea = 2000;
let unlockedColors = 4;
let isCheckingLines = false;

// Инициализация цветов
function initColors() {
  colors = allColors.slice(0, unlockedColors);
}

// Проверка и разблокировка новых цветов
function checkColorUnlocks() {
  if (score >= 5 && unlockedColors < 4) {
    unlockedColors = 4;
    initColors();
  } else if (score >= 500 && unlockedColors < 5) {
    unlockedColors = 5;
    initColors();
  } else if (score >= 1000 && unlockedColors < 6) {
    unlockedColors = 6;
    initColors();
  } else if (score >= 1500 && unlockedColors < 7) {
    unlockedColors = 7;
    initColors();
  } else if (score >= 2000 && unlockedColors < 8) {
    unlockedColors = 8;
    initColors();
  } else if (score >= 2500 && unlockedColors < 9) {
    unlockedColors = 9;
    initColors();
  } else if (score >= 3000 && unlockedColors < 10) {
    unlockedColors = 10;
    initColors();
  } else if (score >= 3500 && unlockedColors < 11) {
    unlockedColors = 11;
    initColors();
  } else if (score >= 4000 && unlockedColors < 12) {
    unlockedColors = 12;
    initColors();
  } else if (score >= 4500 && unlockedColors < 13) {
    unlockedColors = 13;
    initColors();
  } else if (score >= 5000 && unlockedColors < 14) {
    unlockedColors = 14;
    initColors();
  } else if (score >= 5500 && unlockedColors < 15) {
    unlockedColors = 15;
    initColors();
  } else if (score >= 6000 && unlockedColors < 16) {
    unlockedColors = 16;
    initColors();
  } else if (score >= 6500 && unlockedColors < 17) {
    unlockedColors = 17;
    initColors();
  } else if (score >= 7000 && unlockedColors < 18) {
    unlockedColors = 18;
    initColors();
  } else if (score >= 7500 && unlockedColors < 19) {
    unlockedColors = 19;
    initColors();
  } else if (score >= 8000 && unlockedColors < 20) {
    unlockedColors = 20;
    initColors();
  }
}

// Создание границ
const ground = Bodies.rectangle(
  gameWidth / 2,
  gameHeight + 50,
  gameWidth,
  100,
  { isStatic: true, render: { fillStyle: "#FF00FF" }, friction: 0.1 }
);

const leftWall = Bodies.rectangle(-50, gameHeight / 2, 100, gameHeight, {
  isStatic: true,
  render: { visible: false },
  friction: 0,
  frictionStatic: 0,
  frictionAir: 0,
});

const rightWall = Bodies.rectangle(
  gameWidth + 50,
  gameHeight / 2,
  100,
  gameHeight,
  {
    isStatic: true,
    render: { visible: false },
    friction: 0,
    frictionStatic: 0,
    frictionAir: 0,
  }
);

// Линия завершения игры (20% от верха)
const gameOverLine = Bodies.rectangle(
  gameWidth / 2,
  gameHeight * 0.2,
  gameWidth,
  2,
  {
    isStatic: true,
    isSensor: true,
    render: { visible: false },
  }
);

World.add(engine.world, [ground, leftWall, rightWall, gameOverLine]);

function animateScore() {
  if (Math.abs(displayedScore - score) < 1) {
    displayedScore = score;
    cancelAnimationFrame(scoreAnimationFrame);
  } else {
    displayedScore += (score - displayedScore) * 0.1;
    scoreAnimationFrame = requestAnimationFrame(animateScore);
  }
  document.getElementById("score").textContent = `SCORE: ${Math.floor(
    displayedScore
  )}`;
  checkColorUnlocks();
}

// Создание эффекта взрыва
function createExplosion(x, y, color) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x - 50}px`;
  explosion.style.top = `${y - 50}px`;
  explosion.style.boxShadow = `0 0 30px ${color}`;
  gameContainer.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 500);
}

// Создание всплывающего текста
function createScorePopup(x, y, points, color) {
  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = `+${points}`;
  popup.style.color = color;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  gameContainer.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

// Создание фигур с одинаковой площадью
function createPiece() {
  if (!gameActive || !canSpawnNewPiece || isCheckingLines) return;

  canSpawnNewPiece = false;
  const x = gameWidth / 2;
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let piece;
  const targetArea = baseArea;

  // Точный расчет размеров для одинаковой площади
  if (shape === "circle") {
    const radius = Math.sqrt(targetArea / Math.PI);
    piece = Bodies.circle(x, 50, radius, {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "square") {
    const side = Math.sqrt(targetArea);
    piece = Bodies.rectangle(x, 50, side, side, {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      chamfer: { radius: 5 },
      sleepThreshold: 10,
    });
  } else if (shape === "rectangle") {
    const width = Math.sqrt(targetArea) * 2;
    const height = targetArea / width;
    piece = Bodies.rectangle(x, 50, width, height, {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      chamfer: { radius: 5 },
      sleepThreshold: 10,
    });
  } else if (shape === "triangle") {
    const side = Math.sqrt((4 * targetArea * 0.8) / Math.sqrt(3));
    piece = Bodies.polygon(x, 50, 3, side / (2 * Math.sin(Math.PI / 3)), {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "pentagon") {
    const side = Math.sqrt((4 * targetArea * Math.tan(Math.PI / 5)) / 5);
    piece = Bodies.polygon(x, 50, 5, side / (2 * Math.sin(Math.PI / 5)), {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "hexagon") {
    const side = Math.sqrt((2 * targetArea) / (3 * Math.sqrt(3)));
    piece = Bodies.polygon(x, 50, 6, side, {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "trapezoid") {
    const width = Math.sqrt(targetArea * 1.5);
    const height = (targetArea / width) * 1.2;
    const vertices = [
      { x: -width / 2, y: -height / 2 },
      { x: width / 2, y: -height / 2 },
      { x: width / 3, y: height / 2 },
      { x: -width / 3, y: height / 2 },
    ];
    piece = Bodies.fromVertices(x, 50, [vertices], {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "rhombus") {
    const width = Math.sqrt(targetArea * 3.5);
    const height = (targetArea / width) * 2;
    const vertices = [
      { x: 0, y: -height / 2 },
      { x: width / 2, y: 0 },
      { x: 0, y: height / 2 },
      { x: -width / 2, y: 0 },
    ];
    piece = Bodies.fromVertices(x, 50, [vertices], {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  } else if (shape === "oval") {
    const width = Math.sqrt(targetArea * 3);
    const height = (targetArea / width) * 1.2;
    const vertices = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      vertices.push({
        x: (width / 2) * Math.cos(angle),
        y: (height / 2) * Math.sin(angle),
      });
    }
    piece = Bodies.fromVertices(x, 50, [vertices], {
      ...pieceMaterial,
      render: createSimpleStyle(color),
      sleepThreshold: 10,
    });
  }

  // Добавляем цвет к объекту фигуры для проверки
  piece.color = color;
  piece.shapeType = shape;

  World.add(engine.world, piece);
  pieces.push(piece);
  currentPiece = piece;

  // Добавляем очки за размещение фигуры
  const placementScore = Math.floor(3 + Math.random() * 5);
  addScore(placementScore, color, x, 50);
}

// Добавление очков с анимацией
function addScore(points, color, x, y) {
  score += points;
  createScorePopup(x, y, points, color);
  animateScore();
}

function checkLines() {
  if (!gameActive || isCheckingLines) return;

  isCheckingLines = true;

  // Группируем фигуры по цветам (исключая текущую фигуру игрока)
  const colorGroups = {};
  const piecesToCheck = pieces.filter((piece) => piece !== currentPiece);

  // Собираем все фигуры одного цвета
  piecesToCheck.forEach((piece) => {
    if (!colorGroups[piece.color]) {
      colorGroups[piece.color] = [];
    }
    colorGroups[piece.color].push(piece);
  });

  // Проверяем каждую группу цветов
  for (const color in colorGroups) {
    const piecesOfColor = colorGroups[color];
    const clusters = [];

    // Находим кластеры близких фигур
    for (let i = 0; i < piecesOfColor.length; i++) {
      const piece = piecesOfColor[i];
      let addedToCluster = false;

      // Проверяем все существующие кластеры
      for (let j = 0; j < clusters.length; j++) {
        const cluster = clusters[j];

        // Проверяем расстояние до каждой фигуры в кластере
        for (let k = 0; k < cluster.length; k++) {
          const clusterPiece = cluster[k];
          const distance = getDistance(piece, clusterPiece);

          // Если расстояние меньше порогового - добавляем в кластер
          if (distance < 50) {
            cluster.push(piece);
            addedToCluster = true;
            break;
          }
        }
        if (addedToCluster) break;
      }

      // Если не добавили ни в один кластер - создаем новый
      if (!addedToCluster) {
        clusters.push([piece]);
      }
    }

    // Проверяем кластеры на размер
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];

      // Если в кластере 5 и более фигур - удаляем
      if (cluster.length >= 5) {
        // Проверяем, не входит ли текущая фигура игрока в кластер
        let playerPieceInCluster = false;
        if (currentPiece) {
          for (const piece of cluster) {
            if (piece === currentPiece) {
              playerPieceInCluster = true;
              break;
            }
          }
        }

        // Если фигура игрока не в кластере, удаляем кластер
        if (!playerPieceInCluster) {
          cluster.forEach((piece) => {
            World.remove(engine.world, piece);
            const index = pieces.indexOf(piece);
            if (index > -1) pieces.splice(index, 1);
          });

          // Добавляем очки за уничтожение кластера
          const clusterScore = cluster.length * 10;
          const centerX =
            cluster.reduce((sum, piece) => sum + piece.position.x, 0) /
            cluster.length;
          const centerY =
            cluster.reduce((sum, piece) => sum + piece.position.y, 0) /
            cluster.length;
          addScore(clusterScore, color, centerX, centerY);

          // Воспроизводим звук взрыва
          if (soundEffects.value === "on") {
            explosionSound.currentTime = 0;
            explosionSound.play();
          }

          // Создаем эффект взрыва
          createExplosion(centerX, centerY, color);
        }
      }
    }
  }

  isCheckingLines = false;
  checkGameOver();
}

// Вспомогательная функция для расчета расстояния между фигурами
function getDistance(pieceA, pieceB) {
  // Для кругов используем радиус
  if (pieceA.circleRadius && pieceB.circleRadius) {
    const dx = pieceA.position.x - pieceB.position.x;
    const dy = pieceA.position.y - pieceB.position.y;
    return (
      Math.sqrt(dx * dx + dy * dy) - pieceA.circleRadius - pieceB.circleRadius
    );
  }

  // Для других фигур используем примерный размер
  const sizeA = pieceA.width || pieceA.circleRadius || 40;
  const sizeB = pieceB.width || pieceB.circleRadius || 40;
  const dx = pieceA.position.x - pieceB.position.x;
  const dy = pieceA.position.y - pieceB.position.y;
  return Math.sqrt(dx * dx + dy * dy) - sizeA / 2 - sizeB / 2;
}

// Проверка завершения игры
function checkGameOver() {
  if (!gameActive) return;

  // Проверяем только статичные фигуры (исключая текущую падающую фигуру)
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    // Игнорируем текущую падающую фигуру
    if (piece === currentPiece) continue;

    // Проверяем, достигла ли фигура линии проигрыша
    if (piece.position.y < gameHeight * 0.2) {
      endGame();
      break;
    }
  }
}

// Завершение игры
function endGame() {
  gameActive = false;
  gameOverDisplay.style.display = "block";
  restartBtn.style.display = "block";
  clearInterval(pieceInterval);
  clearInterval(checkLinesInterval);
}

// Перезапуск игры
function restartGame() {
  // Удаляем все фигуры
  Composite.clear(engine.world, false);
  pieces.length = 0;

  // Восстанавливаем границы
  World.add(engine.world, [ground, leftWall, rightWall, gameOverLine]);

  // Сбрасываем счет
  score = 0;
  displayedScore = 0;
  unlockedColors = 3;
  document.getElementById("score").textContent = `SCORE: ${score}`;

  // Скрываем сообщения
  gameOverDisplay.style.display = "none";
  restartBtn.style.display = "none";

  // Запускаем игру
  gameActive = true;
  currentPiece = null;
  canSpawnNewPiece = true;

  // Обновляем настройки
  initColors();

  // Перезапускаем интервалы
  clearInterval(pieceInterval);
  clearInterval(checkLinesInterval);
  pieceInterval = setInterval(() => {
    if (canSpawnNewPiece) {
      createPiece();
    }
  }, 1000);
  checkLinesInterval = setInterval(checkLines, 100);
}

// Управление с клавиатуры
document.addEventListener("keydown", (e) => {
  if (!gameActive || !currentPiece) return;

  if (e.key === "ArrowLeft") {
    Body.setVelocity(currentPiece, { x: -5, y: currentPiece.velocity.y });
  } else if (e.key === "ArrowRight") {
    Body.setVelocity(currentPiece, { x: 5, y: currentPiece.velocity.y });
  } else if (e.key === "ArrowUp") {
    Body.setAngularVelocity(currentPiece, 0.05);
  } else if (e.key === "ArrowDown") {
    Body.setAngularVelocity(currentPiece, -0.05);
  }
});

// Управление касанием для мобильных устройств
gameContainer.addEventListener("touchstart", (e) => {
  if (!gameActive || !currentPiece) return;

  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
});

gameContainer.addEventListener("touchmove", (e) => {
  if (!gameActive || !currentPiece) return;

  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const diffX = touchX - touchStartX;
  const diffY = touchY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Горизонтальный свайп - движение влево/вправо
    Body.setVelocity(currentPiece, {
      x: diffX * 0.2,
      y: currentPiece.velocity.y,
    });
  } else {
    // Вертикальный свайп - вращение
    Body.setAngularVelocity(currentPiece, diffY * 0.002);
  }

  touchStartX = touchX;
  touchStartY = touchY;
  e.preventDefault();
});

// Обработчик столкновений
Events.on(engine, "collisionStart", (event) => {
  if (!gameActive || isCheckingLines) return;

  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    // Если текущая фигура коснулась земли или другой фигуры
    if (
      (pair.bodyA === currentPiece || pair.bodyB === currentPiece) &&
      (pair.bodyA === ground ||
        pair.bodyB === ground ||
        (pieces.includes(pair.bodyA) && pieces.includes(pair.bodyB)))
    ) {
      // Воспроизводим звук столкновения
      if (soundEffects.value === "on") {
        collisionSound.currentTime = 0;
        collisionSound.play();
      }

      // Добавляем очки за столкновение
      const collisionScore = Math.floor(3 + Math.random() * 5);
      addScore(
        collisionScore,
        currentPiece.color,
        currentPiece.position.x,
        currentPiece.position.y
      );

      currentPiece = null;

      // Задержка перед разрешением спавна новой фигуры
      setTimeout(() => {
        canSpawnNewPiece = true;
      }, 100);

      break;
    }
  }
});

// Кнопка перезапуска
restartBtn.addEventListener("click", restartGame);

// Кнопка настроек
settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = "block";
});

// Закрытие настроек
closeSettings.addEventListener("click", () => {
  settingsPanel.style.display = "none";
});

// Управление музыкой
musicToggle.addEventListener("change", () => {
  if (musicToggle.value === "on") {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
});

// Запуск игры
function startGame() {
  initColors();

  if (musicToggle.value === "on") {
    bgMusic.play();
  }

  Engine.run(engine);
  Render.run(render);

  // Новая фигура каждые 1 секунду
  pieceInterval = setInterval(() => {
    if (canSpawnNewPiece) {
      createPiece();
    }
  }, 1000);

  // Проверка линий каждые 100 мс
  checkLinesInterval = setInterval(checkLines, 100);
}

// Обработчик изменения размера окна
window.addEventListener("resize", () => {
  render.options.width = gameWrapper.clientWidth;
  render.options.height = gameWrapper.clientHeight;
  Render.setPixelRatio(render, window.devicePixelRatio);
});

// Старт игры
startGame();
