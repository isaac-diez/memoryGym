import React, { useState, useEffect } from 'react';
import { Eye, Check, RotateCcw } from 'lucide-react';
import { Tones } from '../utils/audio';

interface Item {
  emoji: string;
  name: string;
}

const ITEMS_POOL: Item[] = [
  { emoji: '🔑', name: 'Llaves de casa' },
  { emoji: '🕶️', name: 'Gafas de leer' },
  { emoji: '💊', name: 'Caja de medicinas' },
  { emoji: '🥛', name: 'Vaso de agua' },
  { emoji: '📱', name: 'Teléfono móvil' },
  { emoji: '👛', name: 'Monedero o Cartera' },
  { emoji: '🍎', name: 'Manzana roja' },
  { emoji: '📚', name: 'Libro de lectura' },
  { emoji: '☔', name: 'Paraguas' },
  { emoji: '🍵', name: 'Manzanilla calentita' },
  { emoji: '🧦', name: 'Calcetines de lana' },
  { emoji: '📅', name: 'Calendario de mesa' },
];

const PROMPT_SCENARIOS = [
  {
    title: "Salir a hacer la compra",
    context: "Antes de salir por la puerta de casa, tienes que asegurarte de llevar estos objetos guardados en los bolsillos o en el bolso:",
    count: 3
  },
  {
    title: "Irse a dormir por la noche",
    context: "Para asegurar una noche tranquila y levantarte con buen pie, pon estos elementos preparados en tu mesita de noche:",
    count: 3
  },
  {
    title: "Preparar un almuerzo saludable",
    context: "Llega la hora de comer. Consigue y reúne estos ingredientes y utensilios sobre la encimera de tu cocina:",
    count: 4
  },
  {
    title: "Lista rápida para un viaje corto",
    context: "Vas a salir a pasar el día fuera con la familia. Comprueba que llevas estos elementos críticos guardados en tu cartera de viaje:",
    count: 4
  }
];

interface RecallQuestProps {
  onGameCompletedToday: () => void;
  bestScore: number;
  onUpdateHighScore: (score: number) => void;
  onBack: () => void;
}

export default function RecallQuest({ onGameCompletedToday, bestScore, onUpdateHighScore, onBack }: RecallQuestProps) {
  const [scenario, setScenario] = useState(PROMPT_SCENARIOS[0]);
  const [targetItems, setTargetItems] = useState<Item[]>([]);
  const [shelfItems, setShelfItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [phase, setPhase] = useState<'study' | 'quiz' | 'result'>('study');
  const [soundEnabled] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  // Setup a new scenario
  const handleNewScenario = (playSound: boolean = false) => {
    if (playSound && soundEnabled) Tones.click();

    // Pick a random scenario
    const randScenario = PROMPT_SCENARIOS[Math.floor(Math.random() * PROMPT_SCENARIOS.length)];
    setScenario(randScenario);

    // Pick (scenario.count) random items for target list
    const shuffledItems = [...ITEMS_POOL].sort(() => Math.random() - 0.5);
    const targets = shuffledItems.slice(0, randScenario.count);
    setTargetItems(targets);

    // Combine targets with some filler options and shuffle for the quiz shelf
    const fillersCount = 8 - randScenario.count;
    const fillers = shuffledItems.slice(randScenario.count, randScenario.count + fillersCount);
    const shelf = [...targets, ...fillers].sort(() => Math.random() - 0.5);
    setShelfItems(shelf);

    setSelectedItems([]);
    setPhase('study');
    setFeedback('');
  };

  useEffect(() => {
    handleNewScenario(false);
  }, []);

  // Study complete
  const handleReadyToChoose = () => {
    if (soundEnabled) Tones.click();
    setPhase('quiz');
  };

  // Toggle selection on shelf
  const handleSelectItem = (item: Item) => {
    if (phase !== 'quiz') return;
    if (soundEnabled) Tones.cardFlip();

    if (selectedItems.some(i => i.name === item.name)) {
      setSelectedItems(selectedItems.filter(i => i.name !== item.name));
    } else {
      if (selectedItems.length >= targetItems.length) return; // Full limit
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Check results
  const handleVerifySelections = () => {
    if (soundEnabled) Tones.click();

    // How many correct items did the user choose?
    const correctCount = selectedItems.filter(sel => 
      targetItems.some(item => item.name === sel.name)
    ).length;

    const allMatches = correctCount === targetItems.length && selectedItems.length === targetItems.length;

    if (allMatches) {
      if (soundEnabled) Tones.success();
      setFeedback('¡Memoria prodigiosa! Has recordado y preparado con éxito cada uno de los objetos indicados.');
      setScore(prev => prev + 10);
      onGameCompletedToday(); // Log daily game done
      if (score + 10 > bestScore) {
        onUpdateHighScore(score + 10);
      }
    } else {
      if (soundEnabled) Tones.fail();
      setFeedback(`Has recordado correctamente ${correctCount} de los ${targetItems.length} objetos. ¡No te preocupes! La repetición constante ayuda a activar las conexiones neuronales. ¡Probemos de nuevo!`);
    }

    setPhase('result');
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-4" id="recall-quest-wrapper">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          id="recall-back-btn"
          className="px-4 py-2 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg font-medium transition active:scale-95 cursor-pointer"
        >
          ← Volver al Menú
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">Estimulación Cognitiva</span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">Desafío de Checklist Diario</h2>
          </div>
          <div>
            <span className="text-xs text-stone-500 block">Puntación Juego</span>
            <span className="font-mono text-lg font-bold text-emerald-600 block text-right">{score}</span>
          </div>
        </div>

        {/* STUDY STATE PHASE */}
        {phase === 'study' && (
          <div className="space-y-6" id="rq-study-phase">
            <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-4 text-xs text-stone-700 leading-relaxed">
              <span className="font-bold text-amber-950 block">💡 Consejo de entrenamiento:</span>
              Tómate tu tiempo para observar la lista de abajo. Conéctalos inventándote una pequeña historia (ej: <em>"Me pongo las gafas de leer para repasar mi libro de lectura favorito mientras espero que se caliente la manzanilla..."</em>). ¡Las conexiones de memoria se forman mucho más rápido con historias asociativas!
            </div>

            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-100">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-2 font-mono">ESCENARIO: {scenario.title}</span>
              <p className="text-stone-800 text-sm font-medium mb-4">{scenario.context}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-xs">
                    <span className="text-3xl shrink-0">{item.emoji}</span>
                    <span className="font-bold text-stone-800 text-sm md:text-base">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReadyToChoose}
              id="rq-ready-btn"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="h-5 w-5" />
              ¡Ya me lo sé! A preparar
            </button>
          </div>
        )}

        {/* QUIZ SELECTION OF SHELF ITEMS */}
        {phase === 'quiz' && (
          <div className="space-y-6" id="rq-quiz-phase">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-stone-700 text-center leading-relaxed font-medium">
              💼 <span className="text-indigo-950">Mira la estantería de objetos de abajo. Selecciona exactamente los **{targetItems.length} objetos** que debías recordar:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shelfItems.map((item, idx) => {
                const isSelected = selectedItems.some(i => i.name === item.name);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3.5 rounded-xl border-2 text-center flex flex-col items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm relative ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold' 
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-stone-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    )}
                    <span className="text-3.5xl">{item.emoji}</span>
                    <span className="text-xs font-semibold uppercase tracking-tight leading-normal">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleVerifySelections}
                disabled={selectedItems.length !== targetItems.length}
                id="rq-evaluate-btn"
                className="w-full bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="h-5 w-5" />
                Confirmar selección ({selectedItems.length}/{targetItems.length})
              </button>
            </div>
          </div>
        )}

        {/* RESULT & EXPLANATION SCORE BOARD */}
        {phase === 'result' && (
          <div className="space-y-6 text-center" id="rq-result-phase">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider block mb-2 font-mono">REGISTRO DE RESULTADOS</span>
              
              <p className="text-sm font-medium text-stone-700 whitespace-pre-line leading-relaxed">
                {feedback}
              </p>

              {/* Side-by-side comparison of target items versus chosen ones */}
              <div className="mt-6 border-t border-stone-200 pt-5 text-left">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-3">Comparación de resultados:</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest block mb-1.5">Tu lista era:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {targetItems.map((it, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-stone-200 text-stone-800 text-xs px-2.5 py-1 rounded-full font-medium">
                          {it.emoji} {it.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest block mb-1.5">Tus opciones elegidas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItems.map((it, idx) => {
                        const correctVal = targetItems.some(ti => ti.name === it.name);
                        return (
                          <span key={idx} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border ${
                            correctVal 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}>
                            {it.emoji} {it.name} {correctVal ? '✓' : '✗'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleNewScenario(true)}
                id="rq-restart-btn"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <RotateCcw className="h-5 w-5" />
                Probar otro escenario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
