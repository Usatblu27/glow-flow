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
let duration = 15;

function vibrateButton(duration = 15) {
  if (
    localStorage.getItem("vibrationEnabled") !== "false" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(duration);
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
