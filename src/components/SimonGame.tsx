import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Info, Check, Award, AlertCircle } from 'lucide-react';
import { Tones } from '../utils/audio';

type Color = 'green' | 'red' | 'yellow' | 'blue';

interface SimonGameProps {
  onGameCompletedToday: () => void;
  bestScore: number;
  onUpdateHighScore: (score: number) => void;
  onBack: () => void;
}

export default function SimonGame({ onGameCompletedToday, bestScore, onUpdateHighScore, onBack }: SimonGameProps) {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [activeButton, setActiveButton] = useState<Color | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameMessage, setGameMessage] = useState('¡Pulsa "Iniciar juego" para empezar!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasCompletedDaily, setHasCompletedDaily] = useState(false);

  // Constants for Simon (Constant steady timing, no speed increase, accessible and supportive)
  const LIT_TIME = 700; 
  const INTERVAL_TIME = 400;

  const sequencePlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play a specific pad sound and light it up
  const firePad = (color: Color, isSilent: boolean = !soundEnabled) => {
    setActiveButton(color);
    if (!isSilent) {
      if (color === 'green') Tones.green();
      if (color === 'red') Tones.red();
      if (color === 'yellow') Tones.yellow();
      if (color === 'blue') Tones.blue();
    }
    setTimeout(() => {
      setActiveButton(null);
    }, LIT_TIME - 100);
  };

  // Start a new game
  const startGame = () => {
    Tones.click();
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setGameMessage('Observa la secuencia con atención...');
    
    // Create first move
    const colors: Color[] = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * 4)];
    setSequence([randomColor]);
    setIsComputerTurn(true);
  };

  // Effect to play sequence when sequence changes and computer turn is true
  useEffect(() => {
    if (!isPlaying || sequence.length === 0 || !isComputerTurn) return;

    let index = 0;
    setGameMessage('Observa el patrón...');

    const playNext = () => {
      if (index < sequence.length) {
        const color = sequence[index];
        firePad(color);
        index++;
        
        sequencePlayTimeoutRef.current = setTimeout(playNext, LIT_TIME + INTERVAL_TIME);
      } else {
        setIsComputerTurn(false);
        setUserSequence([]);
        setGameMessage('¡Tu turno! Repite el patrón.');
      }
    };

    // Small delay before beginning sequence
    const initialDelay = setTimeout(playNext, 800);

    return () => {
      clearTimeout(initialDelay);
      if (sequencePlayTimeoutRef.current) {
        clearTimeout(sequencePlayTimeoutRef.current);
      }
    };
  }, [sequence, isComputerTurn, isPlaying]);

  // Handle user pad clicks
  const handlePadClick = (color: Color) => {
    if (isComputerTurn || !isPlaying || isGameOver) return;

    firePad(color);
    const nextUserSeq = [...userSequence, color];
    setUserSequence(nextUserSeq);

    // Verify current step
    const currentStepIndex = nextUserSeq.length - 1;
    if (nextUserSeq[currentStepIndex] !== sequence[currentStepIndex]) {
      // Mistake made
      if (soundEnabled) Tones.fail();
      setIsGameOver(true);
      setIsPlaying(false);
      setGameMessage('Ese no era el orden exacto. ¡No pasa nada, vuelve a intentarlo para entrenar!');
      if (score > bestScore) {
        onUpdateHighScore(score);
      }
      return;
    }

    // Checking if response is complete
    if (nextUserSeq.length === sequence.length) {
      // Completed current level pattern!
      const nextScore = score + 1;
      setScore(nextScore);
      
      if (soundEnabled) Tones.levelUp();
      
      // Update high score on the fly
      if (nextScore > bestScore) {
        onUpdateHighScore(nextScore);
      }

      // Check daily practice milestone (e.g. standard goal of sequence score 3+)
      if (nextScore >= 3 && !hasCompletedDaily) {
        setHasCompletedDaily(true);
        onGameCompletedToday();
      }

      setGameMessage('¡Buen trabajo! Prepárate para el siguiente nivel.');
      
      // FIXED: Do NOT set "setIsComputerTurn(true)" immediately here.
      // This was triggering the useEffect with the old sequence length prematurely and causing double plays.
      // We set both state variables inside the timeout so they stay completely synchronized!

      // Append one random color for sequence with safety delay
      setTimeout(() => {
        const colors: Color[] = ['green', 'red', 'yellow', 'blue'];
        const randomColor = colors[Math.floor(Math.random() * 4)];
        setSequence(prev => [...prev, randomColor]);
        setIsComputerTurn(true);
      }, 1000);
    }
  };

  const getButtonClass = (color: Color) => {
    const base = "relative transition-all duration-250 aspect-square rounded-2xl border-4 active:scale-95 flex flex-col items-center justify-center p-6 shadow-md focus:outline-none focus:ring-4 focus:ring-stone-300";
    
    const configs = {
      green: {
        active: "bg-emerald-400 border-emerald-300 shadow-emerald-400/50 scale-102",
        inactive: "bg-emerald-700 hover:bg-emerald-600 border-emerald-800 text-emerald-100"
      },
      red: {
        active: "bg-rose-400 border-rose-300 shadow-rose-400/50 scale-102",
        inactive: "bg-rose-700 hover:bg-rose-600 border-rose-800 text-rose-100"
      },
      yellow: {
        active: "bg-amber-300 border-amber-200 shadow-amber-300/50 scale-102",
        inactive: "bg-amber-600 hover:bg-amber-500 border-amber-700 text-amber-50"
      },
      blue: {
        active: "bg-sky-400 border-sky-300 shadow-sky-400/50 scale-102",
        inactive: "bg-sky-700 hover:bg-sky-600 border-sky-800 text-sky-105"
      }
    };

    return `${base} ${activeButton === color ? configs[color].active : configs[color].inactive}`;
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-4" id="simon-game-container">
      {/* Header and Back navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          id="simon-back-btn"
          className="px-4 py-2 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg font-medium transition active:scale-95 cursor-pointer"
        >
          ← Volver al Menú
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            id="simon-sound-btn"
            className="p-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
            title={soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            id="simon-info-btn"
            className="p-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
            title="Cómo jugar"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">Mini-juego de Memoria</span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">Simon Clásico</h2>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Récord Personal</span>
              <span className="font-mono text-xl font-bold text-stone-800 flex items-center justify-end gap-1">
                <Award className="h-4 w-4 text-amber-500" />
                {bestScore}
              </span>
            </div>
          </div>
        </div>

        {/* Informative description/instructions */}
        {showInstructions && (
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 mb-6 text-sm text-amber-900 leading-relaxed" id="simon-instructions">
            <h3 className="font-semibold mb-1 flex items-center gap-1.5 text-amber-950">
              <Info className="h-4 w-4 text-amber-600" />
              Cómo te ayuda el juego del Simon:
            </h3>
            <p className="mb-2 text-stone-700">
              Este juego ejercita tu memoria de trabajo secuencial. Mostrará luces de colores, una a una. Repite el mismo patrón en el orden correcto para avanzar de nivel.
            </p>
          </div>
        )}

        {/* Score & General Messaging */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full font-mono text-sm text-stone-700 font-semibold">
            Puntuación: <span className="text-stone-900 text-base">{score}</span>
          </div>
          <p className="text-sm font-medium text-stone-600 mt-2 min-h-[20px] transition duration-200">
            {gameMessage}
          </p>
        </div>

        {/* Playboard Grid layout */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8" id="simon-grid">
          <button
            id="simon-pad-green"
            onClick={() => handlePadClick('green')}
            className={getButtonClass('green')}
            disabled={isComputerTurn || !isPlaying || isGameOver}
          >
            <span className="font-mono text-lg font-bold">VERDE</span>
            <span className="text-[10px] opacity-75 mt-1 font-sans">Arriba - Izq</span>
          </button>
          
          <button
            id="simon-pad-red"
            onClick={() => handlePadClick('red')}
            className={getButtonClass('red')}
            disabled={isComputerTurn || !isPlaying || isGameOver}
          >
            <span className="font-mono text-lg font-bold">ROJO</span>
            <span className="text-[10px] opacity-75 mt-1 font-sans">Arriba - Der</span>
          </button>
          
          <button
            id="simon-pad-yellow"
            onClick={() => handlePadClick('yellow')}
            className={getButtonClass('yellow')}
            disabled={isComputerTurn || !isPlaying || isGameOver}
          >
            <span className="font-mono text-lg font-bold font-semibold">AMARILLO</span>
            <span className="text-[10px] opacity-75 mt-1 font-sans">Abajo - Izq</span>
          </button>
          
          <button
            id="simon-pad-blue"
            onClick={() => handlePadClick('blue')}
            className={getButtonClass('blue')}
            disabled={isComputerTurn || !isPlaying || isGameOver}
          >
            <span className="font-mono text-lg font-bold text-white">AZUL</span>
            <span className="text-[10px] opacity-75 text-white/80 mt-1 font-sans">Abajo - Der</span>
          </button>
        </div>

        {/* Daily Reward Tracker */}
        {hasCompletedDaily && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6 flex items-center gap-2.5" id="simon-daily-badge">
            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">¡Objetivo de Simon Cumplido!</p>
              <p className="text-[11px] text-stone-600">Has alcanzado una secuencia de 3 o más colores hoy.</p>
            </div>
          </div>
        )}

        {/* Game Command Center */}
        <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto">
          {!isPlaying && !isGameOver && (
            <button
              onClick={startGame}
              id="simon-start-btn"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Play className="h-5 w-5 fill-current" />
              Iniciar Juego
            </button>
          )}

          {isGameOver && (
            <div className="w-full space-y-3">
              <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex items-start gap-2.5 text-sm leading-relaxed">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-950">¡La práctica hace al maestro!</h4>
                  <p className="text-stone-700 mt-1">Has recordado perfectamente una secuencia de {score} pasos. Vuelve a intentarlo para mantener bien activas tus conexiones neuronales.</p>
                </div>
              </div>
              
              <button
                onClick={startGame}
                id="simon-restart-btn"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 px-6 rounded-xl font-bold transition active:scale-98 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <RotateCcw className="h-5 w-5" />
                Volver a Jugar
              </button>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={() => {
                Tones.click();
                setIsPlaying(false);
                setSequence([]);
                setUserSequence([]);
                setIsGameOver(false);
                setGameMessage('Juego en pausa. ¡Pulsa Iniciar para volver a jugar!');
              }}
              id="simon-stop-btn"
              className="w-full py-2.5 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-semibold transition active:scale-95 cursor-pointer"
            >
              Pausar / Reiniciar Juego
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
