import { products } from '../../data/products.js';
import { playClick } from '../audio.js';

const BADGE_MARK = `<span style="color: var(--accent-flame); font-weight: 800; margin-right: 4px;">//</span>`;

export function renderEditorialView() {
  const editorialProducts = products.slice(0, 6);
  
  return `
    <div class="view-editorial">
      <!-- CINEMATIC HERO -->
      <section class="ed-hero">
        <div class="ed-hero-bg">
          <img src="/assets/products/lookbook_travis_campaign.jpg" alt="Editorial Campaign" loading="lazy">
          <div class="ed-hero-darken"></div>
        </div>
        <div class="ed-hero-content">
          <div class="ed-hero-label">
            <span class="ed-line-accent"></span>
            VOLUME 01 — AW26
          </div>
          <h1 class="ed-hero-title scroll-reveal">
            <span class="ed-word" style="animation-delay: 0s">CIRCUS</span>
            <span class="ed-word outline" style="animation-delay: 0.15s">MAXIMUS</span>
            <span class="ed-word flame" style="animation-delay: 0.3s">DIARIES.</span>
          </h1>
          <p class="ed-hero-sub scroll-reveal">
            Houston çölünün kırmızı kumlarından, stadyum konserlerinin kaotik enerjisine — bir sezonun görsel arşivi.
          </p>
        </div>
        <div class="ed-scroll-indicator">
          <span class="ed-scroll-text">AŞAĞI KAYDIR</span>
          <span class="ed-scroll-arrow">↓</span>
        </div>
      </section>

      <!-- SPLIT SECTION 1 -->
      <section class="ed-split-section">
        <div class="ed-split-visual scroll-reveal-left">
          <img src="/assets/products/hoodie_utopia_mocha.jpg" alt="Utopia Mocha" loading="lazy">
          <div class="ed-visual-stamp">PLATE 001</div>
        </div>
        <div class="ed-split-text scroll-reveal-right">
          <span class="ed-chapter-tag">BÖLÜM I</span>
          <h2 class="ed-split-title">ÇÖL RÜYASI<br><span class="flame-accent">& RAW DRAPE.</span></h2>
          <p class="ed-split-desc">
            520 gramlık ağır pamuk, enzim yıkamasıyla birlikte mocha çikolata tonlarına bürünüyor. Kutu kalıp ve düşük omuz dikişleri, kumaşın doğal ağırlığıyla kusursuz bir döküm oluşturuyor.
          </p>
          <p class="ed-split-desc">
            Utopia Mocha Hoodie, 3D köpük baskı tekniğiyle uygulanan Cactus Jack tipografisini taşıyor — parmak ucunuzla dokunduğunuzda hissedebileceğiniz kabartmalı bir doku.
          </p>
          <a href="#product/prod-01" class="ed-text-link">ÜRÜNÜ İNCELE →</a>
        </div>
      </section>

      <!-- FULL-WIDTH VISUAL BREAK -->
      <section class="ed-fullwidth-visual scroll-reveal">
        <div class="ed-parallax-image" data-speed="0.3">
          <img src="/assets/products/hero_lookbook_streetwear.jpg" alt="Streetwear Campaign" loading="lazy">
        </div>
        <div class="ed-fullwidth-overlay">
          <blockquote class="ed-pull-quote">
            "Bir hoodie'nin ağırlığı,<br>onu giyen insanın<br><span class="flame-accent">duruşunu değiştirir.</span>"
          </blockquote>
        </div>
      </section>

      <!-- SPLIT SECTION 2 (REVERSED) -->
      <section class="ed-split-section reversed">
        <div class="ed-split-visual scroll-reveal-right">
          <img src="/assets/products/cardigan_cactus_camo.jpg" alt="Camo Cardigan" loading="lazy">
          <div class="ed-visual-stamp">PLATE 002</div>
        </div>
        <div class="ed-split-text scroll-reveal-left">
          <span class="ed-chapter-tag">BÖLÜM II</span>
          <h2 class="ed-split-title">DECONSTRUCTED<br><span class="flame-accent">CAMOUFLAGE.</span></h2>
          <p class="ed-split-desc">
            Askeri kamuflaj jakarlı örgü, çift yönlü eskitilmiş bakır fermuar ve göğüs cebindeki kabartmalı kaktüs nakışı — hırkanın avant-garde silüeti, taktik estetiği gündelik yaşama taşıyor.
          </p>
          <p class="ed-split-desc">
            Etek ve kol uçlarındaki kontrollü yıpratmalar, sanki parça yıllardır giyilmiş gibi bir vintage otantiklik katıyor.
          </p>
          <a href="#product/prod-02" class="ed-text-link">ÜRÜNÜ İNCELE →</a>
        </div>
      </section>

      <!-- HORIZONTAL SCROLL GALLERY -->
      <section class="ed-horizontal-section">
        <div class="section-container">
          <span class="section-sub">// GÖRSEL ARŞİV</span>
          <h2 class="section-main-title">CONTACT SHEET</h2>
        </div>
        <div class="ed-horizontal-scroll" id="edHorizontalScroll">
          ${editorialProducts.map((p, i) => `
            <div class="ed-hscroll-item">
              <div class="ed-hscroll-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="ed-hscroll-hover-info">
                  <span class="ed-hscroll-name">${p.name}</span>
                  <a href="#product/${p.id}" class="ed-hscroll-link">İNCELE →</a>
                </div>
              </div>
              <div class="ed-hscroll-meta">
                <span class="ed-frame-num">FRM.${String(i + 1).padStart(3, '0')}</span>
                <span class="ed-frame-cat">${p.categoryName}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- MOODBOARD COLLAGE -->
      <section class="ed-moodboard-section">
        <div class="section-container">
          <span class="section-sub">// MOODBOARD</span>
          <h2 class="section-main-title">VISUAL DNA</h2>

          <div class="ed-moodboard-grid">
            <div class="ed-mood-item tall scroll-reveal">
              <img src="/assets/products/hoodie_rage_acid.jpg" alt="Acid Wash" loading="lazy">
              <span class="ed-mood-label">THERMAL VISION</span>
            </div>
            <div class="ed-mood-item scroll-reveal">
              <img src="/assets/products/sweatpants_astro_cargo.jpg" alt="Cargo Baggy" loading="lazy">
              <span class="ed-mood-label">PARACHUTE SILHOUETTE</span>
            </div>
            <div class="ed-mood-item scroll-reveal">
              <img src="/assets/products/cardigan_tactical_waffle.jpg" alt="Waffle Knit" loading="lazy">
              <span class="ed-mood-label">RAW SEAM DETAIL</span>
            </div>
            <div class="ed-mood-item wide scroll-reveal">
              <img src="/assets/products/sweatpants_mocha_flame.jpg" alt="Flame Graffiti" loading="lazy">
              <span class="ed-mood-label">SPRAY PAINT EXPRESSION</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SPLIT SECTION 3 -->
      <section class="ed-split-section">
        <div class="ed-split-visual scroll-reveal-left">
          <img src="/assets/products/sweatpants_astro_cargo.jpg" alt="Baggy Cargo" loading="lazy">
          <div class="ed-visual-stamp">PLATE 003</div>
        </div>
        <div class="ed-split-text scroll-reveal-right">
          <span class="ed-chapter-tag">BÖLÜM III</span>
          <h2 class="ed-split-title">PUDDLE<br><span class="flame-accent">STACKING.</span></h2>
          <p class="ed-split-desc">
            Sneaker'ların üzerine yığılan devasa paça formu — puddle stacking — Travis Scott'ın imza silüeti. Diz pileleri kumaşı yürürken dalgalandırırken, taktik kargo cepleri fonksiyonel bir estetik sunuyor.
          </p>
          <p class="ed-split-desc">
            460 GSM iç şardonlu kalın kışlık polar, kordonlu elastik bel bandı ve metal stoperler. Askeri yeşil dokuma askılar ile tamamlanan parça, sokak ve outdoor arasında köprü kuruyor.
          </p>
          <a href="#product/prod-03" class="ed-text-link">ÜRÜNÜ İNCELE →</a>
        </div>
      </section>

      <!-- CLOSING TYPEWRITER CTA -->
      <section class="ed-closing-section">
        <div class="section-container" style="text-align: center;">
          <div class="ed-typewriter-wrap">
            <span class="ed-typewriter-text" id="edTypewriter"></span>
            <span class="ed-typewriter-cursor">|</span>
          </div>
          <div class="ed-closing-cta">
            <a href="#shop" class="btn-cactus-primary">
              KOLEKSİYONU SATIN AL →
            </a>
            <a href="#about" class="btn-cactus-outline">
              HAKKIMIZDA
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function mountEditorialView() {
  // Scroll reveal observer
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  // Parallax effect
  const parallaxImages = document.querySelectorAll('.ed-parallax-image');
  if (parallaxImages.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const speed = parseFloat(img.dataset.speed || 0.3);
            const yPos = -(rect.top * speed);
            img.style.transform = `translateY(${yPos}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Horizontal scroll with mouse drag
  const hScroll = document.getElementById('edHorizontalScroll');
  if (hScroll) {
    let isDown = false;
    let startX, scrollLeft;

    hScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      hScroll.classList.add('grabbing');
      startX = e.pageX - hScroll.offsetLeft;
      scrollLeft = hScroll.scrollLeft;
    });
    hScroll.addEventListener('mouseleave', () => { isDown = false; hScroll.classList.remove('grabbing'); });
    hScroll.addEventListener('mouseup', () => { isDown = false; hScroll.classList.remove('grabbing'); });
    hScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - hScroll.offsetLeft;
      const walk = (x - startX) * 1.5;
      hScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // Typewriter effect
  const typewriterEl = document.getElementById('edTypewriter');
  if (typewriterEl) {
    const text = 'CACTUS ARCHIVE — DESERT STREETWEAR & HEAVYWEIGHT CUTS. HOUSTON, TX.';
    let charIndex = 0;
    function typeChar() {
      if (charIndex < text.length) {
        typewriterEl.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 55 + Math.random() * 45);
      }
    }
    // Start typewriter when section is visible
    const closingSection = document.querySelector('.ed-closing-section');
    if (closingSection) {
      const twObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          typeChar();
          twObserver.disconnect();
        }
      }, { threshold: 0.3 });
      twObserver.observe(closingSection);
    }
  }

  // Moodboard hover reveal (B&W to color)
  const moodItems = document.querySelectorAll('.ed-mood-item img');
  moodItems.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.filter = 'grayscale(0%) contrast(1.15) brightness(0.95)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.filter = '';
    });
  });
}
