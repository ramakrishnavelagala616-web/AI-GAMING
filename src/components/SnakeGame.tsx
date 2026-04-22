import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Trophy, RefreshCcw } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const directionRef = useRef<Direction>('UP');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setDirection('UP');
    directionRef.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (directionRef.current !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const speed = Math.max(50, INITIAL_SPEED - (Math.floor(score / 50) * SPEED_INCREMENT));
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, isPaused, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-center mb-2 px-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-cyan" />
          <span className="font-mono text-xl text-neon-cyan neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-xs uppercase tracking-widest opacity-40 font-mono">
          High: {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="relative glass-panel p-2 neon-shadow-cyan border-neon-cyan/20">
        {/* Game Grid */}
        <div 
          className="relative bg-black/40 border border-white/5 rounded overflow-hidden"
          style={{ 
            width: GRID_SIZE * 20, 
            height: GRID_SIZE * 20,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Scanline effect */}
          <div className="scanline" />
          
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-20 opacity-5 pointer-events-none">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <div key={i} className="border-r border-white" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-20 opacity-5 pointer-events-none">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <div key={i} className="border-b border-white" />
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${segment.x}-${segment.y}-${i}`}
              className={`absolute rounded-sm ${i === 0 ? 'bg-neon-cyan z-10 shadow-[0_0_15px_rgba(0,243,255,0.8)]' : 'bg-neon-cyan/60 shadow-[0_0_8px_rgba(0,243,255,0.4)]'}`}
              style={{
                width: 18,
                height: 18,
                left: segment.x * 20 + 1,
                top: segment.y * 20 + 1,
              }}
              initial={false}
              animate={{
                left: segment.x * 20 + 1,
                top: segment.y * 20 + 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          ))}

          {/* Food */}
          <motion.div
            className="absolute bg-neon-lime rounded-full shadow-[0_0_15px_rgba(57,255,20,0.8)]"
            style={{
              width: 14,
              height: 14,
              left: food.x * 20 + 3,
              top: food.y * 20 + 3,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Overlays */}
          <AnimatePresence>
            {(isGameOver || isPaused) && (
              <motion.div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isGameOver ? (
                  <>
                    <h2 className="text-4xl font-black text-neon-magenta neon-text-magenta mb-2 uppercase italic tracking-tighter">System Failure</h2>
                    <p className="text-white/60 mb-8 font-mono text-xs uppercase tracking-widest leading-relaxed">Neural link severed. <br/> Score: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="group flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-neon-cyan transition-all hover:scale-105 active:scale-95"
                    >
                      <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      Reboot Core
                    </button>
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-12 h-12 text-neon-cyan mb-4 animate-pulse" />
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">System Idle</h2>
                    <p className="text-white/40 mb-8 font-mono text-[10px] uppercase tracking-widest">Awaiting interaction...</p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="bg-neon-cyan text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all"
                    >
                      Continue Link
                    </button>
                    {score === 0 && !isGameOver && (
                      <p className="mt-8 text-[10px] font-mono text-white/30 uppercase">Use Arrow Keys to Navigate</p>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
