import { products } from '../../data/products.js';

export function renderLookbookView() {
  return `
    <div class="view-lookbook">
      <div class="lookbook-hero-strip">
        <div class="section-container">
          <span class="cactus-tag-badge">★ CIRCUS MAXIMUS 2026</span>
          <h1 class="lookbook-main-title">EDITORIAL LOOKBOOK</h1>
          <p class="lookbook-main-sub">
            Houston çöl kumları ve brutalist mimaride çekilen AW26 koleksiyonu.
          </p>
        </div>
      </div>

      <div class="section-container lookbook-gallery-container">
        <!-- EDITORIAL SHOT 1 (LARGE WIDESCREEN) -->
        <div class="lookbook-frame-large">
          <img src="/assets/products/lookbook_travis_campaign.jpg" alt="Lookbook Runway Campaign Shot">
          <div class="lookbook-caption-bar">
            <div>
              <span class="frame-tag">PLATE 001 // DESERT DUNE TWILIGHT</span>
              <p class="frame-desc">Utopia Mocha Hoodie (520 GSM) & Reverse Camo Jacquard Knit Cardigan</p>
            </div>
            <a href="#shop" class="frame-cta-btn">PARÇALARI GÖR →</a>
          </div>
        </div>

        <!-- EDITORIAL 2-COLUMN STAGGERED GRID -->
        <div class="lookbook-staggered-row">
          <div class="lookbook-card-item">
            <img src="/assets/products/hoodie_utopia_mocha.jpg" alt="Utopia Mocha Detail">
            <div class="item-overlay">
              <span class="title">UTOPIA MOCHA PUFF PRINT</span>
              <a href="#product/prod-01" class="link">ÜRÜN SAYFASINA GİT →</a>
            </div>
          </div>

          <div class="lookbook-card-item offset-down">
            <img src="/assets/products/sweatpants_astro_cargo.jpg" alt="Astro Cargo Detail">
            <div class="item-overlay">
              <span class="title">ASTRO PARACHUTE CARGO (460 GSM)</span>
              <a href="#product/prod-03" class="link">ÜRÜN SAYFASINA GİT →</a>
            </div>
          </div>
        </div>

        <!-- EDITORIAL SHOT 2 -->
        <div class="lookbook-staggered-row" style="margin-top: 4rem;">
          <div class="lookbook-card-item">
            <img src="/assets/products/cardigan_cactus_camo.jpg" alt="Camo Cardigan Detail">
            <div class="item-overlay">
              <span class="title">REVERSE-ZIP CAMO KNIT CARDIGAN</span>
              <a href="#product/prod-02" class="link">ÜRÜN SAYFASINA GİT →</a>
            </div>
          </div>

          <div class="lookbook-card-item offset-down">
            <img src="/assets/products/sweatpants_mocha_flame.jpg" alt="Graffiti Flare Detail">
            <div class="item-overlay">
              <span class="title">DESERT MOCHA GRAFFITI SWEATPANTS</span>
              <a href="#product/prod-06" class="link">ÜRÜN SAYFASINA GİT →</a>
            </div>
          </div>
        </div>

        <!-- CREDITS SECTION -->
        <div class="lookbook-credits-box">
          <div class="credit-col">
            <span class="credit-k">KREATİF DİREKTÖR:</span>
            <span class="credit-v">CACTUS LABS HOUSTON</span>
          </div>
          <div class="credit-col">
            <span class="credit-k">FOTOĞRAF & IŞIK:</span>
            <span class="credit-v">ANAMORPHIC 35MM GRAIN</span>
          </div>
          <div class="credit-col">
            <span class="credit-k">LOKASYON:</span>
            <span class="credit-v">29°45'N 95°22'W // CIRCUS MAXIMUS</span>
          </div>
          <div class="credit-col">
            <span class="credit-k">KAPSÜL:</span>
            <span class="credit-v">AW26 BATCH 01 LIMITED</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function mountLookbookView() {
  // Lookbook interactions
}
