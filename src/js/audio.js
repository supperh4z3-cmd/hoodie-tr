// High-Energy Travis Scott / Mike Dean Style Trap Beat via Web Audio API (138 BPM)
let audioCtx = null;
let isAudioEnabled = false;
let beatInterval = null;
let masterGain = null;
let reverbNode = null;
let beatStep = 0;

// Travis Scott / Mike Dean Web Audio Multi-Station Engine
let currentBPM = 138;
let STEP_TIME = (60 / currentBPM) / 4;
let activeStation = 'utopia';

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.12;
      
      reverbNode = createDelayReverb();
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function createDelayReverb() {
  const ctx = audioCtx;
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.22; // stereo slap delay
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3200;
  
  delay.connect(feedback);
  feedback.connect(filter);
  filter.connect(delay);
  filter.connect(masterGain);
  
  return delay;
}

export function toggleAudio() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  isAudioEnabled = !isAudioEnabled;
  localStorage.setItem('void_audio_enabled', isAudioEnabled ? '1' : '0');

  if (isAudioEnabled) {
    startTrapBeat();
    playClick();
  } else {
    stopTrapBeat();
  }
  return isAudioEnabled;
}

export function isSoundActive() {
  return isAudioEnabled;
}

export function initAudioFromStorage() {
  const saved = localStorage.getItem('void_audio_enabled');
  if (saved === '1') {
    isAudioEnabled = true;
  }
  return isAudioEnabled;
}

export function setMasterGainValue(val) {
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
    } catch (e) {}
  }
}

// Crisp mechanical tactile switch sound
export function playClick() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.error(e);
  }
}

// Deep bass swell and metallic chime when adding to cart
export function playAddToCart() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
    subGain.gain.setValueAtTime(0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.29);

    // High metal chime ring
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sawtooth';
    highOsc.frequency.setValueAtTime(1400, now);
    highOsc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
    highGain.gain.setValueAtTime(0.06, now);
    highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(now);
    highOsc.stop(now + 0.23);
  } catch (e) {
    console.error(e);
  }
}

// Massive 808 Sub Drop Burst for the Interactive Thermal Effect section
export function playBassBurst() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.55);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    const dist = ctx.createWaveShaper();
    dist.curve = makeDistortionCurve(12);

    osc.connect(dist);
    dist.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.68);

    const metal = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metal.type = 'sawtooth';
    metal.frequency.setValueAtTime(1300, now);
    metal.frequency.exponentialRampToValueAtTime(240, now + 0.22);
    metalGain.gain.setValueAtTime(0.08, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    metal.connect(metalGain);
    metalGain.connect(ctx.destination);
    metal.start(now);
    metal.stop(now + 0.25);
  } catch (e) {
    console.error(e);
  }
}

// High-tech feed switch glitch sound
export function playFeedSwitch() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1760, now + 0.02);
    osc.frequency.setValueAtTime(440, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.error(e);
  }
}

// ====================================================================
// TRAVIS SCOTT / MIKE DEAN STYLE ENERGETIC TRAP BEAT (138 BPM)
// ====================================================================

// 4 Bars = 64 Steps (16 steps per bar)
// Punchy Kick Pattern
const KICK_PATTERN = [
  1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0,
  1,0,0,0, 0,0,0,0, 0,0,1,0, 0,1,0,0,
  1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0,
  1,0,0,0, 0,0,1,0, 0,0,1,0, 0,1,0,0
];

// Rolling Hi-Hat Pattern with fast rolls (1 = 16th, 2 = 32nd roll pair)
const HAT_PATTERN = [
  1,1,1,1, 1,1,1,2, 1,1,1,1, 1,2,2,1,
  1,1,1,1, 1,1,2,2, 1,1,1,1, 2,2,2,1,
  1,1,1,1, 1,1,1,2, 1,1,1,1, 1,2,2,1,
  1,1,1,1, 1,2,2,2, 1,1,2,1, 2,2,2,2
];

// Open Hat Accents
const OHAT_PATTERN = [
  0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,1,
  0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,1,0,
  0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,1,
  0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,1,0
];

// Snare / Clap on beats 2 & 4 (steps 4 and 12 of each 16-step bar)
const CLAP_PATTERN = [
  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,
  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1,
  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,
  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0
];

// Pitch-Gliding 808 Sub-Bass Pattern (F minor trap scale: F1, Db1, Eb1, C1)
// 29 = F1 (43.65 Hz), 25 = Db1 (34.65 Hz), 27 = Eb1 (38.89 Hz), 24 = C1 (32.70 Hz)
const SUB_PATTERN = [
  29,0,0,0, 0,0,0,0, 0,0,29,0, 0,0,0,0,
  25,0,0,0, 0,0,0,0, 0,0,25,0, 0,27,0,0,
  27,0,0,0, 0,0,0,0, 0,0,27,0, 0,0,0,0,
  24,0,0,0, 0,0,24,0, 0,0,29,0, 0,27,0,0
];

// Mike Dean Synth Chords / Arp notes (Bar 1: Fm, Bar 2: Db, Bar 3: Eb, Bar 4: Bbm/C)
const SYNTH_NOTES = [
  // Bar 1 - Fm (F, Ab, C)
  65, 0, 68, 0, 72, 0, 68, 0, 65, 0, 72, 0, 75, 0, 72, 0,
  // Bar 2 - Db (Db, F, Ab)
  61, 0, 65, 0, 68, 0, 65, 0, 61, 0, 68, 0, 73, 0, 68, 0,
  // Bar 3 - Eb (Eb, G, Bb)
  63, 0, 67, 0, 70, 0, 67, 0, 63, 0, 70, 0, 75, 0, 70, 0,
  // Bar 4 - C / Lead Run (C, E, G, Bb -> Glissando)
  60, 0, 67, 0, 72, 0, 75, 0, 76, 0, 75, 0, 72, 0, 67, 0
];

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function play808Kick(time) {
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(175, time);
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.28);
  
  gain.gain.setValueAtTime(0.85, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);
  
  const dist = ctx.createWaveShaper();
  dist.curve = makeDistortionCurve(10);
  dist.oversample = '2x';
  
  osc.connect(dist);
  dist.connect(gain);
  gain.connect(masterGain);
  
  osc.start(time);
  osc.stop(time + 0.34);
}

function playHiHat(time, isOpen = false, isRoll = false) {
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;
  
  const bufferSize = isOpen ? Math.floor(ctx.sampleRate * 0.12) : Math.floor(ctx.sampleRate * 0.035);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = isOpen ? 6800 : (isRoll ? 10500 : 8500);
  
  const gain = ctx.createGain();
  const duration = isOpen ? 0.12 : (isRoll ? 0.025 : 0.035);
  const vol = isOpen ? 0.09 : (isRoll ? 0.055 : 0.075);
  
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  if (reverbNode) gain.connect(reverbNode);
  
  noise.start(time);
  noise.stop(time + duration + 0.01);
}

function playClap(time) {
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;
  
  [0, 0.01, 0.02].forEach((offset, idx) => {
    const burstLen = Math.floor(ctx.sampleRate * (idx === 2 ? 0.11 : 0.018));
    const buf = ctx.createBuffer(1, burstLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < burstLen; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1300;
    filter.Q.value = 1.2;
    
    const gain = ctx.createGain();
    const burstTime = time + offset;
    gain.gain.setValueAtTime(idx === 2 ? 0.22 : 0.12, burstTime);
    gain.gain.exponentialRampToValueAtTime(0.001, burstTime + (idx === 2 ? 0.12 : 0.018));
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    if (reverbNode) gain.connect(reverbNode);
    
    noise.start(burstTime);
    noise.stop(burstTime + (idx === 2 ? 0.13 : 0.02));
  });

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, time);
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.06);
  oscGain.gain.setValueAtTime(0.18, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
  osc.connect(oscGain);
  oscGain.connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.08);
}

function playSubBass(time, midiNote) {
  const ctx = audioCtx;
  if (!ctx || !masterGain) return;
  
  const freq = midiToFreq(midiNote);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.5, time);
  osc.frequency.exponentialRampToValueAtTime(freq, time + 0.05);
  
  const noteDuration = STEP_TIME * 3.5;
  gain.gain.setValueAtTime(0.35, time);
  gain.gain.setValueAtTime(0.35, time + noteDuration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, time + noteDuration);
  
  const dist = ctx.createWaveShaper();
  dist.curve = makeDistortionCurve(5);
  
  osc.connect(dist);
  dist.connect(gain);
  gain.connect(masterGain);
  
  osc.start(time);
  osc.stop(time + noteDuration + 0.02);
}

function playMikeDeanSynth(time, midiNote) {
  const ctx = audioCtx;
  if (!ctx || !masterGain || !midiNote) return;
  
  const freq = midiToFreq(midiNote);
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, time);
  osc2.frequency.setValueAtTime(freq * 1.006, time);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, time);
  filter.frequency.exponentialRampToValueAtTime(2400, time + 0.08);
  filter.frequency.exponentialRampToValueAtTime(600, time + STEP_TIME * 1.8);
  filter.Q.value = 4.0;
  
  const synthGain = ctx.createGain();
  synthGain.gain.setValueAtTime(0.08, time);
  synthGain.gain.exponentialRampToValueAtTime(0.001, time + STEP_TIME * 2.0);
  
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(synthGain);
  synthGain.connect(masterGain);
  if (reverbNode) synthGain.connect(reverbNode);
  
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + STEP_TIME * 2.2);
  osc2.stop(time + STEP_TIME * 2.2);
}

function makeDistortionCurve(amount) {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export function setRadioStationProfile(stationId) {
  activeStation = stationId;
  if (stationId === 'utopia') currentBPM = 138;
  else if (stationId === 'circus') currentBPM = 144;
  else if (stationId === 'desert') currentBPM = 74;
  else if (stationId === 'astroworld') currentBPM = 68;
  
  if (isAudioEnabled && beatInterval) {
    stopTrapBeat();
    startTrapBeat();
  }
}

function startTrapBeat() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (beatInterval) clearInterval(beatInterval);
  
  beatStep = 0;
  STEP_TIME = (60 / currentBPM) / 4;
  
  if (masterGain) {
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2);
  }
  
  const stepMs = STEP_TIME * 1000;
  
  beatInterval = setInterval(() => {
    if (!audioCtx) { stopTrapBeat(); return; }
    
    const now = audioCtx.currentTime;
    const patIdx = beatStep % KICK_PATTERN.length;
    
    if (activeStation === 'utopia') {
      if (KICK_PATTERN[patIdx]) play808Kick(now);
      if (CLAP_PATTERN[patIdx]) playClap(now);
      if (HAT_PATTERN[patIdx] === 1) playHiHat(now, false, false);
      else if (HAT_PATTERN[patIdx] === 2) {
        playHiHat(now, false, true);
        playHiHat(now + STEP_TIME / 2, false, true);
      }
      if (OHAT_PATTERN[patIdx]) playHiHat(now, true, false);
      if (SUB_PATTERN[patIdx]) playSubBass(now, SUB_PATTERN[patIdx]);
      if (SYNTH_NOTES[patIdx]) playMikeDeanSynth(now, SYNTH_NOTES[patIdx]);
    } else if (activeStation === 'circus') {
      // Circus Maximus runway heavy stacked distortion
      if (KICK_PATTERN[patIdx] || patIdx % 8 === 0) play808Kick(now);
      if (CLAP_PATTERN[patIdx]) playClap(now);
      if (patIdx % 2 === 0) {
        playHiHat(now, false, true);
        playHiHat(now + STEP_TIME / 2, false, true);
      }
      if (SUB_PATTERN[patIdx]) playSubBass(now, SUB_PATTERN[patIdx] * 1.05);
      if (SYNTH_NOTES[patIdx]) playMikeDeanSynth(now, SYNTH_NOTES[patIdx] * 0.75);
    } else if (activeStation === 'desert') {
      // Night Desert Ambient Lo-Fi & Sub Drone
      if (patIdx % 16 === 0) play808Kick(now);
      if (patIdx % 16 === 8) playClap(now);
      if (patIdx % 4 === 0) playHiHat(now, true, false);
      if (SUB_PATTERN[patIdx]) playSubBass(now, SUB_PATTERN[patIdx] * 0.5);
      if (SYNTH_NOTES[patIdx]) playMikeDeanSynth(now, SYNTH_NOTES[patIdx] * 0.5);
    } else if (activeStation === 'astroworld') {
      // Astroworld Chopped & Screwed slow psych groove
      if (patIdx % 8 === 0) play808Kick(now);
      if (patIdx % 16 === 8) playClap(now);
      if (patIdx % 2 === 0) playHiHat(now, false, false);
      if (SUB_PATTERN[patIdx]) playSubBass(now, SUB_PATTERN[patIdx] * 0.707);
      if (SYNTH_NOTES[patIdx]) playMikeDeanSynth(now, SYNTH_NOTES[patIdx] * 0.707);
    }
    
    beatStep++;
  }, stepMs);
}

function stopTrapBeat() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
  
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    } catch (e) { /* ignore */ }
  }
  
  beatStep = 0;
}
