import { products, brandDetails } from '../../data/products.js';
import { addToCart } from '../cart.js';
import { playClick } from '../audio.js';

const BADGE_MARK = `<span style="color: var(--accent-flame); font-weight: 800; margin-right: 4px;">//</span>`;
const BAG_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="vertical-align: middle; margin-right: 6px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

let selectedSize = 'L';
let selectedQty = 1;

export function renderProductDetailView(context) {
  const productId = context?.id;
  const product = products.find(p => p.id === productId) || products[0];

  const firstAvailable = product.sizes.find(s => s.inStock)?.size || 'L';
  selectedSize = firstAvailable;
  selectedQty = 1;

  // Recommended products (excluding current)
  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return `
    <div class="view-product-detail">
      <div class="section-container">
        <!-- BREADCRUMB NAVIGATION -->
        <nav class="pdp-breadcrumbs">
          <a href="#home">ANASAYFA</a>
          <span>/</span>
          <a href="#shop">KOLEKSİYON</a>
          <span>/</span>
          <span class="current">${product.name}</span>
        </nav>

        <!-- MAIN PDP GRID -->
        <div class="pdp-main-grid">
          <!-- LEFT: PRODUCT VISUAL GALLERY -->
          <div class="pdp-gallery-col">
            <div class="pdp-main-image-wrap">
              <span class="item-badge ${product.badgeType}">${product.badge}</span>
              <img id="pdpActiveImage" src="${product.image}" alt="${product.name}">
              <div class="pdp-camcorder-stamp">
                <span>●</span> 520 GSM CERTIFIED // AUTHENTIC CACTUS WEAR
              </div>
            </div>

            <!-- THUMBNAILS -->
            <div class="pdp-thumbnails-row">
              ${product.gallery.map((img, idx) => `
                <button class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${img}">
                  <img src="${img}" alt="Açı ${idx + 1}">
                </button>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT: PRODUCT BUYING INFO -->
          <div class="pdp-info-col">
            <div class="pdp-meta-header">
              <span class="pdp-category">${product.categoryName}</span>
              <span class="pdp-code">${product.code}</span>
            </div>

            <h1 class="pdp-title">${product.name}</h1>
            
            <div class="pdp-price-row">
              <div class="pdp-price">${product.price.toLocaleString('tr-TR')} ${brandDetails.currency}</div>
              <div class="pdp-stock-tag">
                ${BADGE_MARK} SINIRLI ÜRETİM BATCH 01
              </div>
            </div>

            <p class="pdp-description">${product.description}</p>

            <!-- TECHNICAL MATRIX BOX -->
            <div class="pdp-tech-matrix">
              <div class="tech-row">
                <span class="tech-k">KUMAŞ / AĞIRLIK</span>
                <span class="tech-v">${product.weight}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">BASKI TEKNOLOJİSİ</span>
                <span class="tech-v">${product.printTech}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">SİLÜET KALIBI</span>
                <span class="tech-v">${product.cut}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">YIKAMA DETAYI</span>
                <span class="tech-v">${product.wash}</span>
              </div>
              <div class="tech-row">
                <span class="tech-k">MANKEN REFERANSI</span>
                <span class="tech-v" style="color: var(--accent-sand);">${product.modelInfo}</span>
              </div>
            </div>

            <!-- SIZE SELECTOR -->
            <div class="pdp-size-selector">
              <div class="pdp-size-header">
                <span>BEDEN SEÇİMİ (OVERSIZE):</span>
                <button class="size-guide-inline-btn" id="pdpSizeGuideBtn">
                  📏 KALIP MATRİSİNİ GÖR
                </button>
              </div>

              <div class="pdp-size-buttons" id="pdpSizeBtns">
                ${product.sizes.map(s => `
                  <button class="pdp-size-pill ${s.size === selectedSize ? 'selected' : ''} ${!s.inStock ? 'disabled' : ''}"
                          data-size="${s.size}"
                          ${!s.inStock ? 'disabled' : ''}>
                    ${s.size}
                    <span class="pdp-stock-dot">${s.inStock ? `${s.stockCount} adet` : 'Tükendi'}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- QUANTITY & ADD TO CART CTA -->
            <div class="pdp-action-row">
              <div class="pdp-qty-stepper">
                <button class="qty-step-btn" id="pdpQtyMinus">-</button>
                <span class="qty-step-val" id="pdpQtyVal">1</span>
                <button class="qty-step-btn" id="pdpQtyPlus">+</button>
              </div>

              <button class="pdp-add-cart-btn" id="pdpAddToCartBtn">
                ${BAG_ICON} ÇANTAYA EKLE [<span id="pdpBtnSizeText">${selectedSize}</span>] // ${(product.price).toLocaleString('tr-TR')} ${brandDetails.currency}
              </button>
            </div>

            <!-- ACCORDIONS -->
            <div class="pdp-accordions">
              <details class="pdp-accordion-item" open>
                <summary>KUMAŞ VE DETAY ÖZELLİKLERİ</summary>
                <div class="accordion-content">
                  <ul>
                    ${product.details.map(d => `<li>${d}</li>`).join('')}
                  </ul>
                </div>
              </details>

              <details class="pdp-accordion-item">
                <summary>KARGO VE TESLİMAT KOŞULLARI</summary>
                <div class="accordion-content">
                  <p>Tüm siparişler özel korumalı şifreli ambalajlarda 24 saat içerisinde anlaşmalı Yurtiçi Kargo güvencesiyle sevk edilir. 2.500 ₺ üzeri siparişlerde kargo tamamen ücretsizdir.</p>
                </div>
              </details>

              <details class="pdp-accordion-item">
                <summary>14 GÜN DEĞİŞİM & İADE HAKKI</summary>
                <div class="accordion-content">
                  <p>Kullanılmamış ve güvenlik etiketleri çıkarılmamış tüm parçaları teslim tarihinden itibaren 14 gün içinde koşulsuz iade edebilir veya beden değişimi talep edebilirsiniz.</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <!-- COMPLETE THE LOOK (RELATED PRODUCTS) -->
        <div class="pdp-related-section">
          <h3 class="related-title">// BU KOMBİNİ TAMAMLA</h3>
          <div class="related-grid">
            ${related.map(rel => `
              <div class="related-card">
                <a href="#product/${rel.id}">
                  <img src="${rel.image}" alt="${rel.name}">
                </a>
                <div class="related-info">
                  <span class="rel-cat">${rel.categoryName}</span>
                  <a href="#product/${rel.id}" class="rel-name">${rel.name}</a>
                  <span class="rel-price">${rel.price.toLocaleString('tr-TR')} ${brandDetails.currency}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function mountProductDetailView(context) {
  const productId = context?.id;
  const product = products.find(p => p.id === productId) || products[0];

  // Thumbnail switching
  const thumbs = document.querySelectorAll('.pdp-thumb-btn');
  const mainImg = document.getElementById('pdpActiveImage');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      playClick();
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.getAttribute('data-src');
      if (mainImg) mainImg.src = src;
    });
  });

  // Size selection
  const sizeBtns = document.querySelectorAll('.pdp-size-pill');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      sizeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size');
      
      const btnSizeText = document.getElementById('pdpBtnSizeText');
      if (btnSizeText) btnSizeText.textContent = selectedSize;
    });
  });

  // Quantity stepper
  const qtyMinus = document.getElementById('pdpQtyMinus');
  const qtyPlus = document.getElementById('pdpQtyPlus');
  const qtyVal = document.getElementById('pdpQtyVal');

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      playClick();
      if (selectedQty > 1) {
        selectedQty--;
        qtyVal.textContent = selectedQty;
      }
    });
    qtyPlus.addEventListener('click', () => {
      playClick();
      selectedQty++;
      qtyVal.textContent = selectedQty;
    });
  }

  // Add to cart
  const addBtn = document.getElementById('pdpAddToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(product, selectedSize, selectedQty);
    });
  }

  // Size guide trigger
  const sizeGuideBtn = document.getElementById('pdpSizeGuideBtn');
  if (sizeGuideBtn) {
    sizeGuideBtn.addEventListener('click', () => {
      playClick();
      const existing = document.getElementById('fitGuideBtn');
      if (existing) existing.click();
    });
  }
}
