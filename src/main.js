import './styles/design-tokens.css';
import './styles/main.css';
import './styles/components.css';

import { Router } from './js/router.js';
import { renderHomeView, mountHomeView } from './js/views/homeView.js';
import { renderShopView, mountShopView } from './js/views/shopView.js';
import { renderProductDetailView, mountProductDetailView } from './js/views/productDetailView.js';
import { renderLookbookView, mountLookbookView } from './js/views/lookbookView.js';
import { renderAboutView, mountAboutView } from './js/views/aboutView.js';
import { renderEditorialView, mountEditorialView } from './js/views/editorialView.js';

import { initCart } from './js/cart.js';
import { initCustomCursor } from './js/cursor.js';
import { initRadioSystem } from './js/radio.js';
import { initWishlist } from './js/wishlist.js';
import { initGlobalSearch } from './js/search.js';
import { openSmartFitModal } from './js/modal.js';
import { playClick } from './js/audio.js';

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initCart();
  initRadioSystem();
  initWishlist();
  initGlobalSearch();
  setupMobileNavDrawer();
  setupGlobalFitModal();

  // Initialize SPA Router with all dedicated views
  const routes = {
    home: renderHomeView,
    home_mount: mountHomeView,

    shop: renderShopView,
    shop_mount: mountShopView,

    product: renderProductDetailView,
    product_mount: mountProductDetailView,

    lookbook: renderLookbookView,
    lookbook_mount: mountLookbookView,

    about: renderAboutView,
    about_mount: mountAboutView,

    editorial: renderEditorialView,
    editorial_mount: mountEditorialView
  };

  new Router(routes, 'app');
});

function setupGlobalFitModal() {
  const trigger = document.getElementById('fitGuideBtn');
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    openSmartFitModal();
  });
}

function setupMobileNavDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    playClick();
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      playClick();
      closeDrawer();
    });
  }

  backdrop.addEventListener('click', closeDrawer);

  const drawerWishlistBtn = document.getElementById('drawerWishlistBtn');
  if (drawerWishlistBtn) {
    drawerWishlistBtn.addEventListener('click', () => {
      closeDrawer();
      const wishlistTrigger = document.getElementById('wishlistTriggerBtn');
      if (wishlistTrigger) wishlistTrigger.click();
    });
  }

  const drawerRadioBtn = document.getElementById('drawerRadioBtn');
  if (drawerRadioBtn) {
    drawerRadioBtn.addEventListener('click', () => {
      const radioTrigger = document.getElementById('radioTriggerBtn');
      if (radioTrigger) radioTrigger.click();
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      playClick();
      closeDrawer();
      const route = link.dataset.route;
      mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.route === route));
    });
  });

  window.addEventListener('hashchange', () => {
    const raw = window.location.hash.slice(1).split('/')[0] || 'home';
    mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.route === raw));
  });
}


