import React, { useEffect } from "react";

// Función throttle para limitar la frecuencia
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

export default function MouseTrail() {
  useEffect(() => {
    const trailContainer = document.createElement("div");
    trailContainer.style.position = "fixed";
    trailContainer.style.top = 0;
    trailContainer.style.left = 0;
    trailContainer.style.width = "100%";
    trailContainer.style.height = "100%";
    trailContainer.style.pointerEvents = "none";
    trailContainer.style.zIndex = 9999;
    document.body.appendChild(trailContainer);

    const config = {
      sparkleLifetime: 1500,
      spawnInterval: 300,
      minDistance: 20, // mínimo de píxeles que debe moverse el mouse para crear otro corazón
    };

    let lastPos = { x: null, y: null };

    const createSparkle = (x, y, color) => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.setProperty("--sparkle-color", color);
      trailContainer.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, config.sparkleLifetime);
    };

    const throttledMouseMove = throttle((e) => {
      const { clientX: x, clientY: y } = e;

      if (
        lastPos.x === null ||
        Math.hypot(x - lastPos.x, y - lastPos.y) >= config.minDistance
      ) {
        const el = document.elementFromPoint(x, y);
        const isPurple = el?.closest(".bg-morado");
        const color = isPurple ? "#ffffff" : "#ff7ea8";

        createSparkle(x, y, color);

        lastPos = { x, y };
      }
    }, config.spawnInterval);

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      trailContainer.remove();
    };
  }, []);


  return null;
}