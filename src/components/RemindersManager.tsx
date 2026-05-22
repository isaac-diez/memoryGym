import React, { useState } from 'react';
import { DailyReminder } from '../types';
import { Check, Plus, Trash2, Clock, Shield, Flame } from 'lucide-react';
import { Tones } from '../utils/audio';

interface RemindersManagerProps {
  reminders: DailyReminder[];
  onToggleReminder: (id: string) => void;
  onAddCustomReminder: (title: string, time: string, category: DailyReminder['category'], notes?: string) => void;
  onDeleteReminder: (id: string) => void;
  streak: number;
}

export default function RemindersManager({
  reminders,
  onToggleReminder,
  onAddCustomReminder,
  onDeleteReminder,
  streak
}: RemindersManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState<DailyReminder['category']>('health');
  const [newNotes, setNewNotes] = useState('');

  // Submit new reminder details
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    Tones.success();
    onAddCustomReminder(newTitle, newTime, newCategory, newNotes.trim() || undefined);
    
    // Reset Form
    setNewTitle('');
    setNewTime('09:00');
    setNewCategory('health');
    setNewNotes('');
    setIsAdding(false);
  };

  const getCategoryTheme = (cat: DailyReminder['category']) => {
    const themes = {
      medication: {
        bg: 'bg-rose-50 border-rose-100 text-rose-800',
        badge: 'bg-rose-200 text-rose-900',
        emoji: '💊',
        label: 'Medicación'
      },
      health: {
        bg: 'bg-blue-50 border-blue-100 text-blue-800',
        badge: 'bg-blue-200 text-blue-900',
        emoji: '💧',
        label: 'Salud'
      },
      exercise: {
        bg: 'bg-amber-50 border-amber-100 text-amber-800',
        badge: 'bg-amber-200 text-amber-955',
        emoji: '🚶🏼‍♂️',
        label: 'Ejercicio'
      },
      social: {
        bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
        badge: 'bg-emerald-200 text-emerald-955',
        emoji: '📞',
        label: 'Social'
      },
      mental: {
        bg: 'bg-indigo-50 border-indigo-100 text-indigo-800',
        badge: 'bg-indigo-200 text-indigo-955',
        emoji: '🧠',
        label: 'Mente'
      },
      other: {
        bg: 'bg-stone-50 border-stone-200 text-stone-700',
        badge: 'bg-stone-200 text-stone-800',
        emoji: '✏️',
        label: 'Tarea'
      }
    };
    return themes[cat] || themes.other;
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-4" id="reminders-dashboard">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm">
        
        {/* Daily streak indicator */}
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100" id="reminders-streak-bar">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg shadow-xs">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950 uppercase tracking-widest">Motor de Consistencia</p>
              <p className="text-xs text-stone-600">La constancia diaria apoya tu salud cerebral a largo plazo.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-amber-600 block leading-none">{streak} Días</span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Racha Actual</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Rutinas y Objetivos del Día</h2>
            <p className="text-stone-500 text-xs mt-0.5">Organízate y mantén tus hábitos saludables tachando cada casilla completada.</p>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              id="add-reminder-btn"
              className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Añadir Tarea
            </button>
          )}
        </div>

        {/* Adding reminder form inline */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-stone-50 border border-stone-200 p-5 rounded-2xl mb-6 space-y-4" id="add-reminder-form">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-2">
              <h3 className="text-sm font-bold text-stone-800">Nueva Tarea en la Lista</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wide">Título del Recordatorio</label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="ej: Tomar las vitaminas, Revisar las llaves en el recibidor, Llamar a mi nieto"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wide">Hora Habitual</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wide">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DailyReminder['category'])}
                  className="w-full px-3 py-1.5 text-sm bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-stone-800"
                >
                  <option value="medication">💊 Medicación</option>
                  <option value="health">💧 Salud Esencial</option>
                  <option value="exercise">🚶🏼‍♂️ Ejercicio y Actividad</option>
                  <option value="social">📞 Contacto Social</option>
                  <option value="mental">🧠 Memoria y Mente</option>
                  <option value="other">✏️ Tarea u Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wide">Nota de Apoyo (Pista visual para acordarte)</label>
              <input
                type="text"
                placeholder="ej: Están en el pastillero semanal rojo de cocina..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              Guardar en mi Lista
            </button>
          </form>
        )}

        {/* Reminders list block */}
        <div className="space-y-3" id="reminders-list">
          {reminders.map((rem) => {
            const theme = getCategoryTheme(rem.category);
            return (
              <div
                key={rem.id}
                id={`reminder-row-${rem.id}`}
                className={`flex gap-3 items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  rem.completed 
                    ? 'opacity-65 bg-stone-50/50 border-stone-200' 
                    : 'bg-white hover:bg-stone-50/40 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Big touch target checkbox */}
                  <button
                    onClick={() => {
                      if (!rem.completed) Tones.success();
                      else Tones.click();
                      onToggleReminder(rem.id);
                    }}
                    id={`reminder-checkbox-${rem.id}`}
                    aria-label={`Marcar como ${rem.completed ? 'incompleta' : 'completa'}`}
                    className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 shrink-0 cursor-pointer ${
                      rem.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white hover:bg-stone-50 border-stone-300 hover:border-emerald-500 text-transparent'
                    }`}
                  >
                    <Check className="h-5 w-5 stroke-[3]" />
                  </button>

                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-base leading-none">{theme.emoji}</span>
                      <h4 className={`text-sm md:text-base font-bold text-stone-900 leading-tight truncate ${rem.completed ? 'line-through text-stone-400' : ''}`}>
                        {rem.title}
                      </h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${theme.badge} h-4 flex items-center`}>
                        {theme.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-400 font-medium text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Todos los días a las <strong>{rem.time}</strong></span>
                      {rem.notes && (
                        <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-sans italic text-stone-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                          - Pista: {rem.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button for custom ones */}
                {rem.isCustom && (
                  <button
                    onClick={() => {
                      Tones.fail();
                      onDeleteReminder(rem.id);
                    }}
                    aria-label="Eliminar recordatorio personalizado"
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition shrink-0 active:scale-90 hover:bg-stone-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}

          {reminders.length === 0 && (
            <div className="text-center py-6 text-stone-400 text-sm">
              ✨ No hay tareas en tu lista. ¡Pulsa "+ Añadir Tarea" para configurarla!
            </div>
          )}
        </div>

        {/* Dynamic Reset Action Info */}
        <div className="mt-8 border-t border-stone-100 pt-5 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-emerald-500" />
          <span>Agenda guardada a nivel local. La lista de control diaria se desmarcará a medianoche automáticamente.</span>
        </div>
      </div>
    </div>
  );
}
