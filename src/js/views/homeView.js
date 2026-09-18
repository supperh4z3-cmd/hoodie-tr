import { products, brandDetails } from '../../data/products.js';
import { playClick, playFeedSwitch, playBassBurst } from '../audio.js';
import { isWishlisted, toggleWishlist } from '../wishlist.js';

const BADGE_MARK = `<span class="typo-mark" style="color: var(--accent-flame); font-weight: 800; margin-right: 4px;">//</span>`;

// 3 Real High-Fashion / Streetwear Runway Feeds with Synchronized Copy
const HERO_FEEDS = [
  {
    idx: 0,
    videoSrc: '/assets/video/fashion_1.mp4',
    badge: 'DROP 01: CIRCUS MAXIMUS // HEAVYWEIGHT 520 GSM',
    titleHtml: `CACTUS <span class="outline-text">UTOPIA</span> <span class="flame-highlight">OVERSIZED.</span>`,
    desc: '520 GSM kalın penye pamuk kumaşlar, podyum silüetlerinin brutal dökümü ve jakarlı dekonstrüktif kesimler. Travis Scott & Houston yüksek podyum sokak modası.',
    label: 'FEED 01 // RUNWAY',
    iso: 'CAM 01 // RUNWAY ARCHIVE'
  },
  {
    idx: 1,
    videoSrc: '/assets/video/fashion_2.mp4',
    badge: 'STREET CONCEPT // RAW VINTAGE WASH',
    titleHtml: `RAW <span class="outline-text">SHADOW</span> <span class="flame-highlight">DRAPES.</span>`,
    desc: 'Gece sokak ışıklarında dekonstrüktif yıpratılmış dikişler, asimetrik çift yönlü metal fermuarlar ve brutalist karanlık couture sokak duruşu.',
    label: 'FEED 02 // STREET',
    iso: 'CAM 02 // NIGHT CONCEPT'
  },
  {
    idx: 2,
    videoSrc: '/assets/video/fashion_3.mp4',
    badge: 'HEAVYWEIGHT VAULT // PUDDLE COUTURE',
    titleHtml: `PUDDLE <span class="outline-text">COUTURE</span> <span class="flame-highlight">SILHOUETTES.</span>`,
    desc: 'Sneaker ve botların üzerine dökülen devasa baggy paçalar, çift kat astarlı ağır kapüşon ve mimari hacimli kalıplarla sınırları zorlayan sokak haute couture.',
    label: 'FEED 03 // COUTURE',
    iso: 'CAM 03 // COUTURE STRUT'
  }
];

export function renderHomeView() {
  const featured = products.slice(0, 3);
  const initialFeed = HERO_FEEDS[0];

  return `
    <div class="view-home">
      <!-- FULL-BLEED 3-VIDEO FASHION LOOP HERO -->
      <section class="video-hero-section">
        <div class="video-container">
          <video id="heroVideo1" autoplay loop muted playsinline class="hero-video-element active" preload="auto">
            <source src="${HERO_FEEDS[0].videoSrc}" type="video/mp4">
          </video>
          <video id="heroVideo2" loop muted playsinline class="hero-video-element" preload="auto">
            <source src="${HERO_FEEDS[1].videoSrc}" type="video/mp4">
          </video>
          <video id="heroVideo3" loop muted playsinline class="hero-video-element" preload="auto">
            <source src="${HERO_FEEDS[2].videoSrc}" type="video/mp4">
          </video>
          
          <div class="video-gradient-overlay"></div>
          <div class="video-scanline-fx"></div>
          
          <!-- CAMCORDER / THERMAL HUD OVERLAY -->
          <div class="camcorder-hud">
            <div class="hud-top-row">
              <div class="hud-rec"><span class="rec-dot"></span> LIVE REC [SP]</div>
              <div class="hud-timestamp" id="hudTimestamp">00:24:19 // 24 FPS</div>
              <div class="hud-battery">BATT [||||] 94%</div>
            </div>
            
            <div class="hud-crosshair-center">
              <span class="reticle-h"></span>
              <span class="reticle-v"></span>
              <span class="hud-iso" id="hudIso">${initialFeed.iso}</span>
            </div>

            <div class="hud-bottom-row">
              <div class="hud-geo">${brandDetails.coordinates}</div>
              <div class="hud-controls">
                <div class="video-progress-dots" id="videoProgressDots">
                  ${HERO_FEEDS.map((feed, i) => `
                    <button class="vdot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Geçiş ${feed.label}">
                      <span class="dot-indicator"></span>
                      <span class="dot-text">${feed.label}</span>
                    </button>
                  `).join('')}
                </div>
                <button class="hud-video-btn" id="videoSoundBtn">
                  <span class="speaker-icon">🔈</span> SESİ AÇ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- HERO EDITORIAL OVERLAY CONTENT (SYNCHRONIZED WITH ACTIVE VIDEO) -->
        <div class="hero-overlay-content">
          <div class="hero-content-inner" id="heroContentInner">
            <div class="cactus-tag-badge" id="heroBadge">
              ${BADGE_MARK} <span id="heroBadgeText">${initialFeed.badge}</span>
            </div>
            
            <h1 class="hero-cactus-title" id="heroTitle">
              ${initialFeed.titleHtml}
            </h1>

            <p class="hero-cactus-desc" id="heroDesc">
              ${initialFeed.desc}
            </p>

            <div class="hero-btn-row">
              <a href="#shop" class="btn-cactus-primary">
                MAĞAZAYI KEŞFET →
              </a>
              <a href="#lookbook" class="btn-cactus-outline">
                LOOKBOOK RUNWAY
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- TICKER MARQUEE -->
      <div class="cactus-ticker">
        <div class="ticker-track">
          <div class="ticker-item">
            <span class="cactus-star">//</span> 520 GSM HEAVYWEIGHT FRENCH TERRY
            <span class="cactus-star">//</span> 2.500 ₺ ÜZERİ ÜCRETSİZ HIZLI KARGO
            <span class="cactus-star">//</span> KOD: <strong style="color: var(--accent-flame);">CACTUS10</strong> İLE %10 İNDİRİM
            <span class="cactus-star">//</span> DECONSTRUCTED VINTAGE WASH
            <span class="cactus-star">//</span> SINIRLI ÜRETİM BATCH 01
          </div>
          <div class="ticker-item">
            <span class="cactus-star">//</span> 520 GSM HEAVYWEIGHT FRENCH TERRY
            <span class="cactus-star">//</span> 2.500 ₺ ÜZERİ ÜCRETSİZ HIZLI KARGO
            <span class="cactus-star">//</span> KOD: <strong style="color: var(--accent-flame);">CACTUS10</strong> İLE %10 İNDİRİM
            <span class="cactus-star">//</span> DECONSTRUCTED VINTAGE WASH
            <span class="cactus-star">//</span> SINIRLI ÜRETİM BATCH 01
          </div>
        </div>
      </div>

      <!-- FEATURED DROP CAPSULE (3 KEY PIECES) -->
      <section class="home-featured-section">
        <div class="section-container">
          <div class="section-header-row">
            <div>
              <span class="section-sub">// ÖNE ÇIKAN PARÇALAR</span>
              <h2 class="section-main-title">KEY CAPSULE PIECES</h2>
            </div>
            <a href="#shop" class="view-all-link">TÜMÜNÜ İNCELE (6 PARÇA) →</a>
          </div>

          <div class="featured-cards-grid">
            ${featured.map((product, idx) => `
              <div class="featured-card scroll-reveal" style="animation-delay: ${idx * 0.15}s">
                <div class="featured-img-wrap">
                  <span class="item-badge ${product.badgeType}">${product.badge}</span>
                  <button class="card-wishlist-toggle-btn wishlist-toggle-btn ${isWishlisted(product.id) ? 'active' : ''}" data-product-id="${product.id}" aria-label="Favorilere Ekle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <a href="#product/${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                  </a>
                </div>
                <div class="featured-card-info">
                  <div class="featured-meta">
                    <span>${product.categoryName}</span>
                    <span class="item-code">${product.code}</span>
                  </div>
                  <h3 class="featured-title">
                    <a href="#product/${product.id}">${product.name}</a>
                  </h3>
                  <div class="featured-footer">
                    <span class="featured-price">${product.price.toLocaleString('tr-TR')} ${brandDetails.currency}</span>
                    <a href="#product/${product.id}" class="inspect-btn">İNCELE →</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- EDITORIAL CAMPAIGN BANNER -->
      <section class="home-campaign-banner">
        <div class="campaign-inner">
          <div class="campaign-visual scroll-reveal-left">
            <img src="/assets/products/lookbook_travis_campaign.jpg" alt="Travis Scott Utopia Campaign Lookbook">
            <div class="campaign-tag-stamp">HOUSTON // CIRCUS MAXIMUS 2026</div>
          </div>
          <div class="campaign-text scroll-reveal-right">
            <span class="cactus-tag-badge">${BADGE_MARK} RUNWAY EDITORIAL</span>
            <h2 class="campaign-title">
              DESERT SOUNDS &
              <span style="color: var(--accent-sand);">RAW DRAPE CUTS.</span>
            </h2>
            <p class="campaign-desc">
              Utopia çöl çekimlerinde sergilenen koleksiyon; ekstra düşük omuzlar, kalın çift yönlü metal fermuarlar ve ayak bileğinde yığılan taktik askılı parachute pantolonlarla çağdaş sokak silüetini yeniden tanımlıyor.
            </p>
            <div class="campaign-btn-row">
              <a href="#editorial" class="btn-cactus-primary">EDİTÖRYAL ARŞİVE GİT</a>
              <a href="#shop" class="btn-cactus-outline">PARÇALARI SATIN AL</a>
            </div>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE THERMAL X-RAY & SPECTRUM LAB (NEW EFFECT SECTION) -->
      <section class="thermal-lab-section mode-thermal" id="thermalLabSection">
        <div class="thermal-lab-container">
          <div class="thermal-lab-header">
            <div>
              <span class="cactus-tag-badge">${BADGE_MARK} INTERACTIVE LABORATORY</span>
              <h2 class="thermal-main-title">
                THERMAL SPECTRUM &
                <span class="thermal-title-highlight">520 GSM X-RAY VAULT.</span>
              </h2>
            </div>
            
            <div class="thermal-mode-switcher">
              <span class="mode-label">VISION MODE:</span>
              <button class="mode-btn active" data-mode="thermal" aria-label="Thermal Infrared">
                <span class="mode-indicator flame"></span> THERMAL
              </button>
              <button class="mode-btn" data-mode="night" aria-label="Night Vision">
                <span class="mode-indicator green"></span> NIGHT VISION
              </button>
              <button class="mode-btn" data-mode="negative" aria-label="Negative Couture">
                <span class="mode-indicator cyan"></span> NEGATIVE
              </button>
              <button class="mode-btn" data-mode="xray" aria-label="Raw X-Ray">
                <span class="mode-indicator mono"></span> X-RAY
              </button>
            </div>
          </div>

          <div class="thermal-lab-grid">
            <!-- INTERACTIVE AUDIO SPECTRUM & FREQUENCY OSCILLOSCOPE -->
            <div class="thermal-canvas-card" id="canvasCard">
              <div class="card-hud-top">
                <span class="hud-status-rec"><span class="rec-dot"></span> LIVE 138 BPM OSCILLOSCOPE</span>
                <span class="hud-coords">29.7604° N, 95.3698° W</span>
              </div>

              <canvas id="thermalSpectrumCanvas" class="thermal-spectrum-canvas"></canvas>

              <div class="card-hud-bottom">
                <div class="hud-readouts">
                  <div class="readout-item">
                    <span class="label">SUB FREQ</span>
                    <span class="value" id="readoutFreq">32.7 Hz</span>
                  </div>
                  <div class="readout-item">
                    <span class="label">DENSITY</span>
                    <span class="value" id="readoutDensity">520 GSM</span>
                  </div>
                  <div class="readout-item">
                    <span class="label">RESONANCE</span>
                    <span class="value" id="readoutRes">98.4%</span>
                  </div>
                </div>

                <button class="btn-bass-burst" id="btnBassBurst" title="808 Sub Drop ve Ekran Titreşimi">
                  <span class="pulse-ring"></span>
                  <span class="burst-text">⚡ 808 BASS BURST TETİKLE</span>
                </button>
              </div>
            </div>

            <!-- 520 GSM DECONSTRUCTED FABRIC X-RAY VIEWER -->
            <div class="thermal-xray-card" id="thermalXrayCard">
              <div class="xray-image-wrap" id="xrayImageWrap">
                <img src="/assets/products/hoodie_utopia_mocha.jpg" alt="520 GSM Fabric X-Ray Analysis" id="xrayImage">
                <div class="xray-thermal-layer" id="xrayThermalLayer"></div>
                <div class="xray-reticle" id="xrayReticle">
                  <span class="reticle-corner tl"></span>
                  <span class="reticle-corner tr"></span>
                  <span class="reticle-corner bl"></span>
                  <span class="reticle-corner br"></span>
                  <span class="reticle-cross"></span>
                  <div class="reticle-data">
                    <span id="reticleYarn">YARN: 3-PLY LOOP</span>
                    <span id="reticleTension">TENSION: 420N</span>
                  </div>
                </div>
              </div>

              <div class="xray-card-info">
                <div class="xray-tech-row">
                  <span class="tech-tag">CIRCUS MAXIMUS RAW SPEC</span>
                  <span class="tech-id">SPEC ID // TS-520-MOCHA</span>
                </div>
                <h3 class="xray-title">MİKROSKOBİK KUMAŞ VE İLMEK ANALİZİ</h3>
                <p class="xray-desc">
                  İmlecinizi veya parmağınızı görselin üzerinde gezdirin: 520 GSM ağır Fransız havlu örmesinin mikroskobik yoğunluk haritası, güçlendirilmiş punto dikişleri ve brutalist form dayanıklılığı.
                </p>
                <div class="xray-meter-bar">
                  <div class="meter-label">
                    <span>LIF YOĞUNLUĞU // DENSITY GAUGE</span>
                    <span id="gaugeVal">94.8% OPTIMAL</span>
                  </div>
                  <div class="meter-track">
                    <div class="meter-fill" id="xrayMeterFill" style="width: 94%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function mountHomeView() {
  // 1. Dual / Triple Video crossfade
  const videos = [
    document.getElementById('heroVideo1'),
    document.getElementById('heroVideo2'),
    document.getElementById('heroVideo3')
  ].filter(Boolean);
  
  const dots = document.querySelectorAll('.vdot');
  const heroContentInner = document.getElementById('heroContentInner');
  const heroBadgeText = document.getElementById('heroBadgeText');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const hudIso = document.getElementById('hudIso');

  let currentVideoIndex = 0;
  let videoInterval = null;

  function switchFeed(newIdx, isUserInteraction = false) {
    if (newIdx === currentVideoIndex) return;

    if (isUserInteraction) {
      playFeedSwitch();
    }

    const prevIdx = currentVideoIndex;
    currentVideoIndex = newIdx;
    const feed = HERO_FEEDS[currentVideoIndex];

    // Smooth video crossfade
    if (videos[prevIdx]) videos[prevIdx].classList.remove('active');
    if (videos[currentVideoIndex]) videos[currentVideoIndex].classList.add('active');

    // Update dots
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentVideoIndex);
    });

    // Update HUD ISO text
    if (hudIso && feed) {
      hudIso.textContent = feed.iso;
    }

    // Synchronized Glitch / Morph Animation for Hero Copy
    if (heroContentInner && feed) {
      heroContentInner.classList.remove('glitch-transition');
      void heroContentInner.offsetWidth;
      heroContentInner.classList.add('glitch-transition');

      if (heroBadgeText) heroBadgeText.textContent = feed.badge;
      if (heroTitle) heroTitle.innerHTML = feed.titleHtml;
      if (heroDesc) heroDesc.textContent = feed.desc;

      setTimeout(() => {
        if (heroContentInner) heroContentInner.classList.remove('glitch-transition');
      }, 500);
    }
  }

  if (videos.length > 0) {
    videos.forEach((v, i) => {
      v.muted = true;
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
      if (i !== 0) v.classList.remove('active');
    });

    videoInterval = setInterval(() => {
      const nextIdx = (currentVideoIndex + 1) % videos.length;
      switchFeed(nextIdx, false);
    }, 8000);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        playClick();
        const idx = parseInt(dot.dataset.idx, 10);
        switchFeed(idx, true);
        
        clearInterval(videoInterval);
        videoInterval = setInterval(() => {
          const nextIdx = (currentVideoIndex + 1) % videos.length;
          switchFeed(nextIdx, false);
        }, 8000);
      });
    });
  }

  // Video sound toggle
  const soundBtn = document.getElementById('videoSoundBtn');
  if (soundBtn && videos.length > 0) {
    soundBtn.addEventListener('click', () => {
      playClick();
      const allMuted = videos[0].muted;
      videos.forEach(v => v.muted = !allMuted);
      if (!allMuted) {
        soundBtn.innerHTML = '<span class="speaker-icon">🔈</span> SESİ AÇ';
        soundBtn.classList.remove('sound-on');
      } else {
        soundBtn.innerHTML = '<span class="speaker-icon">🔊</span> SESİ KAPAT';
        soundBtn.classList.add('sound-on');
      }
    });
  }

  // HUD timestamp counter
  const tsEl = document.getElementById('hudTimestamp');
  if (tsEl) {
    let sec = 24 * 60 + 19;
    setInterval(() => {
      sec++;
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      tsEl.textContent = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} // 24 FPS`;
    }, 1000);
  }

  // Wishlist buttons on featured cards
  document.querySelectorAll('.featured-cards-grid .card-wishlist-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pId = btn.getAttribute('data-product-id');
      toggleWishlist(pId);
      btn.classList.toggle('active', isWishlisted(pId));
    });
  });

  // 2. INTERACTIVE THERMAL LAB & OSCILLOSCOPE LOGIC
  initThermalLab();

  // 3. Scroll reveal animations
  const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  }
}

function initThermalLab() {
  const section = document.getElementById('thermalLabSection');
  const canvas = document.getElementById('thermalSpectrumCanvas');
  const canvasCard = document.getElementById('canvasCard');
  const burstBtn = document.getElementById('btnBassBurst');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const xrayWrap = document.getElementById('xrayImageWrap');
  const xrayReticle = document.getElementById('xrayReticle');
  const reticleYarn = document.getElementById('reticleYarn');
  const reticleTension = document.getElementById('reticleTension');
  const gaugeVal = document.getElementById('gaugeVal');
  const meterFill = document.getElementById('xrayMeterFill');

  if (!section || !canvas) return;

  // Active color palette
  let currentMode = 'thermal';
  const PALETTES = {
    thermal: { stroke: '#ff5500', glow: 'rgba(255, 85, 0, 0.4)', sec: '#e5a93c' },
    night: { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)', sec: '#86efac' },
    negative: { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', sec: '#a5f3fc' },
    xray: { stroke: '#f5f3ef', glow: 'rgba(245, 243, 239, 0.35)', sec: '#a1a1aa' }
  };

  // Setup mode switcher
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      const mode = btn.dataset.mode;
      currentMode = mode;
      modeBtns.forEach(b => b.classList.toggle('active', b === btn));
      section.className = `thermal-lab-section mode-${mode}`;
    });
  });

  // Canvas Oscilloscope Animation
  const ctx = canvas.getContext('2d');
  let animId = null;
  let time = 0;
  let burstEnergy = 0;
  let mouseMod = { x: 0.5, y: 0.5 };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse / Touch modulation
  function handlePointer(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseMod.x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    mouseMod.y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchmove', handlePointer, { passive: true });

  // Draw loop
  function draw() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const colors = PALETTES[currentMode] || PALETTES.thermal;
    time += 0.035;

    // Smooth burst decay
    if (burstEnergy > 0.01) {
      burstEnergy *= 0.94;
    } else {
      burstEnergy = 0;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Center reference line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw 3 harmonic audio waves
    [
      { freq: 0.015, speed: 1.0, amp: 35 + burstEnergy * 90, color: colors.stroke, width: 2.8 },
      { freq: 0.022, speed: -1.3, amp: 22 + burstEnergy * 60, color: colors.sec, width: 1.6 },
      { freq: 0.008, speed: 0.7, amp: 14 + burstEnergy * 40, color: 'rgba(255,255,255,0.4)', width: 1 }
    ].forEach((wave) => {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = wave.width;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = burstEnergy > 0.2 ? 22 : 12;

      ctx.beginPath();
      for (let x = 0; x < w; x += 3) {
        const modX = x * wave.freq * (0.8 + mouseMod.x * 0.8);
        const mouseLift = (1 - mouseMod.y) * 25;
        const sine1 = Math.sin(modX + time * wave.speed);
        const sine2 = Math.cos(x * 0.03 - time * 0.8) * 0.35;
        const envelope = Math.sin((x / w) * Math.PI); // Pin to ends
        const y = h / 2 + (sine1 + sine2) * wave.amp * envelope - (mouseLift * envelope);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    animId = requestAnimationFrame(draw);
  }

  draw();

  // 808 Bass Burst interaction
  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      playBassBurst();
      burstEnergy = 1.0;

      if (canvasCard) {
        canvasCard.classList.remove('burst-shake');
        void canvasCard.offsetWidth;
        canvasCard.classList.add('burst-shake');
      }

      const freqEl = document.getElementById('readoutFreq');
      const resEl = document.getElementById('readoutRes');
      if (freqEl) freqEl.textContent = '18.4 Hz (SUB PEAK)';
      if (resEl) resEl.textContent = '100% MAXIMUM';

      setTimeout(() => {
        if (freqEl) freqEl.textContent = '32.7 Hz';
        if (resEl) resEl.textContent = '98.4%';
      }, 1500);
    });
  }

  // Interactive Fabric X-Ray Reticle
  if (xrayWrap && xrayReticle) {
    xrayWrap.addEventListener('mousemove', (e) => {
      const rect = xrayWrap.getBoundingClientRect();
      const x = Math.max(15, Math.min(rect.width - 15, e.clientX - rect.left));
      const y = Math.max(15, Math.min(rect.height - 15, e.clientY - rect.top));

      xrayReticle.style.left = `${x}px`;
      xrayReticle.style.top = `${y}px`;
      xrayReticle.style.opacity = '1';

      // Dynamic readout update based on position
      const densityPct = Math.round(92 + (x / rect.width) * 6);
      if (gaugeVal) gaugeVal.textContent = `${densityPct}.8% OPTIMAL`;
      if (meterFill) meterFill.style.width = `${densityPct}%`;
      if (reticleTension) reticleTension.textContent = `TENSION: ${Math.round(400 + y * 0.8)}N`;
    });

    xrayWrap.addEventListener('mouseleave', () => {
      xrayReticle.style.opacity = '0';
    });

    // Touch support for mobile
    xrayWrap.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const rect = xrayWrap.getBoundingClientRect();
        const x = Math.max(15, Math.min(rect.width - 15, e.touches[0].clientX - rect.left));
        const y = Math.max(15, Math.min(rect.height - 15, e.touches[0].clientY - rect.top));
        xrayReticle.style.left = `${x}px`;
        xrayReticle.style.top = `${y}px`;
        xrayReticle.style.opacity = '1';
      }
    }, { passive: true });
  }
}
