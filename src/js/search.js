// CACTUS ARCHIVE — Global Search & Command Palette (Cmd+K)
import { products, brandDetails } from '../data/products.js';
import { addToCart } from './cart.js';
import { playClick } from './audio.js';

let isSearchOpen = false;

export function initGlobalSearch() {
  setupSearchListeners();
}

export function openSearchModal() {
  playClick();
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('globalSearchInput');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    isSearchOpen = true;
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
      renderSearchResults('');
    }
  }
}

export function closeSearchModal() {
  playClick();
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    isSearchOpen = false;
  }
}

function setupSearchListeners() {
  const trigger = document.getElementById('searchTriggerBtn');
  const closeBtn = document.getElementById('searchCloseBtn');
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('globalSearchInput');

  if (trigger) trigger.addEventListener('click', openSearchModal);
  if (closeBtn) closeBtn.addEventListener('click', closeSearchModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearchModal();
    });
  }

  // Keyboard shortcut: Cmd+K / Ctrl+K or / key
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isSearchOpen) closeSearchModal();
      else openSearchModal();
    } else if (e.key === 'Escape' && isSearchOpen) {
      closeSearchModal();
    }
  });

  if (input) {
    input.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  // Quick chip tags
  document.querySelectorAll('.search-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      playClick();
      const term = chip.dataset.search || chip.textContent.trim();
      if (input) {
        input.value = term;
        input.focus();
        renderSearchResults(term);
      }
    });
  });
}

function renderSearchResults(query) {
  const container = document.getElementById('searchResultsContainer');
  const countEl = document.getElementById('searchResultCount');
  if (!container) return;

  const q = query.toLowerCase();

  const matches = products.filter(p => {
    if (!q) return true; // Show all if empty
    return (
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.weight.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  if (countEl) {
    countEl.textContent = q ? `${matches.length} SONUÇ BULUNDU` : 'TÜM PARÇALAR (6)';
  }

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="search-empty-state">
        <p class="empty-title">EŞLEŞEN PARÇA BULUNAMADI</p>
        <p class="empty-sub">"${query}" için hiçbir sonuç yok. "Hoodie", "Hırka", "Baggy" veya "520 GSM" aramayı deneyin.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map(p => `
    <div class="search-result-item">
      <a href="#product/${p.id}" class="search-item-img-link" onclick="document.getElementById('searchCloseBtn')?.click();">
        <img src="${p.image}" alt="${p.name}">
      </a>
      <div class="search-item-info">
        <div class="search-item-meta">
          <span>${p.categoryName}</span>
          <span class="code">${p.code}</span>
        </div>
        <h4 class="search-item-title">
          <a href="#product/${p.id}" onclick="document.getElementById('searchCloseBtn')?.click();">
            ${highlightMatch(p.name, q)}
          </a>
        </h4>
        <div class="search-item-desc">${p.weight}</div>
        <div class="search-item-price">${p.price.toLocaleString('tr-TR')} ${brandDetails.currency}</div>
      </div>
      <div class="search-item-actions">
        <button class="btn-search-add-cart" data-product-id="${p.id}">
          + ÇANTAYA EKLE
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-search-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.productId;
      const p = products.find(prod => prod.id === pId);
      if (p) {
        addToCart(p, 'L', 1);
        closeSearchModal();
      }
    });
  });
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}
