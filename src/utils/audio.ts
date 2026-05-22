// Web Audio API helper for accessibility sounds and interactive feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard and prefixed AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (browser security restriction until click)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSineTone(frequency: number, durationMs: number, type: OscillatorType = 'triangle', volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Create oscillator and gain node for volume envelope
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Dynamic compression envelope to prevent popping/clicking:
    // Ramp up fast, ramp down slow.
    const startTime = ctx.currentTime;
    const duration = durationMs / 1000;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05); // quick fade-in
    gainNode.gain.setValueAtTime(volume, startTime + duration - 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // smooth fade-out

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (error) {
    console.warn('AudioContext failed to play sound:', error);
  }
}

// Pre-defined tones
export const Tones = {
  // Simon Colors Tones (Slightly warmer/low-passed pentatonic/consonant frequencies for relaxation)
  green: () => playSineTone(293.66, 350, 'triangle', 0.12),  // D4
  red: () => playSineTone(329.63, 350, 'triangle', 0.12),    // E4
  yellow: () => playSineTone(392.00, 350, 'triangle', 0.12), // G4
  blue: () => playSineTone(440.00, 350, 'triangle', 0.12),   // A4
  
  // Game Actions
  click: () => playSineTone(600, 60, 'sine', 0.08),
  success: () => {
    playSineTone(523.25, 100, 'sine', 0.1); // C5
    setTimeout(() => playSineTone(659.25, 100, 'sine', 0.1), 100); // E5
    setTimeout(() => playSineTone(783.99, 180, 'sine', 0.12), 200); // G5
  },
  levelUp: () => {
    playSineTone(392.00, 80, 'triangle', 0.1); // G4
    setTimeout(() => playSineTone(523.25, 80, 'triangle', 0.1), 80); // C5
    setTimeout(() => playSineTone(659.25, 150, 'triangle', 0.12), 160); // E5
  },
  fail: () => {
    playSineTone(220.00, 200, 'sawtooth', 0.08); // A3
    setTimeout(() => playSineTone(146.83, 350, 'sawtooth', 0.1), 180); // D3
  },
  cardFlip: () => {
    playSineTone(400, 40, 'sine', 0.05);
    setTimeout(() => playSineTone(850, 50, 'sine', 0.04), 40);
  },
  matchFound: () => {
    playSineTone(440, 80, 'sine', 0.08);
    setTimeout(() => playSineTone(554.37, 80, 'sine', 0.08), 80); // C#5
    setTimeout(() => playSineTone(659.25, 120, 'sine', 0.1), 160); // E5
  }
};
