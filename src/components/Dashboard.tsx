import React from 'react';
import { Award, Flame, Brain, Play, BookOpen, Layers, Sparkles, ClipboardCheck, ChevronRight, Calendar } from 'lucide-react';
import { DailyReminder, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  reminders: DailyReminder[];
  onSelectTab: (tab: 'simon' | 'flashcards' | 'matching' | 'recall' | 'reminders') => void;
}

export default function Dashboard({ stats, reminders, onSelectTab }: DashboardProps) {
  // Calendar tracking
  const currentDayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
  // Capitalize day name
  const capitalizedDay = currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1);
  const currentDateFormatted = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

  // Calculate reminder percentage completion rates
  const completedReminders = reminders.filter(r => r.completed).length;
  const totalReminders = reminders.length;
  const remindersPercent = totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;

  // Calculate cognitive games completion
  const gamesCompletedCount = (stats.gamesCompletedToday.simon ? 1 : 0) + 
                              (stats.gamesCompletedToday.matching ? 1 : 0) + 
                              (stats.gamesCompletedToday.recall ? 1 : 0);

  return (
    <div className="space-y-6" id="dashboard-wrapper">
      
      {/* Dynamic Health Greetings Card */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden" id="dashboard-hero">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="h-32 w-32" />
        </div>
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5" />
            <span>Hoy es {capitalizedDay}, {currentDateFormatted}</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">¡Te damos la bienvenida a tu Gimnasio Mental!</h2>
          <p className="text-emerald-100 text-sm max-w-md leading-relaxed">
            Realizar diariamente un entrenamiento mental suave es fantástico para asimilar, construir y proteger los canales de la memoria. Disfruta de la práctica a tu propio ritmo, con tranquilidad libres de estrés y prisas.
          </p>

          <div className="pt-3 flex gap-4 pr-2 flex-wrap text-emerald-950 font-semibold text-xs md:text-sm">
            <div className="bg-white/95 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500 fill-current" />
              <span><strong>{stats.streak} {stats.streak === 1 ? 'día' : 'días'}</strong> de racha</span>
            </div>
            <div className="bg-white/95 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span><strong>{gamesCompletedCount}/3</strong> juegos hechos hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Tracker Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Game completion checklist */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">Objetivos Cognitivos</span>
            <h3 className="text-lg font-bold text-stone-900 mt-1 mb-3">Metas de Entrenamiento de Hoy</h3>
            
            <div className="space-y-2.5">
              {/* Simon Game row */}
              <button
                onClick={() => onSelectTab('simon')}
                className="w-full text-left p-3 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 flex justify-between items-center transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${stats.gamesCompletedToday.simon ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                    ✓
                  </div>
                  <span className="text-xs md:text-sm font-bold text-stone-800">1. Simon Sosegado Clásico</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-500">{stats.gamesCompletedToday.simon ? 'Completado' : 'Listo para entrenar'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
                </div>
              </button>

              {/* Pair Matching row */}
              <button
                onClick={() => onSelectTab('matching')}
                className="w-full text-left p-3 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 flex justify-between items-center transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${stats.gamesCompletedToday.matching ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                    ✓
                  </div>
                  <span className="text-xs md:text-sm font-bold text-stone-800">2. Parejas de Oro</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-500">{stats.gamesCompletedToday.matching ? 'Completado' : 'Listo para entrenar'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
                </div>
              </button>

              {/* Checklist Recall row */}
              <button
                onClick={() => onSelectTab('recall')}
                className="w-full text-left p-3 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 flex justify-between items-center transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${stats.gamesCompletedToday.recall ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                    ✓
                  </div>
                  <span className="text-xs md:text-sm font-bold text-stone-800">3. Desafío Checklist Diario</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-500">{stats.gamesCompletedToday.recall ? 'Completado' : 'Listo para entrenar'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Objetivo diario completado</span>
            <span className="font-mono font-bold text-emerald-600">{Math.round((gamesCompletedCount / 3) * 100)}%</span>
          </div>
        </div>

        {/* Reminders summary check in */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">Progreso de Rutinas</span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">Recordatorios de hoy tachados</h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-stone-800 font-mono">{completedReminders}/{totalReminders}</span>
              </div>
            </div>

            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-4 border border-stone-200">
              <div 
                style={{ width: `${remindersPercent}%` }} 
                className="bg-emerald-500 h-full transition-all duration-300"
              />
            </div>

            <p className="text-xs text-stone-500 leading-relaxed mt-4">
              Tacha de tu lista hábitos diarios como tomar tus vitaminas, medicamentos o tener una pequeña charla por teléfono. Hacerlo de manera constante previene la fatiga mental de la rutina del día.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('reminders')}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 font-bold text-xs text-stone-700 transition cursor-pointer"
          >
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
            Ver mi Lista de Tareas
          </button>
        </div>
      </div>

      {/* Active Navigation Hub Grid */}
      <div>
        <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-widest mb-3">Ejercicios de Gimnasio Mental</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Steady Simon Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center text-amber-600 text-xl font-sans shrink-0">
                🎨
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Steady Simon Game</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  El Simon clásico pero rediseñado con un ritmo pausado y constante. Ideal para ejercitar la memoria secuencial de sonidos y colores.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('simon')}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Iniciar Simon
            </button>
          </div>

          {/* Flashcards Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center text-blue-600 text-xl font-sans shrink-0">
                📖
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Tarjetas de Memoria</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Asociaciones interactivas de caras y nombres domésticos cotidianos. Repasa datos existentes o añade tus tarjetas personalizadas de apoyo social.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('flashcards')}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Ver Tarjetas
            </button>
          </div>

          {/* Pairs Matching Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-center text-rose-500 text-xl font-sans shrink-0">
                🧩
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Parejas de Oro</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Juego clásico de encontrar tarjetas idénticas de objetos diarios. Ajusta la cuadrícula de fácil a clásico a tu libre elección.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('matching')}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              Iniciar Parejas
            </button>
          </div>

          {/* Recall Quest Hub Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-center text-indigo-600 text-xl font-sans shrink-0">
                👜
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Desafío Checklist Diario</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Memoriza sencillas listas temáticas del hogar y recuérdalas luego en la estantería de objetos comunes.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('recall')}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Iniciar Desafío
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
