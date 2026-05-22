import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, HelpCircle, Info } from 'lucide-react';
import { Tones } from '../utils/audio';

const AVAILABLE_ICONS = [
  { symbol: '🍎', label: 'Manzana' },
  { symbol: '🔑', label: 'Llave' },
  { symbol: '🍵', label: 'Taza de té' },
  { symbol: '💊', label: 'Medicina' },
  { symbol: '🏠', label: 'Casa' },
  { symbol: '📞', label: 'Teléfono' },
  { symbol: '☀️', label: 'Sol' },
  { symbol: '❤️', label: 'Corazón' },
  { symbol: '📚', label: 'Libro' },
  { symbol: '🧦', label: 'Calcetines' },
];

interface Card {
  id: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface PairMatchingProps {
  onGameCompletedToday: () => void;
  bestScore: number;
  onUpdateHighScore: (score: number) => void;
  onBack: () => void;
}

export default function PairMatching({ onGameCompletedToday, bestScore, onUpdateHighScore, onBack }: PairMatchingProps) {
  const [gridSize, setGridSize] = useState<4 | 6 | 8>(6); // 4 cards (2 pairs), 6 cards (3 pairs), 8 cards (4 pairs)
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [soundEnabled] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isWon, setIsWon] = useState(false);

  const isInitialMount = useRef(true);

  // Initialize a new game
  const initializeGame = (size: number = gridSize, playSound: boolean = false) => {
    if (playSound && soundEnabled) Tones.click();
    
    // Choose (size / 2) items from the list
    const pairCount = size / 2;
    const chosen = [...AVAILABLE_ICONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount);

    // Duplicate them to construct pairs
    const deck = [...chosen, ...chosen]
      .map((item, index) => ({
        id: index,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle deck

    setCards(deck);
    setSelectedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      initializeGame(gridSize, false);
      isInitialMount.current = false;
    } else {
      initializeGame(gridSize, true);
    }
  }, [gridSize]);

  // Card click mechanics
  const handleCardClick = (index: number) => {
    if (selectedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) return;

    if (soundEnabled) Tones.cardFlip();

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const nextSelection = [...selectedIndices, index];
    setSelectedIndices(nextSelection);

    if (nextSelection.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = nextSelection;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // MATCH!
        setTimeout(() => {
          if (soundEnabled) Tones.matchFound();
          const matchedSet = cards.map((card, idx) => {
            if (idx === firstIdx || idx === secondIdx) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          setCards(matchedSet);
          setSelectedIndices([]);

          // Check if game won
          const allMatched = matchedSet.every(c => c.isMatched);
          if (allMatched) {
            setIsWon(true);
            
            // Log daily practice completions
            onGameCompletedToday();
            
            // Calculate a score to compare (smaller moves is better)
            const calculatedScore = Math.max(100 - moves * 5, 20);
            if (calculatedScore > bestScore) {
              onUpdateHighScore(calculatedScore);
            }
          }
        }, 500);
      } else {
        // NO MATCH -> Flip back over safely
        setTimeout(() => {
          const resetSet = cards.map((card, idx) => {
            if (idx === firstIdx || idx === secondIdx) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          setCards(resetSet);
          setSelectedIndices([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-4" id="matching-game-wrapper">
      {/* Back button & controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          id="pair-back-btn"
          className="px-4 py-2 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg font-medium transition active:scale-95 cursor-pointer"
        >
          ← Volver al Menú
        </button>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="p-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
          title="Cómo ayuda"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">Práctica Visual</span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">Parejas de Oro</h2>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Movimientos</span>
            <span className="font-mono text-lg font-bold text-stone-800 text-right block">{moves}</span>
          </div>
        </div>

        {/* Cognitive rehabilitation guide */}
        {showExplanation && (
          <div className="bg-emerald-50/70 border border-emerald-200/50 rounded-xl p-4 mb-6 text-xs text-stone-700 leading-relaxed" id="pair-explanation">
            <h4 className="font-bold text-emerald-900 mb-1">💡 Entrenador de Enfoque y Asociación</h4>
            <p className="text-stone-600">
              Al encontrar parejas idénticas de objetos cotidianos familiares, ejercitas el rastreo espacial y los esquemas de memoria visual a corto plazo. 
              Empieza con la dificultad <strong>Fácil (2 Parejas)</strong> para asimilarlo rápidamente, o progresa a la <strong>Clásica (4 Parejas)</strong> cuando te veas con confianza.
            </p>
          </div>
        )}

        {/* Difficulty Setting Tabs */}
        <div className="flex bg-stone-100 rounded-xl p-1 mb-6 max-w-sm mx-auto" id="matching-difficulty-tabs">
          <button
            onClick={() => setGridSize(4)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${gridSize === 4 ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Fácil (2 Parejas)
          </button>
          <button
            onClick={() => setGridSize(6)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${gridSize === 6 ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Medio (3 Parejas)
          </button>
          <button
            onClick={() => setGridSize(8)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${gridSize === 8 ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Clásico (4 Parejas)
          </button>
        </div>

        {/* Main Grid View */}
        <div 
          className={`grid gap-4 max-w-sm mx-auto mb-8 ${gridSize === 4 ? 'grid-cols-2' : gridSize === 6 ? 'grid-cols-3' : 'grid-cols-4'}`}
          id="matching-cards-grid"
        >
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 relative active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-4 cursor-pointer focus:ring-emerald-200 ${
                  card.isMatched 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : isRevealed 
                      ? 'bg-white border-stone-300 text-stone-900 group' 
                      : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-500'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-1">{card.symbol}</span>
                    <span className="text-[10px] font-bold text-stone-500 uppercase leading-none">{card.label}</span>
                  </div>
                ) : (
                  <HelpCircle className="h-8 w-8 text-emerald-100 opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Win / Complete Banner */}
        {isWon && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center max-w-sm mx-auto mb-6" id="matching-win-panel">
            <div className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm">
              ✨
            </div>
            <h3 className="font-bold text-emerald-950 text-base">¡Excelente Emparejamiento!</h3>
            <p className="text-xs text-stone-600 mt-1">
              Has logrado emparejar todas las tarjetas en tan solo {moves} movimientos. Es un resultado magnífico para tu entrenamiento espacial y visual de hoy.
            </p>
          </div>
        )}

        {/* Reset / Action Buttons */}
        <div className="flex gap-4 justify-center max-w-sm mx-auto">
          <button
            onClick={() => initializeGame(gridSize, true)}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Mezclar y Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
