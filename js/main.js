"use strict";
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  if (
    window.navigator.standalone === false ||
    window.matchMedia("(display-mode: browser)").matches
  ) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }
}
window.addEventListener("load", () => {
  const title = document.getElementById("title");
  const text = "GLOW FLOW";

  text.split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "" : letter;
    span.style.animationDelay = `${i * 0.1}s`;
    title.appendChild(span);
  });

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const piece = createPiece();
      if (piece) pieces.push(piece);
    }, i * 1000);
  }
  gameLoop();
});

if (typeof Matter === "undefined") {
  document.getElementById("menu-container").innerHTML =
    '<h1 style="color:red">Error: Physics engine failed to load</h1>';
  throw new Error("Matter.js not loaded");
}
const { Engine, Render, World, Bodies, Vertices, Composite, Runner } = Matter;

const physicsContainer = document.getElementById("physics-container");
if (!physicsContainer) {
  document.getElementById("menu-container").innerHTML =
    '<h1 style="color:red">Error: Physics container not found</h1>';
  throw new Error("Physics container not found");
}

const engine = Matter.Engine.create({
  enableSleeping: true,
  gravity: { x: 0, y: 0.03 },
});

const pieceMaterial = {
  friction: 1,
  restitution: 1,
  density: 1,
  render: {
    strokeStyle: "#FFFFFF",
    lineWidth: 3,
  },
};

const config = {
  targetFPS: 30,
  gravity: 0.1,
  baseArea: 1500,
  triggerYPosition: window.innerHeight * 0.3,
  spawnDelay: 50,
};

let pieces = [];
let canSpawn = true;

const render = Matter.Render.create({
  element: physicsContainer,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "#302b63",
    showSleeping: false,
  },
});

Matter.Render.run(render);

const wallOptions = { isStatic: true, render: { visible: false } };
const leftWall = Matter.Bodies.rectangle(
  -50,
  window.innerHeight / 2,
  100,
  window.innerHeight * 2,
  wallOptions
);
const rightWall = Matter.Bodies.rectangle(
  window.innerWidth + 50,
  window.innerHeight / 2,
  100,
  window.innerHeight * 2,
  wallOptions
);
Matter.World.add(engine.world, [leftWall, rightWall]);

const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

const colors = [
  "#FE0000",
  "#3FFF0F",
  "#005DFF",
  "#F5FF00",
  "#FF009C",
  "#01FFE5",
  "#FF9C00",
  "#C500FF",
  "#960000",
  "#259609",
  "#00389C",
  "#999E00",
  "#99005E",
  "#019C8C",
  "#965C00",
  "#770099",
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

function vibrate(pattern = 15) {
  if (localStorage.getItem("vibrationEnabled") === "false") return;
  if (!("vibrate" in navigator)) return;

  try {
    if (typeof navigator.vibrate !== "function") return;

    if (typeof pattern === "number" && pattern <= 50) {
      navigator.vibrate(pattern).catch(() => {});
    } else if (Array.isArray(pattern)) {
      navigator.vibrate(pattern).catch(() => {});
    }
  } catch (e) {
    console.debug("Vibration not supported", e);
  }
}

function createPiece() {
  const x = Math.random() * window.innerWidth;
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const targetArea = 1500;

  let piece;

  if (shape === "circle") {
    const radius = Math.sqrt(targetArea / Math.PI);
    piece = Matter.Bodies.circle(x, -radius, radius, {
      ...pieceMaterial,
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  } else if (shape === "square") {
    const side = Math.sqrt(targetArea);
    piece = Matter.Bodies.rectangle(x, -side / 2, side, side, {
      ...pieceMaterial,
      chamfer: { radius: 5 },
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  } else if (shape === "rectangle") {
    const width = Math.sqrt(targetArea) * 2;
    const height = targetArea / width;
    piece = Matter.Bodies.rectangle(x, -height / 2, width, height, {
      ...pieceMaterial,
      chamfer: { radius: 5 },
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  } else if (shape === "triangle") {
    const side = Math.sqrt((4 * targetArea * 0.8) / Math.sqrt(3));
    piece = Matter.Bodies.polygon(
      x,
      -side / 2,
      3,
      side / (2 * Math.sin(Math.PI / 3)),
      {
        ...pieceMaterial,
        render: { ...pieceMaterial.render, fillStyle: color },
      }
    );
  } else if (shape === "pentagon") {
    const side = Math.sqrt((4 * targetArea * Math.tan(Math.PI / 5)) / 5);
    piece = Matter.Bodies.polygon(
      x,
      -side / 2,
      5,
      side / (2 * Math.sin(Math.PI / 5)),
      {
        ...pieceMaterial,
        render: { ...pieceMaterial.render, fillStyle: color },
      }
    );
  } else if (shape === "hexagon") {
    const side = Math.sqrt((2 * targetArea) / (3 * Math.sqrt(3)));
    piece = Matter.Bodies.polygon(x, -side / 2, 6, side, {
      ...pieceMaterial,
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  } else if (shape === "trapezoid") {
    const width = Math.sqrt(targetArea * 1.5);
    const height = (targetArea / width) * 1.2;
    const vertices = Matter.Vertices.fromPath("-50 -25, 50 -25, 30 25, -30 25");
    Vertices.scale(vertices, width / 100, height / 50);
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  } else if (shape === "rhombus") {
    const width = Math.sqrt(targetArea * 3.5);
    const height = (targetArea / width) * 2;
    const vertices = Matter.Vertices.fromPath("0 -50, 50 0, 0 50, -50 0");
    Vertices.scale(vertices, width / 100, height / 100);
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: { ...pieceMaterial.render, fillStyle: color },
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
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: { ...pieceMaterial.render, fillStyle: color },
    });
  }

  Matter.Body.setAngularVelocity(piece, (Math.random() - 0.5) * 0.05);
  Matter.Body.setVelocity(piece, {
    x: (Math.random() - 0.5) * 2,
    y: 0.5 + Math.random() * 0.5,
  });

  Matter.World.add(engine.world, piece);
  return piece;
}

function gameLoop() {
  Matter.Engine.update(engine, 1000 / 30);
  updatePieces();
  requestAnimationFrame(gameLoop);
}

function updatePieces() {
  pieces = pieces.filter((piece) => {
    if (piece.position.y > window.innerHeight + 100) {
      Matter.Composite.remove(engine.world, piece);
      return false;
    }
    return true;
  });

  if (pieces.some((p) => p.position.y >= config.triggerYPosition) && canSpawn) {
    canSpawn = false;
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        const piece = createPiece();
        if (piece) pieces.push(piece);
      }
      canSpawn = true;
    }, 1000);
  }
}

function spawnNewPieces() {
  pieces = pieces.filter((piece) => {
    if (piece.position.y > window.innerHeight + 100) {
      if (Matter.Composite.get(engine.world, piece.id)) {
        Matter.Composite.remove(engine.world, piece);
      }
      return false;
    }
    return true;
  });
  if (pieces.length < 3) {
    const countToCreate = 3 - pieces.length;
    const startX = window.innerWidth * 0.1;
    const stepX = window.innerWidth * 0.2;

    for (let i = 0; i < countToCreate; i++) {
      setTimeout(() => {
        const piece = createPiece(startX + stepX * (i % 5));
        if (piece) {
          pieces.push(piece);
        }
      }, i * 200);
    }
  }
}

window.addEventListener("load", () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const piece = createPiece();
      if (piece) pieces.push(piece);
    }, i * 200);
  }
  gameLoop();
});

document.getElementById("play-btn").addEventListener("click", () => {
  window.location.href = "html/game.html";
});

document.getElementById("stats-btn").addEventListener("click", () => {
  window.location.href = "html/statistics.html";
});

document.getElementById("settings-btn").addEventListener("click", () => {
  window.location.href = "html/settings.html";
});

window.addEventListener("resize", () => {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  Matter.Body.setPosition(leftWall, {
    x: -50,
    y: window.innerHeight / 2,
  });
  Matter.Body.setPosition(rightWall, {
    x: window.innerWidth + 50,
    y: window.innerHeight / 2,
  });
});
window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);

  if (
    window.navigator.standalone ||
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("ServiceWorker registered", reg))
    .catch((err) => console.log("ServiceWorker not registered", err));
}

window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
});
