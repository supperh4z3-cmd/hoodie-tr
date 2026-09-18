import { products, brandDetails } from '../../data/products.js';
import { addToCart } from '../cart.js';
import { playClick } from '../audio.js';
import { isWishlisted, toggleWishlist } from '../wishlist.js';
import { openQuickView, openSmartFitModal } from '../modal.js';

const BADGE_MARK = `<span style="color: var(--accent-flame); font-weight: 800; margin-right: 4px;">//</span>`;

let activeCategory = 'all';
let searchQuery = '';
let activeSort = 'default';

export function renderShopView(context) {
  if (context && context.queryParams) {
    const cat = context.queryParams.get('category');
    if (cat) activeCategory = cat;
  }

  return `
    <div class="view-shop">
      <div class="shop-header-banner">
        <div class="section-container">
          <div class="shop-title-wrap">
            <span class="cactus-tag-badge">${BADGE_MARK} AW26 BATCH 01 ARCHIVE</span>
            <h1 class="shop-title">THE ENTIRE CAPSULE</h1>
            <p class="shop-sub">
              520 GSM kalın penye hoodie, örgü jakarlı kamuflaj hırka ve ultra baggy eşofman modelleri.
            </p>
          </div>
        </div>
      </div>

      <div class="section-container shop-content-wrap">
        <!-- FILTER & CONTROLS TOOLBAR -->
        <div class="shop-toolbar">
          <div class="filter-pills-row" id="shopFilterPills">
            <button class="filter-pill ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">
              TÜMÜ (6)
            </button>
            <button class="filter-pill ${activeCategory === 'hoodie' ? 'active' : ''}" data-cat="hoodie">
              OVERSIZE HOODIE (2)
            </button>
            <button class="filter-pill ${activeCategory === 'cardigan' ? 'active' : ''}" data-cat="cardigan">
              YIPRATILMIŞ HIRKA (2)
            </button>
            <button class="filter-pill ${activeCategory === 'sweatpants' ? 'active' : ''}" data-cat="sweatpants">
              BAGGY EŞOFMAN (2)
            </button>
          </div>

          <div class="shop-search-sort-row">
            <div class="shop-search-box">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input type="text" id="shopSearchInput" placeholder="Kumaş veya parça ara..." value="${searchQuery}" autocomplete="off">
            </div>

            <div class="shop-sort-box">
              <select id="shopSortSelect" class="sort-select" aria-label="Sıralama">
                <option value="default" ${activeSort === 'default' ? 'selected' : ''}>ÖNERİLEN</option>
                <option value="price-asc" ${activeSort === 'price-asc' ? 'selected' : ''}>FİYAT: ARTAN</option>
                <option value="price-desc" ${activeSort === 'price-desc' ? 'selected' : ''}>FİYAT: AZALAN</option>
              </select>
            </div>
          </div>
        </div>

        <!-- PRODUCTS GRID -->
        <div class="shop-grid" id="shopProductsGrid">
          <!-- Rendered in mount -->
        </div>

        <!-- FIT ADVISOR BANNER -->
        <div class="fit-banner-strip">
          <div class="fit-banner-text">
            <h4>BEDEN REHBERİ // OVERSIZE & BAGGY KALIP</h4>
            <p>Ürünlerimiz ekstra düşük omuz ve geniş paça kalıplarıyla dikilmiştir. Kendi bedeninizde bol döküm sağlar.</p>
          </div>
          <button class="btn-cactus-outline" id="shopFitGuideBtn" style="white-space: nowrap;">
            ÖLÇÜ TABLOSUNU GÖRÜNTÜLE
          </button>
        </div>
      </div>
    </div>
  `;
}

export function mountShopView() {
  renderFilteredProducts();

  // Filter click events
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      playClick();
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-cat');
      renderFilteredProducts();
    });
  });

  // Search event
  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderFilteredProducts();
    });
  }

  // Sort event
  const sortSelect = document.getElementById('shopSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      playClick();
      activeSort = e.target.value;
      renderFilteredProducts();
    });
  }

  // Fit guide button
  const fitBtn = document.getElementById('shopFitGuideBtn');
  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      playClick();
      const existing = document.getElementById('fitGuideBtn');
      if (existing) existing.click();
    });
  }

  // Scroll reveal for product cards
  setTimeout(() => {
    const cards = document.querySelectorAll('.shop-product-card');
    if (cards.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${i * 0.08}s`;
            entry.target.classList.add('card-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(card => observer.observe(card));
    }
  }, 50);
}

function renderFilteredProducts() {
  const grid = document.getElementById('shopProductsGrid');
  if (!grid) return;

  let list = [...products];

  // Category filter
  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  // Search filter
  if (searchQuery) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.weight.toLowerCase().includes(searchQuery) ||
      p.code.toLowerCase().includes(searchQuery)
    );
  }

  // Sorting
  if (activeSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-surface); border: 1px solid var(--border-subtle);">
        <div style="font-size: 2rem; color: var(--accent-flame); margin-bottom: 1rem;">★</div>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">
          ARAMANIZLA EŞLEŞEN PARÇA BULUNAMADI.
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => {
    const availableSizes = product.sizes.filter(s => s.inStock).map(s => s.size);
    const wishActive = isWishlisted(product.id);

    return `
      <div class="shop-product-card" data-id="${product.id}">
        <div class="shop-card-img-wrap">
          <span class="item-badge ${product.badgeType}">${product.badge}</span>
          
          <button class="card-wishlist-toggle-btn wishlist-toggle-btn ${wishActive ? 'active' : ''}" data-product-id="${product.id}" aria-label="Favorilere Ekle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>

          <a href="#product/${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </a>
          <div class="shop-card-quick-actions">
            <button class="shop-action-btn quick-view-btn" data-id="${product.id}">
              HIZLI BAKIŞ
            </button>
            <button class="shop-action-btn quick-buy-btn" data-id="${product.id}">
              + ÇANTA [${availableSizes[0] || 'L'}]
            </button>
          </div>
        </div>

        <div class="shop-card-info">
          <div class="shop-card-meta">
            <span>${product.categoryName}</span>
            <span class="item-code">${product.code}</span>
          </div>

          <h3 class="shop-card-title">
            <a href="#product/${product.id}">${product.name}</a>
          </h3>

          <div class="shop-card-chips">
            <span class="chip">${product.weight.split(' ')[0]} ${product.weight.split(' ')[1] || 'GSM'}</span>
            <span class="chip">${product.cut.split(' ')[0]}</span>
          </div>

          <div class="shop-card-footer">
            <div class="shop-price">${product.price.toLocaleString('tr-TR')} ${brandDetails.currency}</div>
            <div class="shop-sizes-list">
              ${['S', 'M', 'L', 'XL'].map(sz => `
                <span class="sz-badge ${availableSizes.includes(sz) ? 'in-stock' : ''}">${sz}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Wishlist button listeners
  grid.querySelectorAll('.card-wishlist-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pId = btn.getAttribute('data-product-id');
      toggleWishlist(pId);
      btn.classList.toggle('active', isWishlisted(pId));
    });
  });

  // Quick view button listeners
  grid.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod) openQuickView(prod);
    });
  });

  // Quick buy button listeners
  const quickBuyBtns = grid.querySelectorAll('.quick-buy-btn');
  quickBuyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod) {
        const firstSize = prod.sizes.find(s => s.inStock)?.size || 'L';
        addToCart(prod, firstSize, 1);
      }
    });
  });
}
