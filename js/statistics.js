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
function vibrateButton(duration = 15) {
  if (
    localStorage.getItem("vibrationEnabled") !== "false" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(duration);
  }
}

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => vibrateButton());
  button.addEventListener("touchstart", () => vibrateButton(10));
});

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours}h ${minutes}m ${secs}s`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("high-score").textContent =
    localStorage.getItem("bestScore") || "0";

  document.getElementById("total-games").textContent =
    localStorage.getItem("totalGames") || "0";

  document.getElementById("total-shapes").textContent =
    localStorage.getItem("totalShapes") || "0";

  document.getElementById("total-time").textContent = formatTime(
    parseInt(localStorage.getItem("totalPlayTime")) || "0"
  );
  document.getElementById("highest-combo").textContent =
    localStorage.getItem("highestCombo") || "0";

  document.getElementById("figures-cleared").textContent =
    localStorage.getItem("figuresCleared") || "0";

  document.getElementById("last-score").textContent =
    localStorage.getItem("lastScore") || "0";
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
