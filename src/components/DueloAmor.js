import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DueloAmor.css';

const DueloAmor = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [character, setCharacter] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [targetPosition, setTargetPosition] = useState({ x: '50%', y: '20%' });

  const gameAreaRef = useRef(null);
  const targetRef = useRef(null);
  const playerRef = useRef(null);
  const shotsRef = useRef([]);
  const enemyShotsRef = useRef([]);
  const lastEnemyShotTime = useRef(0);
  const moveTargetInterval = useRef(null);

  const characters = [
    { id: 1, name: "Novio", emoji: "🤵", shotEmoji: "💘" },
    { id: 2, name: "Novia", emoji: "👰", shotEmoji: "💝" }
  ];

  const startGame = (selectedCharacter) => {
    setCharacter(selectedCharacter);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setPlayerHealth(100);
    setPlayerPosition(50);
    setTargetPosition({ x: '50%', y: '20%' });
    shotsRef.current = [];
    enemyShotsRef.current = [];
    startTargetMovement();
  };

  const startTargetMovement = () => {
    if (moveTargetInterval.current) {
      clearInterval(moveTargetInterval.current);
    }

    const getRandomPosition = () => {
      if (!gameAreaRef.current) return { x: '50%', y: '20%' };
      const area = gameAreaRef.current.getBoundingClientRect();
      const margin = 50;
      const minX = margin;
      const maxX = area.width - margin;
      const minY = margin;
      const maxY = (area.height * 0.7) - margin;

      return {
        x: `${(Math.random() * (maxX - minX) + minX) / area.width * 100}%`,
        y: `${(Math.random() * (maxY - minY) + minY) / area.height * 100}%`,
        transition: `all ${2000 + Math.random() * 2000}ms cubic-bezier(0.4, 0, 0.2, 1)`
      };
    };

    setTargetPosition(getRandomPosition());
    moveTargetInterval.current = setInterval(() => {
      setTargetPosition(getRandomPosition());
    }, 2500);
  };

  const movePlayer = (direction) => {
    if (!gameStarted || timeLeft <= 0 || playerHealth <= 0) return;
    setPlayerPosition(prev => {
      const newPosition = prev + (direction === 'left' ? -10 : 10);
      return Math.max(5, Math.min(95, newPosition));
    });
  };

  const createImpactEffect = (element, isPlayer) => {
    if (!element || !gameAreaRef.current) return;
    const rect = element.getBoundingClientRect();
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - gameRect.left;
    const y = rect.top + rect.height / 2 - gameRect.top;
    const effect = document.createElement('div');
    effect.className = `impact-effect ${isPlayer ? 'player-hit' : 'enemy-hit'}`;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    gameAreaRef.current.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
  };

  const handleShoot = (e) => {
    if (!gameStarted || timeLeft <= 0 || playerHealth <= 0) return;
    if (e.target.closest('.control-button')) return;

    const gameArea = gameAreaRef.current;
    const gameRect = gameArea.getBoundingClientRect();
    const playerRect = playerRef.current?.getBoundingClientRect();
    if (!playerRect) return;

    const startX = playerRect.left + playerRect.width / 2 - gameRect.left;
    const startY = playerRect.top - gameRect.top;
    const clickX = e.clientX - gameRect.left;
    const clickY = e.clientY - gameRect.top;
    const distance = Math.sqrt((clickX - startX) ** 2 + (clickY - startY) ** 2);
    const duration = 1000 + Math.min(1000, distance / 3);

    const shot = document.createElement('div');
    shot.className = 'heart-shot player-shot';
    shot.innerHTML = character?.shotEmoji || '❤️';
    shot.style.left = `${startX - 16}px`;
    shot.style.top = `${startY}px`;
    shot.style.transition = `transform ${duration}ms linear`;

    gameArea.appendChild(shot);

    const moveX = clickX - startX;
    const moveY = clickY - startY;

    setTimeout(() => {
      shot.style.transform = `translate(${moveX}px, ${moveY}px)`;
      const checkCollision = setInterval(() => {
        const shotRect = shot.getBoundingClientRect();
        const targetRect = targetRef.current?.getBoundingClientRect();
        if (targetRect && isColliding(shotRect, targetRect)) {
          clearInterval(checkCollision);
          setScore(prev => prev + 10);
          createImpactEffect(targetRef.current, false);
          shot.remove();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkCollision);
        shot.remove();
      }, duration);
    }, 10);
  };

  const enemyShoot = useCallback(() => {
    if (!gameStarted || timeLeft <= 0 || playerHealth <= 0) return;
    const now = Date.now();
    if (now - lastEnemyShotTime.current < 2000) return;
    lastEnemyShotTime.current = now;

    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const targetRect = targetRef.current?.getBoundingClientRect();
    const playerRect = playerRef.current?.getBoundingClientRect();
    if (!targetRect || !playerRect) return;

    const startX = targetRect.left + targetRect.width / 2 - gameRect.left;
    const startY = targetRect.top + targetRect.height / 2 - gameRect.top;
    const destX = playerRect.left + playerRect.width / 2 - gameRect.left;
    const destY = playerRect.top + playerRect.height / 2 - gameRect.top;

    const distance = Math.sqrt((destX - startX) ** 2 + (destY - startY) ** 2);
    const duration = 1000 + Math.min(1000, distance / 3);

    const shot = document.createElement('div');
    shot.className = 'heart-shot enemy-shot';
    shot.innerHTML = character?.id === 1 ? '💝' : '💘';
    shot.style.left = `${startX - 16}px`;
    shot.style.top = `${startY}px`;
    shot.style.transition = `transform ${duration}ms linear`;

    gameAreaRef.current.appendChild(shot);

    const moveX = destX - startX;
    const moveY = destY - startY;

    setTimeout(() => {
      shot.style.transform = `translate(${moveX}px, ${moveY}px)`;
      const checkCollision = setInterval(() => {
        const shotRect = shot.getBoundingClientRect();
        const currentPlayerRect = playerRef.current?.getBoundingClientRect();
        if (currentPlayerRect && isColliding(shotRect, currentPlayerRect)) {
          clearInterval(checkCollision);
          setPlayerHealth(prev => Math.max(0, prev - 10));
          createImpactEffect(playerRef.current, true);
          shot.remove();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkCollision);
        shot.remove();
      }, duration);
    }, 10);
  }, [character?.id, gameStarted, playerHealth, timeLeft]);

  const isColliding = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  };

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || playerHealth <= 0) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        enemyShoot();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, playerHealth, enemyShoot]);

  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 || playerHealth <= 0) {
          clearInterval(timer);
          if (moveTargetInterval.current) clearInterval(moveTargetInterval.current);
          setGameOver(true);
          //setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, playerHealth]);

  useEffect(() => {
    console.log("Estado gameOver actualizado:", gameOver);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) saveScore();
  }, [gameOver]);

  const saveScore = () => {
    if (score > 0) {
      const newHighScores = [...highScores, { name: "Invitado", score }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      setHighScores(newHighScores);
    }
  };

  return (
    <div className="bg-[#c798c8] min-h-screen flex flex-col items-center justify-start pt-16 pb-8 px-4">
      <h2 className="font-alexbrush font-semibold text-[#4c044d] text-4xl md:text-5xl text-center mb-4 md:mb-8">Duelo de Amor</h2>
      <div className="w-full max-w-4xl flex-grow flex flex-col">
        {gameOver ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="font-roboto game-over-container text-center p-6 text-[#4c044d] rounded-lg mb-6 ">
              <h3 className="text-2xl font-bold mb-2">
                {playerHealth <= 0 ? '¡Has perdido!' : '¡Juego terminado!'}
              </h3>
              <p className="mb-4 text-lg">Tu puntuación final: <span className="font-bold">{score}</span></p>
              <button
                className="mt-4 px-6 py-2 bg-[#4c044d] text-white rounded-lg hover:bg-[#c798c8] transition-colors"
                onClick={() => {
                  setGameOver(false);
                  setGameStarted(false);
                  setCharacter(null);
                }}
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        ) : gameStarted ? (
            <>
              {/* //sm:w-[90vh] sm:h-[90vh] sm:w-[80vh] w-[70vh] w-[90vh] */}
              <div className="flex-grow flex flex-col">
              {/* Game Info - Barra superior */}
              <div className="flex justify-between mb-4 p-2 bg-[#c798c8] rounded-t-lg font-bold ">
                <div>Tiempo: {timeLeft}s</div>
                <div>Puntuación: {score}</div>
                <div className="flex items-center">
                  Salud:
                  <div className="w-24 h-4 bg-gray-200 rounded-full ml-2 inline-block">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${playerHealth}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Game Container */}
              <div className="w-full flex flex-col rounded-lg overflow-hidden shadow-md">
                {/* Game Area */}
                <div
                  ref={gameAreaRef}
                  className="relative w-full h-80 bg-[#eac7eb] border-2 border-[#4c044d] border-b-0 overflow-hidden"
                  onClick={handleShoot}
                >
                  {character && (
                    <div
                      ref={playerRef}
                      className="absolute text-5xl z-10 pointer-events-none transition-[left] duration-200 ease-out bottom-0 -translate-x-1/2"
                      style={{ left: `${playerPosition}%` }}
                    >
                      {playerHealth > 0 ? character.emoji : '💀'}
                    </div>
                  )}

                  <div
                    ref={targetRef}
                    className="absolute text-5xl z-5 pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    style={{
                      left: targetPosition.x,
                      top: targetPosition.y,
                      transition: targetPosition.transition
                    }}
                  >
                    {character?.id === 1 ? '👰' : '🤵'}
                  </div>
                </div>

                {/* Safe Area (Controles) */}
                <div className="w-full h-20 flex items-center justify-center">
                  <div className="flex gap-8 pointer-events-auto">
                    <button
                      className="w-14 h-14 rounded-full bg-[#c798c8] text-white text-3xl flex items-center justify-center border-none shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#4c044d] hover:scale-110 active:scale-95 select-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePlayer('left');
                      }}
                    >
                      ←
                    </button>
                    <button
                      className="w-14 h-14 rounded-full bg-[#c798c8] text-white text-3xl flex items-center justify-center border-none shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#4c044d] hover:scale-110 active:scale-95 select-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePlayer('right');
                      }}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="character-selection text-center">
              <h3 className="text-xl mb-4">Elige tu personaje:</h3>
              <div className="flex justify-center gap-8">
                {characters.map(char => (
                  <div
                    key={char.id}
                    className="character-card cursor-pointer p-4 rounded-lg hover:bg-pink-200 transition"
                    onClick={() => startGame(char)}
                  >
                    <div className="text-6xl mb-2">{char.emoji}</div>
                    <p>{char.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="font-roboto p-8 bg-white m-4 rounded-xl shadow-md w-[80%] md:w-[60%] mx-auto">
        <h3 className="text-xl font-semibold mb-2 text-[#4c044d]">Mejores Puntuaciones</h3>
        {highScores.length > 0 ? (
          <ul className="divide-y divide-pink-200">
            {highScores.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{item.name}</span>
                <span>{item.score} puntos</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay puntuaciones aún</p>
        )}
      </div>
    </div>
  );
};

export default DueloAmor;
