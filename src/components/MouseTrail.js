
// export default function MouseTrail() {
//   useEffect(() => {
//     const trailContainer = document.createElement("div");
//     trailContainer.style.position = "fixed";
//     trailContainer.style.top = 0;
//     trailContainer.style.left = 0;
//     trailContainer.style.width = "100%";
//     trailContainer.style.height = "100%";
//     trailContainer.style.pointerEvents = "none";
//     trailContainer.style.zIndex = 9999;
//     document.body.appendChild(trailContainer);

//     const config = {
//       sparkleLifetime: 1500, // Tiempo de vida en ms (1.5 segundos)
//       spawnProbability: 0.4, // Probabilidad de que aparezca un sparkle (70%)
//       spawnFrequency: 1, // Cada cuántos eventos crear un sparkle (1 = cada vez)
//     };

//     let moveCount = 0;

//     const createSparkle = (x, y) => {
//       const sparkle = document.createElement("div");
//       sparkle.className = "sparkle";
//       sparkle.style.left = `${x}px`;
//       sparkle.style.top = `${y}px`;
//       sparkle.innerHTML = "♥";
//       trailContainer.appendChild(sparkle);

//       setTimeout(() => {
//         sparkle.remove();
//       }, config.sparkleLifetime);
//     };

//     const handleMouseMove = (e) => {
//       const el = document.elementFromPoint(e.clientX, e.clientY);
//       const isPurple = el?.closest(".bg-morado"); // ✅ Clase auxiliar válida
//       const color = isPurple ? "#ffffff" : "#c798c8"; // blanco sobre fondo morado, morado sobre fondo blanco

//       createSparkle(e.clientX, e.clientY, color);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return null;
// }


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

    // Configuración
    const config = {
      sparkleLifetime: 1500, // Tiempo de vida (ms)
      spawnInterval: 100, // Cada cuántos ms aparece un sparkle (¡ajusta aquí!)
    };

    const createSparkle = (x, y, color) => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.color = color; // Usamos color en lugar de backgroundColor
      sparkle.innerHTML = "♥";
      trailContainer.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, config.sparkleLifetime);
    };

    // Función throttled
    const throttledMouseMove = throttle((e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isPurple = el?.closest(".bg-morado");
      const color = isPurple ? "#ffffff" : "#c798c8";
      createSparkle(e.clientX, e.clientY, color);
    }, config.spawnInterval);

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      trailContainer.remove();
    };
  }, []);

  return null;
}