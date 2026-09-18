import { products, brandDetails } from '../data/products.js';
import { playClick, playAddToCart } from './audio.js';

let cart = [];
let appliedDiscount = 0;
let appliedPromoCode = null;
let isUpsellDismissed = false;

export function initCart() {
  const saved = localStorage.getItem('void_archive_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }

  setupCartListeners();
  renderCart();
  updateHeaderCounter();
}

function saveCart() {
  localStorage.setItem('void_archive_cart', JSON.stringify(cart));
  updateHeaderCounter();
  renderCart();
}

export function addToCart(product, size = 'L', quantity = 1, customPrice = null) {
  playAddToCart();
  
  const finalPrice = customPrice !== null ? customPrice : product.price;
  const existingIndex = cart.findIndex(item => item.productId === product.id && item.size === size && item.price === finalPrice);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: `${product.id}-${size}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      code: product.code,
      price: finalPrice,
      image: product.image,
      size: size,
      quantity: quantity
    });
  }

  saveCart();
  openCartDrawer();
  showToast(`${product.name} [BEDEN: ${size}] ÇANTAYA EKLENDİ`);
}

export function removeFromCart(itemId) {
  playClick();
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  showToast("ÜRÜN ÇANTADAN ÇIKARILDI");
}

export function updateQuantity(itemId, delta) {
  playClick();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    saveCart();
  }
}

export function openCartDrawer() {
  playClick();
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop) {
    backdrop.classList.add('open');
    if (drawer) drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCartDrawer() {
  playClick();
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop) {
    backdrop.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function updateHeaderCounter() {
  const counter = document.getElementById('cartHeaderCount');
  if (counter) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalQty;
    counter.classList.remove('bounce');
    void counter.offsetWidth;
    if (totalQty > 0) counter.classList.add('bounce');
  }
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const discountEl = document.getElementById('cartDiscount');
  const discountRow = document.getElementById('cartDiscountRow');
  const totalEl = document.getElementById('cartTotal');
  const shippingBarFill = document.getElementById('shippingBarFill');
  const shippingMsg = document.getElementById('shippingMsg');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="44" height="44">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <p>Çantanız Henüz Boş</p>
        <button class="btn-outline-gothic" id="emptyStateExploreBtn" style="font-size: 0.75rem; padding: 0.8rem 1.5rem; margin-top: 1rem;">
          KOLEKSİYONU KEŞFET
        </button>
      </div>
    `;
    const btn = document.getElementById('emptyStateExploreBtn');
    if (btn) {
      btn.addEventListener('click', () => closeCartDrawer());
    }

    if (subtotalEl) subtotalEl.textContent = `0 ${brandDetails.currency}`;
    if (shippingEl) shippingEl.textContent = `0 ${brandDetails.currency}`;
    if (totalEl) totalEl.textContent = `0 ${brandDetails.currency}`;
    if (shippingBarFill) shippingBarFill.style.width = '0%';
    if (shippingMsg) shippingMsg.innerHTML = `Ücretsiz kargo için <strong>${brandDetails.freeShippingThreshold.toLocaleString('tr-TR')} ${brandDetails.currency}</strong> sepet tutarı`;
    if (discountRow) discountRow.style.display = 'none';

    const existingUpsell = document.getElementById('cartUpsellCard');
    if (existingUpsell) existingUpsell.remove();
    return;
  }

  // Render items
  container.innerHTML = cart.map(item => `
    <div class="cart-item-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <span class="cart-item-size-badge">BEDEN: ${item.size}</span>
        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('tr-TR')} ${brandDetails.currency}</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove-btn" data-id="${item.id}" title="Kaldır">✕</button>
    </div>
  `).join('');

  // 1-Click Bundle Upsell Component
  renderUpsellSection();

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= brandDetails.freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : brandDetails.shippingCost;
  
  const discountAmount = appliedDiscount > 0 ? (subtotal * appliedDiscount) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Free shipping progress bar
  const progressPercent = Math.min(100, Math.round((subtotal / brandDetails.freeShippingThreshold) * 100));
  if (shippingBarFill) shippingBarFill.style.width = `${progressPercent}%`;

  if (shippingMsg) {
    if (isFreeShipping) {
      shippingMsg.innerHTML = `<strong>Tebrikler!</strong> Ücretsiz Kargo Kazandınız.`;
    } else {
      const remaining = brandDetails.freeShippingThreshold - subtotal;
      shippingMsg.innerHTML = `Ücretsiz kargo için <strong>${remaining.toLocaleString('tr-TR')} ${brandDetails.currency}</strong> daha ekleyin`;
    }
  }

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('tr-TR')} ${brandDetails.currency}`;
  if (shippingEl) shippingEl.textContent = isFreeShipping ? 'ÜCRETSİZ' : `${shippingCost} ${brandDetails.currency}`;
  
  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${discountAmount.toLocaleString('tr-TR')} ${brandDetails.currency} (%${Math.round(appliedDiscount * 100)})`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = `${grandTotal.toLocaleString('tr-TR')} ${brandDetails.currency}`;
}

function renderUpsellSection() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  // Clean up any legacy outside upsell if present
  const oldOutsideUpsell = document.getElementById('cartUpsellCard');
  if (oldOutsideUpsell && oldOutsideUpsell.parentElement !== container) {
    oldOutsideUpsell.remove();
  }

  if (isUpsellDismissed) {
    const existing = document.getElementById('cartUpsellCard');
    if (existing) existing.remove();
    return;
  }

  // Find a product not already in cart
  const candidate = products.find(p => !cart.some(item => item.productId === p.id));
  if (!candidate) {
    const existing = document.getElementById('cartUpsellCard');
    if (existing) existing.remove();
    return;
  }

  const discountedPrice = Math.round(candidate.price * 0.85);

  let upsellBox = document.getElementById('cartUpsellCard');
  if (!upsellBox) {
    upsellBox = document.createElement('div');
    upsellBox.id = 'cartUpsellCard';
    upsellBox.className = 'cart-upsell-box';
  }

  upsellBox.innerHTML = `
    <div class="cart-upsell-header">
      <div class="upsell-tag-group">
        <span class="upsell-flame-tag">⚡ KOMBİN ÖNERİSİ (%15 İNDİRİM)</span>
      </div>
      <button class="upsell-dismiss-btn" id="dismissUpsellBtn" aria-label="Öneriyi Gizle" title="Öneriyi Gizle">✕</button>
    </div>
    <div class="cart-upsell-content">
      <img src="${candidate.image}" alt="${candidate.name}" class="cart-upsell-img" loading="lazy">
      <div class="cart-upsell-info">
        <h5 class="cart-upsell-title">${candidate.name}</h5>
        <div class="cart-upsell-prices">
          <span class="cart-upsell-new">${discountedPrice.toLocaleString('tr-TR')} ${brandDetails.currency}</span>
          <span class="cart-upsell-old">${candidate.price.toLocaleString('tr-TR')} ${brandDetails.currency}</span>
        </div>
      </div>
      <button class="cart-upsell-btn" id="addUpsellBundleBtn" data-prod-id="${candidate.id}">
        + EKLE
      </button>
    </div>
  `;

  // Append inside the scrollable items container after user-chosen items
  container.appendChild(upsellBox);

  const addBtn = document.getElementById('addUpsellBundleBtn');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(candidate, 'L', 1, discountedPrice);
      showToast(`%15 İNDİRİMLİ ${candidate.name} EKLENDİ!`);
    });
  }

  const dismissBtn = document.getElementById('dismissUpsellBtn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isUpsellDismissed = true;
      upsellBox.remove();
      showToast('Kombin önerisi gizlendi');
    });
  }
}

function setupCartListeners() {
  const triggerBtn = document.getElementById('cartTriggerBtn');
  const closeBtn = document.getElementById('cartCloseBtn');
  const backdrop = document.getElementById('cartBackdrop');

  if (triggerBtn) triggerBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCartDrawer();
    });
  }

  const itemsContainer = document.getElementById('cartItemsContainer');
  if (itemsContainer) {
    itemsContainer.addEventListener('click', (e) => {
      const target = e.target;
      const removeBtn = target.closest('.cart-item-remove-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeFromCart(id);
        return;
      }

      const qtyBtn = target.closest('.qty-btn');
      if (qtyBtn) {
        const id = qtyBtn.getAttribute('data-id');
        const action = qtyBtn.getAttribute('data-action');
        updateQuantity(id, action === 'increase' ? 1 : -1);
      }
    });
  }

  // Promo code
  const promoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('cartPromoInput');
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      playClick();
      const code = promoInput.value.trim().toUpperCase();
      if (code === brandDetails.couponCode) {
        appliedDiscount = brandDetails.discountPercentage / 100;
        appliedPromoCode = code;
        renderCart();
        showToast(`KUPON UYGULANDI: %${brandDetails.discountPercentage} İNDİRİM`);
      } else if (code === '') {
        showToast("LÜTFEN BİR KOD GİRİNİZ");
      } else {
        showToast("GEÇERSİZ KOD: 'CACTUS10' DENEYİN");
      }
    });
  }

  // Multi-step checkout trigger
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast("ÇANTANIZ BOŞ!");
        return;
      }
      playAddToCart();
      openMultiStepCheckout();
    });
  }
}

// 4-STEP REALISTIC CHECKOUT SYSTEM
let checkoutState = {
  step: 1,
  customer: { name: '', phone: '', city: 'İstanbul', address: '' },
  shipping: 'express',
  card: { name: '', number: '', expiry: '', cvv: '' }
};

export function openMultiStepCheckout() {
  closeCartDrawer();
  checkoutState.step = 1;

  let modal = document.getElementById('multiStepCheckoutModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'multiStepCheckoutModal';
    modal.className = 'modal-backdrop open';
    document.body.appendChild(modal);
  } else {
    modal.classList.add('open');
  }
  document.body.style.overflow = 'hidden';

  renderCheckoutStep();
}

function renderCheckoutStep() {
  const modal = document.getElementById('multiStepCheckoutModal');
  if (!modal) return;

  const total = document.getElementById('cartTotal')?.textContent || '0 TL';
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  modal.innerHTML = `
    <div class="checkout-modal-container">
      <div class="checkout-modal-header">
        <div class="checkout-brand-badge">
          <span class="pulse-dot"></span>
          <span>CACTUS SECURE VAULT // 256-BIT SSL</span>
        </div>
        <button class="checkout-close-btn" id="checkoutCloseModalBtn">✕</button>
      </div>

      <!-- Steps Indicator -->
      <div class="checkout-stepper">
        <div class="step-item ${checkoutState.step >= 1 ? 'active' : ''}">
          <span class="step-num">01</span>
          <span class="step-label">TESLİMAT</span>
        </div>
        <div class="step-connector ${checkoutState.step >= 2 ? 'active' : ''}"></div>
        <div class="step-item ${checkoutState.step >= 2 ? 'active' : ''}">
          <span class="step-num">02</span>
          <span class="step-label">GÖNDERİM</span>
        </div>
        <div class="step-connector ${checkoutState.step >= 3 ? 'active' : ''}"></div>
        <div class="step-item ${checkoutState.step >= 3 ? 'active' : ''}">
          <span class="step-num">03</span>
          <span class="step-label">ÖDEME</span>
        </div>
        <div class="step-connector ${checkoutState.step === 4 ? 'active' : ''}"></div>
        <div class="step-item ${checkoutState.step === 4 ? 'active' : ''}">
          <span class="step-num">04</span>
          <span class="step-label">ONAY</span>
        </div>
      </div>

      <!-- Step Content Area -->
      <div class="checkout-step-body" id="checkoutStepBody">
        ${getStepHtml(total, itemCount)}
      </div>
    </div>
  `;

  document.getElementById('checkoutCloseModalBtn')?.addEventListener('click', () => {
    playClick();
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });

  bindStepEvents();
}

function getStepHtml(total, itemCount) {
  if (checkoutState.step === 1) {
    return `
      <div class="checkout-step-slide">
        <h3 class="checkout-step-title">TESLİMAT VE İLETİŞİM BİLGİLERİ</h3>
        <p class="checkout-step-desc">Sipariş kargo bildirimleri ve gizli ambalaj teslimatı için bilgilerinizi giriniz.</p>
        <form id="checkoutDeliveryForm" class="checkout-form">
          <div class="form-group-row">
            <div class="form-group">
              <label>AD SOYAD *</label>
              <input type="text" id="chkName" required placeholder="Travis Scott" value="${checkoutState.customer.name}">
            </div>
            <div class="form-group">
              <label>TELEFON (SMS TAKİP) *</label>
              <input type="tel" id="chkPhone" required placeholder="05XX XXX XX XX" value="${checkoutState.customer.phone}">
            </div>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label>ŞEHİR</label>
              <select id="chkCity">
                <option value="İstanbul" ${checkoutState.customer.city === 'İstanbul' ? 'selected' : ''}>İstanbul</option>
                <option value="Ankara" ${checkoutState.customer.city === 'Ankara' ? 'selected' : ''}>Ankara</option>
                <option value="İzmir" ${checkoutState.customer.city === 'İzmir' ? 'selected' : ''}>İzmir</option>
                <option value="Bursa" ${checkoutState.customer.city === 'Bursa' ? 'selected' : ''}>Bursa</option>
                <option value="Antalya" ${checkoutState.customer.city === 'Antalya' ? 'selected' : ''}>Antalya</option>
                <option value="Diğer" ${checkoutState.customer.city === 'Diğer' ? 'selected' : ''}>Diğer Şehirler</option>
              </select>
            </div>
            <div class="form-group">
              <label>E-POSTA</label>
              <input type="email" id="chkEmail" placeholder="utopia@cactus.archive" required>
            </div>
          </div>
          <div class="form-group">
            <label>AÇIK ADRES *</label>
            <textarea id="chkAddress" rows="2" required placeholder="Mahalle, Cadde/Sokak, Bina No, Daire">${checkoutState.customer.address}</textarea>
          </div>
          <div class="checkout-footer-action">
            <div class="checkout-order-mini-summary">
              <span>${itemCount} PARÇA</span>
              <strong>${total}</strong>
            </div>
            <button type="submit" class="btn-cactus-primary">
              DEVAM ET: GÖNDERİM SEÇİMİ →
            </button>
          </div>
        </form>
      </div>
    `;
  }

  if (checkoutState.step === 2) {
    return `
      <div class="checkout-step-slide">
        <h3 class="checkout-step-title">GÖNDERİM VE PAKETLEME YÖNTEMİ</h3>
        <p class="checkout-step-desc">Tüm siparişler şifreli mühürlü siyah koruma torbasında sevk edilir.</p>
        <div class="shipping-options-list">
          <label class="shipping-card-option ${checkoutState.shipping === 'express' ? 'selected' : ''}">
            <input type="radio" name="shippingMethod" value="express" ${checkoutState.shipping === 'express' ? 'checked' : ''}>
            <div class="shipping-card-content">
              <div class="shipping-card-top">
                <span class="shipping-title">⚡ CACTUS EXPRESS VIP (24 SAATTE KARGO)</span>
                <span class="shipping-price-badge">ÖNCELİKLİ</span>
              </div>
              <p class="shipping-note">Özel siyah arşiv kutusu, koleksiyon sertifikası ve mühürlü ambalaj.</p>
            </div>
          </label>

          <label class="shipping-card-option ${checkoutState.shipping === 'standard' ? 'selected' : ''}">
            <input type="radio" name="shippingMethod" value="standard" ${checkoutState.shipping === 'standard' ? 'checked' : ''}>
            <div class="shipping-card-content">
              <div class="shipping-card-top">
                <span class="shipping-title">📦 STANDART SİGORTALI GÖNDERİM</span>
                <span class="shipping-price-badge">ÜCRETSİZ</span>
              </div>
              <p class="shipping-note">Kolay Gelsin / Yurtiçi Kargo güvencesiyle 2-3 iş gününde teslimat.</p>
            </div>
          </label>
        </div>

        <div class="checkout-footer-action dual">
          <button class="btn-outline-gothic" id="checkoutBackToStep1">← GERİ</button>
          <button class="btn-cactus-primary" id="checkoutNextToStep3">DEVAM ET: GÜVENLİ ÖDEME →</button>
        </div>
      </div>
    `;
  }

  if (checkoutState.step === 3) {
    return `
      <div class="checkout-step-slide">
        <h3 class="checkout-step-title">GÜVENLİ 3D SECURE ÖDEME</h3>
        <p class="checkout-step-desc">Tüm kart bilgileri 256-Bit SSL ile şifrelenir. Asla sunucuda tutulmaz.</p>
        
        <form id="checkoutPaymentForm" class="checkout-form">
          <div class="form-group">
            <label>KART ÜZERİNDEKİ İSİM *</label>
            <input type="text" id="chkCardName" required placeholder="TRAVIS SCOTT" value="${checkoutState.card.name}">
          </div>
          <div class="form-group">
            <label>KART NUMARASI *</label>
            <input type="text" id="chkCardNumber" maxlength="19" required placeholder="5400 •••• •••• 1991" value="${checkoutState.card.number}">
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label>SON KULLANMA (AA/YY) *</label>
              <input type="text" id="chkCardExpiry" maxlength="5" required placeholder="12/28" value="${checkoutState.card.expiry}">
            </div>
            <div class="form-group">
              <label>CVV (GÜVENLİK KODU) *</label>
              <input type="password" id="chkCardCvv" maxlength="3" required placeholder="•••" value="${checkoutState.card.cvv}">
            </div>
          </div>

          <div class="checkout-trust-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Mastercard Identity Check & Verified by Visa 3D Secure Doğrulama Aktif</span>
          </div>

          <div class="checkout-footer-action dual">
            <button type="button" class="btn-outline-gothic" id="checkoutBackToStep2">← GERİ</button>
            <button type="submit" class="btn-cactus-primary" id="checkoutSubmitPayment">
              SİPARİŞİ TAMAMLA (${total})
            </button>
          </div>
        </form>
      </div>
    `;
  }

  // Step 4: Success confirmation
  const orderBatch = Math.floor(100000 + Math.random() * 900000);
  return `
    <div class="checkout-step-slide order-success-slide">
      <div class="success-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-flame)" stroke-width="2.5" width="56" height="56">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h3 class="success-main-title">SİPARİŞ ARŞİVE ALINDI</h3>
      <div class="success-order-code">KOD: CA-${orderBatch} // BATCH 2026-TX</div>
      
      <div class="success-details-card">
        <div class="success-detail-row">
          <span>ALICI:</span>
          <strong>${checkoutState.customer.name || 'DEĞERLİ KOLEKSİYONER'}</strong>
        </div>
        <div class="success-detail-row">
          <span>TESLİMAT:</span>
          <strong>${checkoutState.shipping === 'express' ? 'Cactus Express VIP (24 Saatte Kargo)' : 'Standart Sigortalı Gönderim'}</strong>
        </div>
        <div class="success-detail-row">
          <span>TOPLAM ÖDENEN:</span>
          <strong style="color: var(--accent-flame);">${total}</strong>
        </div>
        <div class="success-detail-row">
          <span>DURUM:</span>
          <strong style="color: #68d391;">ŞİFRELİ AMBALAJ HAZIRLANIYOR [HOUSTON VAULT]</strong>
        </div>
      </div>

      <p class="success-foot-note">SMS ve E-Posta ile kargo takip barkodunuz gönderilmiştir.</p>

      <button class="btn-cactus-primary" id="finishCheckoutBtn" style="width: 100%; justify-content: center;">
        ALIŞVERİŞE DEVAM ET
      </button>
    </div>
  `;
}

function bindStepEvents() {
  if (checkoutState.step === 1) {
    const form = document.getElementById('checkoutDeliveryForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutState.customer.name = document.getElementById('chkName').value.trim();
        checkoutState.customer.phone = document.getElementById('chkPhone').value.trim();
        checkoutState.customer.city = document.getElementById('chkCity').value;
        checkoutState.customer.address = document.getElementById('chkAddress').value.trim();
        
        playClick();
        checkoutState.step = 2;
        renderCheckoutStep();
      });
    }
  }

  if (checkoutState.step === 2) {
    document.getElementById('checkoutBackToStep1')?.addEventListener('click', () => {
      playClick();
      checkoutState.step = 1;
      renderCheckoutStep();
    });

    const options = document.querySelectorAll('input[name="shippingMethod"]');
    options.forEach(radio => {
      radio.addEventListener('change', (e) => {
        checkoutState.shipping = e.target.value;
        renderCheckoutStep();
      });
    });

    document.getElementById('checkoutNextToStep3')?.addEventListener('click', () => {
      playClick();
      checkoutState.step = 3;
      renderCheckoutStep();
    });
  }

  if (checkoutState.step === 3) {
    document.getElementById('checkoutBackToStep2')?.addEventListener('click', () => {
      playClick();
      checkoutState.step = 2;
      renderCheckoutStep();
    });

    const cardInput = document.getElementById('chkCardNumber');
    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = val;
      });
    }

    const expiryInput = document.getElementById('chkCardExpiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
        e.target.value = val;
      });
    }

    const form = document.getElementById('checkoutPaymentForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('checkoutSubmitPayment');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '3D SECURE ONAYLANIYOR...';
        }

        // Simulate 3D Secure authentication delay
        setTimeout(() => {
          // Clear cart on success
          cart = [];
          appliedDiscount = 0;
          appliedPromoCode = null;
          saveCart();

          checkoutState.step = 4;
          renderCheckoutStep();
        }, 1200);
      });
    }
  }

  if (checkoutState.step === 4) {
    document.getElementById('finishCheckoutBtn')?.addEventListener('click', () => {
      playClick();
      const modal = document.getElementById('multiStepCheckoutModal');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

function simulateCheckoutOrder() {
  openMultiStepCheckout();
}

export function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span style="color: var(--accent-flame); font-weight: 700; font-family: var(--font-mono);">//</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}
