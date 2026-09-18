import { brandDetails, products } from '../data/products.js';
import { addToCart } from './cart.js';
import { playClick } from './audio.js';

const BAG_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" style="vertical-align: middle; margin-right: 6px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

let activeProduct = null;
let selectedSize = 'L';

// ====================================================================
// 1. QUICK VIEW MODAL
// ====================================================================
export function openQuickView(product) {
  playClick();
  activeProduct = product;
  
  const firstAvailable = product.sizes.find(s => s.inStock)?.size || 'L';
  selectedSize = firstAvailable;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="modal-visual-col">
      <img src="${product.image}" alt="${product.name}" class="modal-img">
    </div>
    <div class="modal-info-col">
      <div class="modal-meta-top">
        <span class="card-badge ${product.badgeType}">${product.badge}</span>
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dark);">${product.code}</span>
      </div>
      <h2 class="modal-title">${product.name}</h2>
      <div class="modal-price">${product.price.toLocaleString('tr-TR')} ${brandDetails.currency}</div>
      <p class="modal-desc">${product.description}</p>

      <div class="modal-specs-box">
        <div class="modal-spec-row">
          <span class="spec-k">KUMAŞ / GRAMAJ:</span>
          <span class="spec-v">${product.weight}</span>
        </div>
        <div class="modal-spec-row">
          <span class="spec-k">KALIP SİLÜETİ:</span>
          <span class="spec-v">${product.cut}</span>
        </div>
        <div class="modal-spec-row">
          <span class="spec-k">MODEL REFERANSI:</span>
          <span class="spec-v" style="color: var(--text-primary);">${product.modelInfo}</span>
        </div>
      </div>

      <div class="size-selector-wrap">
        <div class="size-label-row">
          <span>BEDEN SEÇİNİZ (OVERSIZE FIT):</span>
          <span id="stockStatusText" style="color: var(--accent-acid);">Stokta var</span>
        </div>
        <div class="size-options" id="modalSizeOptions">
          ${product.sizes.map(s => `
            <button class="size-btn ${s.size === selectedSize ? 'selected' : ''} ${!s.inStock ? 'disabled' : ''}" 
                    data-size="${s.size}" 
                    ${!s.inStock ? 'disabled' : ''}>
              ${s.size}
            </button>
          `).join('')}
        </div>
      </div>

      <button class="modal-add-btn" id="modalAddToCartBtn">
        ${BAG_ICON} ÇANTAYA EKLE [${selectedSize}]
      </button>

      <a href="#product/${product.id}" class="modal-view-full-btn" onclick="document.getElementById('quickViewCloseBtn')?.click();">
        TÜM DETAYLARI İNCELE →
      </a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Size buttons
  const sizeOptions = body.querySelectorAll('.size-btn');
  sizeOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      sizeOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size');
      
      const addBtn = document.getElementById('modalAddToCartBtn');
      if (addBtn) {
        addBtn.innerHTML = `${BAG_ICON} ÇANTAYA EKLE [${selectedSize}]`;
      }
    });
  });

  // Add to cart
  const addBtn = document.getElementById('modalAddToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(activeProduct, selectedSize, 1);
      closeQuickView();
    });
  }
}

export function closeQuickView() {
  playClick();
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('quickViewCloseBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuickView();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickView();
  });
}

// ====================================================================
// 2. INTERACTIVE SMART FIT & SIZE ADVISOR MODAL
// ====================================================================
export function openSmartFitModal() {
  playClick();

  const existing = document.getElementById('smartFitModal');
  if (existing) existing.remove();

  let userHeight = 182;
  let userWeight = 75;
  let userPreference = 'slouch'; // 'slouch' or 'boxy'

  const modal = document.createElement('div');
  modal.className = 'cart-backdrop open';
  modal.id = 'smartFitModal';
  modal.style.zIndex = '12500';

  function calculateRecommendedSize(h, w, pref) {
    let base = 'M';
    if (h < 172 && w < 65) base = 'S';
    else if (h <= 180 && w <= 75) base = 'M';
    else if (h <= 190 && w <= 88) base = 'L';
    else base = 'XL';

    // Slouch preference upgrades by 1 size if on borderline
    if (pref === 'slouch') {
      if (base === 'S' && (h >= 170 || w >= 62)) base = 'M';
      else if (base === 'M' && (h >= 177 || w >= 72)) base = 'L';
      else if (base === 'L' && (h >= 186 || w >= 83)) base = 'XL';
    }

    const descriptions = {
      S: 'Göğüs: 65 cm | Boy: 73 cm — Düşük omuz başlangıcı, kontrollü döküm.',
      M: 'Göğüs: 68 cm | Boy: 75 cm — Bel ve basende rahat akış, ideal oversize hacmi.',
      L: 'Göğüs: 72 cm | Boy: 77 cm — Travis Scott Slouch dökümü. Paçalarda çift kat yığılma.',
      XL: 'Göğüs: 76 cm | Boy: 79 cm — Maksimalist brutalist silüet, ayakkabıyı tamamen örten puddle paçalar.'
    };

    return {
      size: base,
      details: descriptions[base]
    };
  }

  function renderModalContent(activeTab = 'calculator') {
    const rec = calculateRecommendedSize(userHeight, userWeight, userPreference);

    return `
      <div class="fit-modal-chassis">
        <button id="closeSmartFitBtn" class="fit-modal-close" aria-label="Kapat">✕</button>
        
        <div class="fit-modal-header">
          <span class="cactus-tag-badge">// TRAVIS SCOTT KALIP LABORATUVARI</span>
          <h2 class="fit-modal-title">AKILLI BEDEN REHBERİ</h2>
        </div>

        <!-- TABS -->
        <div class="fit-tabs-row">
          <button class="fit-tab-btn ${activeTab === 'calculator' ? 'active' : ''}" data-tab="calculator">
            ⚡ AKILLI BEDEN BULUCU
          </button>
          <button class="fit-tab-btn ${activeTab === 'chart' ? 'active' : ''}" data-tab="chart">
            📐 ÖLÇÜ MATRİSİ (CM)
          </button>
        </div>

        <!-- TAB 1: CALCULATOR -->
        <div class="fit-tab-body" id="fitTabCalculator" style="${activeTab === 'calculator' ? 'display: block;' : 'display: none;'}">
          <div class="fit-inputs-grid">
            <div class="fit-field">
              <div class="field-label-row">
                <span>BOYUNUZ:</span>
                <strong class="field-val" id="valHeightText">${userHeight} cm</strong>
              </div>
              <input type="range" min="160" max="205" value="${userHeight}" class="fit-slider" id="inputHeight">
            </div>

            <div class="fit-field">
              <div class="field-label-row">
                <span>KİLONUZ:</span>
                <strong class="field-val" id="valWeightText">${userWeight} kg</strong>
              </div>
              <input type="range" min="50" max="120" value="${userWeight}" class="fit-slider" id="inputWeight">
            </div>
          </div>

          <div class="fit-preference-box">
            <span class="pref-title">İSTEDİĞİNİZ DURUŞ TARZI:</span>
            <div class="pref-btn-group">
              <button class="pref-btn ${userPreference === 'slouch' ? 'active' : ''}" data-pref="slouch">
                🔥 TRAVIS SLOUCH (AŞIRI DÖKÜMLÜ)
              </button>
              <button class="pref-btn ${userPreference === 'boxy' ? 'active' : ''}" data-pref="boxy">
                📦 STANDART BOXY (KUTU KALIP)
              </button>
            </div>
          </div>

          <!-- RESULT CARD -->
          <div class="fit-result-card" id="fitResultCard">
            <div class="result-badge">ÖNERİLEN BEDENİNİZ</div>
            <div class="result-size-display" id="resultSizeDisplay">${rec.size}</div>
            <p class="result-desc" id="resultDescDisplay">${rec.details}</p>
            <div class="result-tip">
              <strong>İPUCU:</strong> 520 GSM kumaşlarımız ağır gramajı sayesinde vücut hatlarını belli etmez, doğal kumaş ağırlığı ile aşağı dökülür. Bir beden küçük almanıza gerek yoktur.
            </div>
          </div>
        </div>

        <!-- TAB 2: MEASUREMENT CHART -->
        <div class="fit-tab-body" id="fitTabChart" style="${activeTab === 'chart' ? 'display: block;' : 'display: none;'}">
          <table class="fit-table">
            <thead>
              <tr>
                <th>BEDEN</th>
                <th>GÖĞÜS (HOODIE)</th>
                <th>BOY (HOODIE)</th>
                <th>BEL (BAGGY)</th>
                <th>PAÇA GENİŞLİĞİ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>S</strong></td>
                <td>65 cm</td>
                <td>73 cm</td>
                <td>74-82 cm</td>
                <td>30 cm</td>
              </tr>
              <tr>
                <td><strong>M</strong></td>
                <td>68 cm</td>
                <td>75 cm</td>
                <td>78-88 cm</td>
                <td>32 cm</td>
              </tr>
              <tr class="highlight">
                <td><strong>L (Önerilen)</strong></td>
                <td>72 cm</td>
                <td>77 cm</td>
                <td>84-96 cm</td>
                <td>34 cm</td>
              </tr>
              <tr>
                <td><strong>XL</strong></td>
                <td>76 cm</td>
                <td>79 cm</td>
                <td>90-104 cm</td>
                <td>36 cm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  modal.innerHTML = renderModalContent('calculator');
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  function attachListeners() {
    const closeBtn = document.getElementById('closeSmartFitBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        playClick();
        modal.remove();
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = '';
      }
    });

    // Tab switching
    modal.querySelectorAll('.fit-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClick();
        const tab = btn.dataset.tab;
        modal.innerHTML = renderModalContent(tab);
        attachListeners();
      });
    });

    // Inputs
    const inHeight = document.getElementById('inputHeight');
    const inWeight = document.getElementById('inputWeight');
    const valHText = document.getElementById('valHeightText');
    const valWText = document.getElementById('valWeightText');
    const sizeDisplay = document.getElementById('resultSizeDisplay');
    const descDisplay = document.getElementById('resultDescDisplay');

    function updateCalculations() {
      const rec = calculateRecommendedSize(userHeight, userWeight, userPreference);
      if (valHText) valHText.textContent = `${userHeight} cm`;
      if (valWText) valWText.textContent = `${userWeight} kg`;
      if (sizeDisplay) sizeDisplay.textContent = rec.size;
      if (descDisplay) descDisplay.textContent = rec.details;
    }

    if (inHeight) {
      inHeight.addEventListener('input', (e) => {
        userHeight = parseInt(e.target.value, 10);
        updateCalculations();
      });
    }

    if (inWeight) {
      inWeight.addEventListener('input', (e) => {
        userWeight = parseInt(e.target.value, 10);
        updateCalculations();
      });
    }

    // Preferences
    modal.querySelectorAll('.pref-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClick();
        userPreference = btn.dataset.pref;
        modal.querySelectorAll('.pref-btn').forEach(b => b.classList.toggle('active', b === btn));
        updateCalculations();
      });
    });
  }

  attachListeners();
}
