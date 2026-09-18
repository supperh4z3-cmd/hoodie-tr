import { products, brandDetails } from '../../data/products.js';
import { playClick } from '../audio.js';

// Typographic badge mark
const BADGE_MARK = `<span style="color: var(--accent-flame); font-weight: 800; margin-right: 4px;">//</span>`;

export function renderAboutView() {
  return `
    <div class="view-about">
      <!-- ABOUT HERO -->
      <section class="about-hero-section">
        <div class="about-hero-bg">
          <img src="/assets/products/lookbook_travis_campaign.jpg" alt="Cactus Archive Atölye" loading="lazy">
          <div class="about-hero-overlay"></div>
        </div>
        <div class="section-container about-hero-content">
          <span class="cactus-tag-badge">${BADGE_MARK} HAKKIMIZDA // EST. 2026</span>
          <h1 class="about-hero-title">
            BİZ KİMİZ
            <span class="outline-text">CACTUS ARCHIVE</span>
          </h1>
          <p class="about-hero-subtitle">
            Houston sokak kültürünün ham estetiğini, ağır gramajlı kumaş zanaatkârlığıyla buluşturan bağımsız bir streetwear stüdyosu.
          </p>
        </div>
      </section>

      <!-- MANIFESTO -->
      <section class="about-manifesto-section">
        <div class="section-container">
          <div class="manifesto-grid">
            <div class="manifesto-left">
              <span class="section-sub">// MANİFESTO</span>
              <h2 class="manifesto-title">
                MODA DEĞİL,<br>
                <span class="flame-accent">KİMLİK.</span>
              </h2>
            </div>
            <div class="manifesto-right">
              <p class="manifesto-text">
                Cactus Archive, sıradan moda trendlerini takip etmek için kurulmadı. Biz, sokağın sesini, çölün dokusunu ve underground müzik sahnesinin enerjisini kumaşa çeviren bir kolektifiz.
              </p>
              <p class="manifesto-text">
                Her parçamız 520 GSM ağır gramajlı premium pamuktan, sınırlı sayıda üretilir. Seri üretimin ruhsuz tekrarından kaçınarak, her sezon yalnızca küçük batch'ler (Batch 01, Batch 02...) halinde piyasaya süreriz.
              </p>
              <p class="manifesto-text accent">
                "Bir hoodie'nin 500 gram ağırlığında olması, onu giyen insanın duruşunu değiştirir. Bu sadece kumaş değil — zırh."
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- VALUES GRID -->
      <section class="about-values-section">
        <div class="section-container">
          <span class="section-sub">// DEĞERLER</span>
          <h2 class="section-main-title">NE İÇİN DURUYORUZ</h2>

          <div class="values-grid">
            <div class="value-card scroll-reveal">
              <div class="value-number">01</div>
              <h3 class="value-title">520 GSM KALİTE</h3>
              <p class="value-desc">
                Her parçamız endüstri standardının 2 katı ağırlığında, özel dokuma kalın French Terry pamuktan üretilir. Yıkandıkça form kazanan, yıpranmayan kumaşlar.
              </p>
            </div>

            <div class="value-card scroll-reveal">
              <div class="value-number">02</div>
              <h3 class="value-title">SINIRLI ÜRETİM</h3>
              <p class="value-desc">
                Her tasarım en fazla 200 adet üretilir. Batch numaranız, sizin koleksiyoner kimliğinizdir. Seri üretim asla gündemimizde olmadı.
              </p>
            </div>

            <div class="value-card scroll-reveal">
              <div class="value-number">03</div>
              <h3 class="value-title">SOKAK KÜLTÜRÜ</h3>
              <p class="value-desc">
                Houston underground sahnesinden, Travis Scott konserlerinden, çöl road trip'lerinden ve brutalist mimariden ilham alırız. Her baskı bir hikâye anlatır.
              </p>
            </div>

            <div class="value-card scroll-reveal">
              <div class="value-number">04</div>
              <h3 class="value-title">SÜRDÜRÜLEBİLİR ZANAAT</h3>
              <p class="value-desc">
                Lokal atölyelerle çalışır, organik enzim yıkamaları kullanır, deşarj baskı tekniği ile çevreye duyarlı üretim yaparız.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- PROCESS / TIMELINE -->
      <section class="about-process-section">
        <div class="section-container">
          <span class="section-sub">// ÜRETİM SÜRECİ</span>
          <h2 class="section-main-title">ATÖLYEDEN SANA</h2>

          <div class="process-timeline">
            <div class="timeline-item scroll-reveal">
              <div class="timeline-marker">
                <span class="timeline-dot"></span>
                <span class="timeline-line"></span>
              </div>
              <div class="timeline-content">
                <span class="timeline-step">ADIM 01</span>
                <h3>KUMAŞ SEÇİMİ</h3>
                <p>520 GSM özel dokuma French Terry pamuk, İstanbul'daki partner tezgâhlarında sipariş üzerine dokunur. Minimum 3 hafta dokuma süresi.</p>
              </div>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-marker">
                <span class="timeline-dot"></span>
                <span class="timeline-line"></span>
              </div>
              <div class="timeline-content">
                <span class="timeline-step">ADIM 02</span>
                <h3>BASKI TEKNOLOJİSİ</h3>
                <p>3D köpük (puff) baskı, deşarj serigrafi ve jakarlı örgü desenleri el işçiliğiyle uygulanır. Her baskı kalıbı özel üretimdir.</p>
              </div>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-marker">
                <span class="timeline-dot"></span>
                <span class="timeline-line"></span>
              </div>
              <div class="timeline-content">
                <span class="timeline-step">ADIM 03</span>
                <h3>VINTAGE YIKAMA</h3>
                <p>Enzim bazlı taşlama ve asit yıkama teknikleri ile her parçaya benzersiz vintage doku ve ton verilir. Hiçbir iki parça birbirinin aynısı değildir.</p>
              </div>
            </div>

            <div class="timeline-item scroll-reveal">
              <div class="timeline-marker">
                <span class="timeline-dot"></span>
              </div>
              <div class="timeline-content">
                <span class="timeline-step">ADIM 04</span>
                <h3>KALİTE KONTROL & SEVKİYAT</h3>
                <p>Her parça tek tek kontrol edilir, batch numarası etiketlenir ve özel şifreli ambalajla 24 saat içinde kargoya verilir.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS BAR -->
      <section class="about-stats-bar">
        <div class="section-container">
          <div class="stats-grid">
            <div class="stat-item scroll-reveal">
              <div class="stat-number" data-target="520">520</div>
              <div class="stat-label">GSM KUMAŞ AĞIRLIĞI</div>
            </div>
            <div class="stat-item scroll-reveal">
              <div class="stat-number" data-target="200">200</div>
              <div class="stat-label">BATCH BAŞINA MAKSİMUM ADET</div>
            </div>
            <div class="stat-item scroll-reveal">
              <div class="stat-number" data-target="24">24</div>
              <div class="stat-label">SAAT İÇİNDE KARGO</div>
            </div>
            <div class="stat-item scroll-reveal">
              <div class="stat-number" data-target="14">14</div>
              <div class="stat-label">GÜN İADE GARANTİSİ</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="about-cta-section">
        <div class="section-container" style="text-align: center;">
          <h2 class="about-cta-title">KOLEKSİYONU KEŞFET</h2>
          <p class="about-cta-desc">
            AW26 Circus Maximus kapsül koleksiyonundaki tüm parçaları incele.
          </p>
          <div class="hero-btn-row" style="justify-content: center;">
            <a href="#shop" class="btn-cactus-primary">
              MAĞAZAYA GİT →
            </a>
            <a href="#editorial" class="btn-cactus-outline">
              EDİTÖRYAL ARŞİV
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function mountAboutView() {
  // Scroll reveal animation
  const reveals = document.querySelectorAll('.scroll-reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }
}
