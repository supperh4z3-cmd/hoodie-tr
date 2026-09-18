// CACTUS ARCHIVE — Vault Wishlist System
import { products, brandDetails } from '../data/products.js';
import { addToCart, showToast } from './cart.js';
import { playClick } from './audio.js';

let wishlist = [];

export function initWishlist() {
  const saved = localStorage.getItem('cactus_vault_wishlist');
  if (saved) {
    try {
      wishlist = JSON.parse(saved);
    } catch (e) {
      wishlist = [];
    }
  }

  setupWishlistDrawerListeners();
  updateWishlistUI();
}

function saveWishlist() {
  localStorage.setItem('cactus_vault_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

export function isWishlisted(productId) {
  return wishlist.includes(productId);
}

export function toggleWishlist(productId) {
  playClick();
  const idx = wishlist.indexOf(productId);
  const product = products.find(p => p.id === productId);
  const name = product ? product.name : 'ÜRÜN';

  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`${name} FAVORİLERDEN ÇIKARILDI`);
  } else {
    wishlist.push(productId);
    showToast(`${name} FAVORİLERE EKLENDİ`);
  }

  saveWishlist();
}

export function openWishlistDrawer() {
  playClick();
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('wishlistBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderWishlistDrawer();
  }
}

export function closeWishlistDrawer() {
  playClick();
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('wishlistBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function updateWishlistUI() {
  // Update header counter
  const counter = document.getElementById('wishlistHeaderCount');
  if (counter) {
    counter.textContent = wishlist.length;
    counter.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }

  // Update all wishlist buttons on page
  document.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
    const pId = btn.dataset.productId;
    const active = isWishlisted(pId);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-label', active ? 'Favorilerden Çıkar' : 'Favorilere Ekle');
  });

  renderWishlistDrawer();
}

export function renderWishlistDrawer() {
  const container = document.getElementById('wishlistItemsContainer');
  const totalCountEl = document.getElementById('wishlistDrawerTotal');
  const addAllBtn = document.getElementById('wishlistAddAllBtn');
  if (!container) return;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  if (totalCountEl) totalCountEl.textContent = `${savedProducts.length} PARÇA`;

  if (savedProducts.length === 0) {
    container.innerHTML = `
      <div class="wishlist-empty-state">
        <div class="wishlist-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="empty-title">FAVORİLERİNİZ BOŞ</p>
        <p class="empty-sub">Beğendiğiniz parçaları kaydetmek için ürünlerin üzerindeki yer imi simgesine dokunun.</p>
        <a href="#shop" class="btn-cactus-primary" style="margin-top: 1.5rem; justify-content: center;" onclick="window.closeWishlistDrawer ? window.closeWishlistDrawer() : null;">
          KOLEKSİYONU KEŞFET
        </a>
      </div>
    `;
    if (addAllBtn) addAllBtn.style.display = 'none';
    return;
  }

  if (addAllBtn) addAllBtn.style.display = 'block';

  container.innerHTML = savedProducts.map(product => `
    <div class="wishlist-item-card">
      <div class="wishlist-img-wrap">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="wishlist-item-info">
        <div class="wishlist-meta">
          <span>${product.categoryName}</span>
          <span class="code">${product.code}</span>
        </div>
        <h4 class="wishlist-item-title">
          <a href="#product/${product.id}" onclick="document.getElementById('wishlistCloseBtn')?.click();">${product.name}</a>
        </h4>
        <div class="wishlist-item-price">${product.price.toLocaleString('tr-TR')} ${brandDetails.currency}</div>
        
        <div class="wishlist-item-actions">
          <button class="btn-wishlist-add-cart" data-product-id="${product.id}">
            + ÇANTAYA EKLE [L]
          </button>
          <button class="btn-wishlist-remove" data-product-id="${product.id}" title="Listeden Kaldır">
            ✕
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Item action listeners
  container.querySelectorAll('.btn-wishlist-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.productId;
      const p = products.find(prod => prod.id === pId);
      if (p) {
        addToCart(p, 'L', 1);
        closeWishlistDrawer();
      }
    });
  });

  container.querySelectorAll('.btn-wishlist-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.productId;
      toggleWishlist(pId);
    });
  });
}

function setupWishlistDrawerListeners() {
  const trigger = document.getElementById('wishlistTriggerBtn');
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('wishlistBackdrop');
  const closeBtn = document.getElementById('wishlistCloseBtn');
  const addAllBtn = document.getElementById('wishlistAddAllBtn');

  if (trigger) trigger.addEventListener('click', openWishlistDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeWishlistDrawer);
  if (backdrop) backdrop.addEventListener('click', closeWishlistDrawer);

  if (addAllBtn) {
    addAllBtn.addEventListener('click', () => {
      playClick();
      const savedProducts = products.filter(p => wishlist.includes(p.id));
      savedProducts.forEach(p => {
        addToCart(p, 'L', 1);
      });
      closeWishlistDrawer();
      showToast(`${savedProducts.length} PARÇA ÇANTAYA EKLENDİ`);
    });
  }
}
