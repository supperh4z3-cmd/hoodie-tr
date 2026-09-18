// CACTUS FM — Curated Streetwear Continuous Radio Engine
import { toggleAudio, isSoundActive, playClick, setMasterGainValue, setRadioStationProfile } from './audio.js';

export const RADIO_STATIONS = [
  {
    id: 'utopia',
    freq: '89.2',
    name: 'UTOPIA SYNTH TRAP',
    genre: 'Mike Dean Analog Synth & 808s',
    bpm: '138 BPM',
    status: 'CONTINUOUS BROADCAST'
  },
  {
    id: 'circus',
    freq: '95.4',
    name: 'CIRCUS MAXIMUS',
    genre: 'Runway Heavy 808 & Stacking Rolls',
    bpm: '144 BPM',
    status: 'CONTINUOUS BROADCAST'
  },
  {
    id: 'desert',
    freq: '102.1',
    name: 'HOUSTON NIGHT DESERT',
    genre: 'Ambient Lo-Fi Sub Drone & Tape Texture',
    bpm: '74 BPM',
    status: 'CONTINUOUS BROADCAST'
  },
  {
    id: 'astroworld',
    freq: '107.5',
    name: 'ASTROWORLD VAULT',
    genre: 'Chopped & Screwed Psych Groove',
    bpm: '68 BPM',
    status: 'CONTINUOUS BROADCAST'
  }
];

let currentStation = RADIO_STATIONS[0];
let isRadioPlaying = false;
let radioVolume = 0.75;

export function initRadioSystem() {
  const savedVol = localStorage.getItem('cactus_fm_vol');
  if (savedVol) radioVolume = parseFloat(savedVol);

  setupRadioDrawerListeners();
  checkInitialRadioPermission();
  updateRadioUI();
}

// Initial Permission Pop-up
function checkInitialRadioPermission() {
  const perm = localStorage.getItem('cactus_fm_permission');
  const modal = document.getElementById('radioPermissionModal');
  if (!modal) return;

  if (!perm) {
    setTimeout(() => {
      modal.classList.add('open');
    }, 800);
  }

  const approveBtn = document.getElementById('radioApproveBtn');
  const declineBtn = document.getElementById('radioDeclineBtn');

  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      playClick();
      localStorage.setItem('cactus_fm_permission', 'granted');
      modal.classList.remove('open');
      startRadioStation(RADIO_STATIONS[0]);
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      playClick();
      localStorage.setItem('cactus_fm_permission', 'denied');
      modal.classList.remove('open');
    });
  }
}

// Play brief analog radio static tuning burst (200ms)
export function playTuningStatic() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const bufSize = Math.floor(ctx.sampleRate * 0.16);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.14);
    filter.Q.value = 3.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08 * radioVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

export function startRadioStation(station) {
  playTuningStatic();
  currentStation = station;

  if (setRadioStationProfile) {
    setRadioStationProfile(station.id);
  }

  if (!isSoundActive()) {
    toggleAudio();
  }
  isRadioPlaying = true;
  updateRadioUI();
}

export function stopRadio() {
  if (isSoundActive()) {
    toggleAudio();
  }
  isRadioPlaying = false;
  updateRadioUI();
}

export function toggleRadioPlayback() {
  if (isRadioPlaying) {
    stopRadio();
  } else {
    startRadioStation(currentStation);
  }
}

export function setRadioVolume(val) {
  radioVolume = Math.max(0, Math.min(1, val));
  localStorage.setItem('cactus_fm_vol', radioVolume.toString());
  if (setMasterGainValue) {
    setMasterGainValue(radioVolume * 0.15);
  }
  updateRadioUI();
}

export function openRadioDrawer() {
  playClick();
  const drawer = document.getElementById('radioFmDrawer');
  const backdrop = document.getElementById('radioFmBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeRadioDrawer() {
  playClick();
  const drawer = document.getElementById('radioFmDrawer');
  const backdrop = document.getElementById('radioFmBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function updateRadioUI() {
  // Update Navbar Button
  const triggerBtn = document.getElementById('radioTriggerBtn');
  const navFreq = document.getElementById('radioNavFreq');

  if (triggerBtn) {
    triggerBtn.classList.toggle('active', isRadioPlaying);
  }
  if (navFreq) {
    navFreq.textContent = `${currentStation.freq} FM`;
  }

  // Update Drawer / Console elements
  const curFreqEl = document.getElementById('radioCurrentFreq');
  const curNameEl = document.getElementById('radioCurrentName');
  const curGenreEl = document.getElementById('radioCurrentGenre');
  const playBtn = document.getElementById('radioMainPlayBtn');
  const volSlider = document.getElementById('radioVolSlider');
  const volPct = document.getElementById('radioVolPct');

  if (curFreqEl) curFreqEl.textContent = `${currentStation.freq} MHz`;
  if (curNameEl) curNameEl.textContent = currentStation.name;
  if (curGenreEl) curGenreEl.textContent = `${currentStation.genre} // ${currentStation.bpm}`;

  if (playBtn) {
    playBtn.innerHTML = isRadioPlaying ? '⏸ YAYINI DURDUR' : '▶ YAYINI BAŞLAT';
    playBtn.classList.toggle('playing', isRadioPlaying);
  }

  if (volSlider) volSlider.value = Math.round(radioVolume * 100);
  if (volPct) volPct.textContent = `${Math.round(radioVolume * 100)}%`;

  // Update active pill
  document.querySelectorAll('.station-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.stationId === currentStation.id);
  });
}

function setupRadioDrawerListeners() {
  const triggerBtn = document.getElementById('radioTriggerBtn');
  const closeBtn = document.getElementById('radioFmClose');
  const backdrop = document.getElementById('radioFmBackdrop');
  const mainPlayBtn = document.getElementById('radioMainPlayBtn');
  const volSlider = document.getElementById('radioVolSlider');

  if (triggerBtn) triggerBtn.addEventListener('click', openRadioDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeRadioDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeRadioDrawer();
    });
  }

  // Play button in drawer
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
      playClick();
      toggleRadioPlayback();
    });
  }

  // Volume slider
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) / 100;
      setRadioVolume(val);
    });
  }

  // Station pills click
  document.querySelectorAll('.station-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      playClick();
      const stId = pill.dataset.stationId;
      const st = RADIO_STATIONS.find(s => s.id === stId);
      if (st) {
        startRadioStation(st);
      }
    });
  });
}
