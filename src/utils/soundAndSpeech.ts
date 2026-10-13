// Tarayıcı konuşma sentezi (TTS) ve nazik ses geri bildirim yardımcıları

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  type: 'step' | 'success' | 'warning' | 'click',
  soundEnabled: boolean
): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'step') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'warning') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(262, now + 0.1);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    }
  } catch {
    // Ses hatası etkinliği asla engellemez
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakTurkishText(
  text: string,
  soundEnabled: boolean,
  onEnd?: () => void
): boolean {
  if (!soundEnabled) {
    if (onEnd) onEnd();
    return false;
  }
  if (!isSpeechSupported()) {
    if (onEnd) onEnd();
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.toLowerCase().includes('tr'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeech(): void {
  try {
    if (isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Sessizce yoksay
  }
}
