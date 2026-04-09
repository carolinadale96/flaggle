// Browser Web Audio API sound effects — no audio files needed

const SOUND_KEY = "flaggle_sound";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(SOUND_KEY);
  return v === null || v === "on"; // on by default
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
}

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

function play(fn: () => void) {
  if (isSoundEnabled()) fn();
}

export function playCorrect() {
  play(() => {
    tone(523, 0.15, 0.18);
    tone(659, 0.25, 0.15, "sine", 0.05);
  });
}

export function playWrong() {
  play(() => tone(180, 0.3, 0.2, "triangle"));
}

export function playCombo(streak: number) {
  play(() => {
    const base = 400 + streak * 40;
    tone(base, 0.1, 0.15);
    tone(base * 1.25, 0.15, 0.12, "sine", 0.08);
    tone(base * 1.5, 0.2, 0.1, "sine", 0.16);
  });
}

export function playLevelUp() {
  play(() => {
    tone(523, 0.12, 0.18);
    tone(659, 0.12, 0.16, "sine", 0.12);
    tone(784, 0.12, 0.14, "sine", 0.24);
    tone(1047, 0.25, 0.18, "sine", 0.36);
  });
}

export function playAchievement() {
  play(() => {
    tone(880, 0.12, 0.15);
    tone(1100, 0.2, 0.12, "sine", 0.1);
  });
}
