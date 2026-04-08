// Browser Web Audio API sound effects — no audio files needed

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine",
  startOffset = 0
) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  gainNode.gain.setValueAtTime(gain, ctx.currentTime + startOffset);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration);
}

export function playCorrect() {
  // Warm two-note ascending chord
  tone(523, 0.15, 0.18);        // C5
  tone(659, 0.25, 0.15, "sine", 0.05); // E5
}

export function playWrong() {
  // Low dull thud
  tone(180, 0.3, 0.2, "triangle");
}

export function playCombo(streak: number) {
  // Escalating ascending tones — pitch rises with streak
  const base = 400 + streak * 40;
  tone(base, 0.1, 0.15);
  tone(base * 1.25, 0.15, 0.12, "sine", 0.08);
  tone(base * 1.5, 0.2, 0.1, "sine", 0.16);
}

export function playLevelUp() {
  // Short fanfare: 4-note ascending
  tone(523, 0.12, 0.18);
  tone(659, 0.12, 0.16, "sine", 0.12);
  tone(784, 0.12, 0.14, "sine", 0.24);
  tone(1047, 0.25, 0.18, "sine", 0.36);
}

export function playAchievement() {
  tone(880, 0.12, 0.15);
  tone(1100, 0.2, 0.12, "sine", 0.1);
}
