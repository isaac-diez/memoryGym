import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Sparkles, BookOpen, CheckCircle, Plus, ArrowLeft, Lightbulb, Save } from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../types';
import { Tones } from '../utils/audio';

interface FlashcardSetProps {
  decks: FlashcardDeck[];
  onAddCustomDeck: (newDeck: FlashcardDeck) => void;
  onGameCompletedToday: () => void;
  onBack: () => void;
}

export default function FlashcardSet({ decks, onAddCustomDeck, onGameCompletedToday, onBack }: FlashcardSetProps) {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionScore, setSessionScore] = useState<{ [cardId: string]: 'correct' | 'review' }>({});
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [soundEnabled] = useState(true);

  // New Deck / Card Form States
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('Vida Diaria');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardHint, setNewCardHint] = useState('');
  const [newCardEmoji, setNewCardEmoji] = useState('💡');

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  // Handle deck select
  const handleDeckSelect = (id: string) => {
    if (soundEnabled) Tones.click();
    setSelectedDeckId(id);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionScore({});
  };

  const handleCardFlip = () => {
    if (soundEnabled) Tones.cardFlip();
    setIsFlipped(!isFlipped);
    setShowHint(false);
  };

  const traverseCards = (direction: 'next' | 'prev') => {
    if (!selectedDeck) return;
    if (soundEnabled) Tones.click();
    
    setIsFlipped(false);
    setShowHint(false);

    if (direction === 'next') {
      setCurrentIndex((currentIndex + 1) % selectedDeck.cards.length);
    } else {
      setCurrentIndex((currentIndex - 1 + selectedDeck.cards.length) % selectedDeck.cards.length);
    }
  };

  const recordEvaluation = (status: 'correct' | 'review') => {
    if (!selectedDeck) return;
    if (soundEnabled) {
      if (status === 'correct') Tones.success();
      else Tones.click();
    }

    const currentCard = selectedDeck.cards[currentIndex];
    const updated = { ...sessionScore, [currentCard.id]: status };
    setSessionScore(updated);

    // If we marked enough cards as read, we can count this deck check-off as daily memory practice!
    const totalCount = Object.keys(updated).length;
    if (totalCount >= Math.min(3, selectedDeck.cards.length)) {
      onGameCompletedToday();
    }

    // Auto proceed to next card after a small delay
    setTimeout(() => {
      if (currentIndex < selectedDeck.cards.length - 1) {
        setIsFlipped(false);
        setShowHint(false);
        setCurrentIndex(currentIndex + 1);
      }
    }, 400);
  };

  // Submit custom memory deck
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim() || !newCardFront.trim() || !newCardBack.trim()) return;

    if (soundEnabled) Tones.matchFound();

    const customCardId = `cc-${Date.now()}`;
    const newCard: Flashcard = {
      id: customCardId,
      frontText: newCardFront,
      backText: newCardBack,
      frontHint: newCardHint.trim() || undefined,
      emoji: newCardEmoji
    };

    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      title: newDeckTitle,
      description: newDeckDesc || 'Tarjetas de memoria personalizadas diseñadas para apoyar con la rutina de recuerdo diaria.',
      category: newDeckCategory,
      icon: 'BookOpen',
      cards: [newCard]
    };

    onAddCustomDeck(newDeck);
    
    // Reset Form
    setNewDeckTitle('');
    setNewDeckDesc('');
    setNewCardFront('');
    setNewCardBack('');
    setNewCardHint('');
    setNewCardEmoji('💡');
    setIsCreatingCard(false);

    // Auto-select the newly created deck
    setSelectedDeckId(newDeck.id);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-4" id="flashcards-wrapper">
      {/* Back & Heading Panel */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={selectedDeckId ? () => setSelectedDeckId(null) : onBack}
          id="flashcards-back-btn"
          className="px-4 py-2 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg font-medium transition active:scale-95 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {selectedDeckId ? 'Volver a Carpetas' : 'Volver al Menú'}
        </button>

        {!selectedDeckId && !isCreatingCard && (
          <button
            onClick={() => setIsCreatingCard(true)}
            id="create-deck-btn"
            className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Crear Tarjeta Propia
          </button>
        )}
      </div>

      {/* RENDER STUDY SELECTION */}
      {!selectedDeckId && !isCreatingCard && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">Estimulación Cognitiva</span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">Tarjetas de Memoria</h2>
            <p className="text-stone-600 text-sm mt-2">
              Gira las tarjetas con pequeñas pistas visuales estructuradas. Un repaso constante ayuda a construir y fortalecer las conexiones cerebrales para ubicar objetos diarios, recordar nombres de familiares y pautas domésticas básicas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4" id="flashcard-decks-grid">
            {decks.map((deck) => {
              const count = deck.cards.length;
              return (
                <button
                  key={deck.id}
                  id={`deck-card-${deck.id}`}
                  onClick={() => handleDeckSelect(deck.id)}
                  className="w-full text-left bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/20 active:scale-98 transition text-stone-800 flex items-start gap-4 shadow-sm group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                        {deck.category === 'Social Support' ? 'Apoyo Social' : 
                         deck.category === 'Daily Living' ? 'Vida Diaria' : 
                         deck.category === 'Cognitive Spark' ? 'Activación Mental' : deck.category}
                      </span>
                      <span className="text-xs text-stone-400 font-medium font-mono bg-stone-100 px-2 py-0.5 rounded-full">
                        {count} {count === 1 ? 'tarjeta' : 'tarjetas'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900 mt-0.5 group-hover:text-emerald-800 transition">{deck.title}</h3>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">{deck.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER CUSTOM CARD CREATION FORM */}
      {isCreatingCard && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm" id="create-card-form">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Crear Tarjeta de Memoria Propia
            </h3>
            <button
              onClick={() => setIsCreatingCard(false)}
              className="text-stone-400 hover:text-stone-600 text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
          <p className="text-stone-500 text-xs mb-6">
            Un gran consejo práctico: escribe detalles específicos de tus propios familiares (nombres, parentescos), números de teléfono útiles de tu libreta, o las ubicaciones de casa de las cosas que suelas despistar más a menudo.
          </p>

          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Conjunto o Título</label>
              <input
                type="text"
                required
                placeholder="ej: Medicación de la mañana, Nombres de mi barrio, Teléfonos útiles"
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Área o Categoría</label>
                <select
                  value={newDeckCategory}
                  onChange={(e) => setNewDeckCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-700 font-medium bg-white"
                >
                  <option value="Vida Diaria">🏠 Vida Diaria</option>
                  <option value="Apoyo Familiar">❤️ Apoyo Familiar</option>
                  <option value="Salud y Seguridad">🛡️ Salud y Seguridad</option>
                  <option value="Activación Mental">🧠 Palabras / Chispas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emoji de Ilustración</label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="💡, 🔑, 💊, 👵🏼"
                  value={newCardEmoji}
                  onChange={(e) => setNewCardEmoji(e.target.value)}
                  className="w-full text-center px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Texto del Anverso (La Pregunta / Clave visual)</label>
              <textarea
                required
                rows={3}
                placeholder="ej: ¿De qué color es el perchero de la entrada donde va el abrigo? o ¿Cómo se llama mi nieto mayor que juega al fútbol?"
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Texto del Reverso (La Respuesta correcta / Tu recuerdo definitivo)</label>
              <textarea
                required
                rows={3}
                placeholder="ej: El perchero es marrón de madera barnizada y está junto al espejo. o Se llama Mateo, tiene 11 años y estudia historia."
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Pista Opcional de Ayuda</label>
              <input
                type="text"
                placeholder="ej: Empieza por la letra M..., o Es de color marrón"
                value={newCardHint}
                onChange={(e) => setNewCardHint(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold transition flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <Save className="h-5 w-5" />
              Guardar Nueva Tarjeta de Memoria
            </button>
          </form>
        </div>
      )}

      {/* RENDER ACTIVE DECK VIEW */}
      {selectedDeckId && selectedDeck && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {selectedDeck.category === 'Social Support' ? 'Apoyo Social' : 
               selectedDeck.category === 'Daily Living' ? 'Vida Diaria' : 
               selectedDeck.category === 'Cognitive Spark' ? 'Activación Mental' : selectedDeck.category}
            </span>
            <h3 className="text-lg font-bold text-stone-900">{selectedDeck.title}</h3>
            {/* Progress Bar of Study session */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 max-w-xs mx-auto mt-3 border border-stone-200 overflow-hidden flex">
              {selectedDeck.cards.map((card, i) => {
                const evalState = sessionScore[card.id];
                let colorClass = 'bg-stone-200';
                if (evalState === 'correct') colorClass = 'bg-emerald-500';
                if (evalState === 'review') colorClass = 'bg-rose-400';
                if (i === currentIndex) colorClass = 'bg-amber-400';
                return (
                  <div
                    key={card.id}
                    style={{ width: `${100 / selectedDeck.cards.length}%` }}
                    className={`${colorClass} transition-colors duration-200 border-r border-white/40 h-full`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-stone-500 mt-1.5 font-medium font-mono">
              Tarjeta {currentIndex + 1} de {selectedDeck.cards.length}
            </p>
          </div>

          {/* FLIP CARD WRAPPER */}
          <div className="flex flex-col items-center">
            <button
              id="flashcard-viewport"
              onClick={handleCardFlip}
              className="w-full max-w-sm aspect-[4/3] focus:outline-none cursor-pointer group rounded-3xl border border-stone-200 shadow-sm relative transition duration-300"
            >
              {/* Large graphic layout inside flashcard */}
              <div className="absolute inset-0 bg-white hover:bg-stone-50/50 rounded-3xl p-6 flex flex-col justify-between transition-colors">
                
                {/* Top bar */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase">
                    {isFlipped ? "RESPUESTA / MEMORIA" : "PREGUNTA / SEÑAL"}
                  </span>
                  <div className="text-center text-4xl leading-none">
                    {selectedDeck.cards[currentIndex].emoji || "💡"}
                  </div>
                </div>

                {/* Central text */}
                <div className="flex-1 flex flex-col items-center justify-center p-2 text-center my-2">
                  <p className="text-lg md:text-xl font-medium text-stone-900 whitespace-pre-line leading-relaxed">
                    {isFlipped 
                      ? selectedDeck.cards[currentIndex].backText 
                      : selectedDeck.cards[currentIndex].frontText}
                  </p>

                  {!isFlipped && showHint && selectedDeck.cards[currentIndex].frontHint && (
                    <div className="mt-4 bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Pista: <strong>{selectedDeck.cards[currentIndex].frontHint}</strong></span>
                    </div>
                  )}
                </div>

                {/* Bottom interactive helper */}
                <div className="flex justify-center items-center text-stone-400 text-xs font-medium gap-2 group-hover:text-stone-600 transition">
                  <RotateCw className="h-4 w-4" />
                  <span>Pulsa en cualquier parte para girar la tarjeta</span>
                </div>
              </div>
            </button>
          </div>

          {/* Flashcard Actions & Response evaluation */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {/* Show hint button if not flipped */}
            {!isFlipped && selectedDeck.cards[currentIndex].frontHint && (
              <button
                onClick={() => {
                  if (soundEnabled) Tones.click();
                  setShowHint(!showHint);
                }}
                className="w-full text-stone-600 bg-stone-100 font-medium hover:bg-stone-200 rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="h-4 w-4 text-amber-500 fill-amber-100" />
                {showHint ? "Ocultar Pista de Ayuda" : "Ver Pista de Ayuda"}
              </button>
            )}

            {/* Check/Remember panel after flipping */}
            {isFlipped ? (
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col gap-3">
                <p className="text-xs text-stone-600 font-bold text-center">¿Has conseguido recordar la respuesta bien?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => recordEvaluation('correct')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    ¡Sí, estupendamente!
                  </button>
                  <button
                    onClick={() => recordEvaluation('review')}
                    className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 rounded-xl py-3 font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Todavía no
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => traverseCards('prev')}
                  className="flex-1 text-stone-700 bg-stone-100 hover:bg-stone-200 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  onClick={() => traverseCards('next')}
                  className="flex-1 text-stone-700 bg-stone-100 hover:bg-stone-200 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Saltar Tarjeta
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* End session statistics */}
            {Object.keys(sessionScore).length === selectedDeck.cards.length && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-2xl p-4 text-sm flex items-center gap-3">
                <div className="h-9 w-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold">¡Repaso Completado con Éxito!</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    ¡Qué gran dedicación hoy! ¡Has recordado perfectamente {Object.values(sessionScore).filter(v => v === 'correct').length} de las {selectedDeck.cards.length} tarjetas de este mazo!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
