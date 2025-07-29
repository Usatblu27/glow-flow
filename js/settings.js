"use strict";
// Uses Matter.js (https://brm.io/matter-js/)
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

if (
  window.innerWidth > 768 &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  window.location.href = window.location.href;
}

let duration = 15;

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

document.addEventListener("DOMContentLoaded", function () {
  const musicVolume = localStorage.getItem("musicVolume") || 50;
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  const vibrationEnabled = localStorage.getItem("vibrationEnabled") !== "false";

  document.getElementById("music-volume").value = musicVolume;
  document.getElementById("volume-value").textContent = `${musicVolume}%`;
  document.getElementById("sound-toggle").checked = soundEnabled;
  document.getElementById("vibration-toggle").checked = vibrationEnabled;

  document
    .getElementById("music-volume")
    .addEventListener("input", function () {
      document.getElementById("volume-value").textContent = `${this.value}%`;
    });

  document.getElementById("save-btn").addEventListener("click", function () {
    const musicVolume = document.getElementById("music-volume").value;
    const soundEnabled = document.getElementById("sound-toggle").checked;
    const vibrationEnabled =
      document.getElementById("vibration-toggle").checked;

    localStorage.setItem("musicVolume", musicVolume);
    localStorage.setItem("soundEnabled", soundEnabled);
    localStorage.setItem("vibrationEnabled", vibrationEnabled);
    localStorage.setItem("soundEffectsSetting", soundEnabled ? "on" : "off");
    localStorage.setItem("vibrationSetting", vibrationEnabled ? "on" : "off");
    localStorage.setItem("musicSetting", musicVolume > 0 ? "on" : "off");

    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
      bgMusic.volume = musicVolume / 100;
      if (musicVolume > 0) {
        bgMusic.play().catch((e) => console.log("Music play prevented:", e));
      }
    }

    window.history.back();
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
