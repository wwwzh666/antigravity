import './styles.css';
import { ScrollAnimationRegistry } from './animations';
import { siteData } from './data';
import { ParticleScene } from './particle-scene';

function chars(text: string): string {
  return Array.from(text)
    .map((character) => `<span class="char">${character === ' ' ? '&nbsp;' : character}</span>`)
    .join('');
}

function renderApp(): void {
  const nav = siteData.nav.map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`).join('');
  const iconList = siteData.agentFirst.icons
    .map((icon) => `<li class="bouncer symbol" aria-hidden="true">${icon}</li>`)
    .join('');
  const useCases = siteData.useCases
    .map(
      (item) => `
        <article class="feature-card" id="${item.id}" style="--accent: ${item.color}">
          <div class="feature-particles" data-particle="feature" data-color="${item.color}"></div>
          <div class="feature-icon"><img src="${item.icon}" alt="" /></div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `,
    )
    .join('');
  const solutions = siteData.solutions
    .map(
      (item, index) => `
        <article class="solution-panel ${index === 0 ? 'left' : 'right'}">
          <div class="solution-particles" data-particle="solution"></div>
          <p class="solution-kicker">${item.title}</p>
          <h3>${item.subtitle}</h3>
          <p>${item.description}</p>
        </article>
      `,
    )
    .join('');
  const blogPosts = siteData.blogPosts
    .map(
      (post) => `
        <article class="blog-card">
          <p>${post.category}</p>
          <h3>${post.title}</h3>
          <time>${post.date}</time>
        </article>
      `,
    )
    .join('');

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <nav class="site-nav" aria-label="Main navigation">
      <a href="#" class="brand">
        <img src="/assets/image/antigravity-logo.png" alt="" />
        <span>Google Antigravity</span>
      </a>
      <div class="nav-links">${nav}</div>
      <a class="nav-download" href="#download">Download</a>
    </nav>

    <header class="welcome-wrapper">
      <div class="hero-video-wrapper" aria-hidden="true">
        <video class="background-video" autoplay muted loop playsinline>
          <source src="/assets/video/hero_video.mp4" type="video/mp4" />
        </video>
      </div>
      <section class="welcome-section">
        <div id="hero-particles" class="particle-stage"></div>
        <div class="logo-container">
          <img class="antigravity-logo" src="/assets/image/antigravity-logo.png" alt="" />
          <strong>${siteData.hero.eyebrow}</strong>
        </div>
        <div class="header-container" data-typed>
          <h1 class="landing-main-header">
            <span>${chars(siteData.hero.headline[0])}</span>
            <span>${chars(siteData.hero.headline[1])}</span>
          </h1>
          <img class="typed-cursor blinking-cursor" src="/assets/image/antigravity-cursor.png" alt="" />
        </div>
        <div class="welcome-cta">
          <a class="button primary" href="#download">${siteData.hero.primaryCta}</a>
          <a class="button secondary" href="#product">${siteData.hero.secondaryCta}</a>
        </div>
      </section>
    </header>

    <main>
      <section id="product" class="agent-first-section">
        <ul class="icon-list">${iconList}</ul>
        <div class="grid-container text-container reveal" data-typed>
          <h2 class="heading-3 agent-first-text">${chars(siteData.agentFirst.title)}</h2>
          <img class="typed-cursor blinking-cursor" src="/assets/image/antigravity-cursor.png" alt="" />
        </div>
      </section>

      <section class="video-section reveal">
        <div class="section-copy">
          <p class="eyebrow">Watch</p>
          <h2>${siteData.video.title}</h2>
          <p>${siteData.video.description}</p>
        </div>
        <button class="video-wrapper" type="button" aria-label="Play video preview">
          <video class="landing-video" autoplay muted loop playsinline>
            <source src="/assets/video/hero_video.mp4" type="video/mp4" />
          </video>
          <span class="video-control-button symbol" aria-hidden="true">play_arrow</span>
          <span class="custom-cursor" aria-hidden="true">
            <span class="cursor-content"><span class="symbol">play_arrow</span>${siteData.video.cursorText}</span>
          </span>
        </button>
      </section>

      <section class="modal-video" aria-hidden="true">
        <button class="modal-close" type="button">Close</button>
        <video class="modal-player" controls playsinline>
          <source src="/assets/video/hero_video.mp4" type="video/mp4" />
        </video>
      </section>

      <section id="use-cases" class="use-case-section">
        <div class="section-copy reveal">
          <p class="eyebrow">Built for developers</p>
          <h2>For the agent-first era</h2>
          <p>Antigravity is built for user trust, from professional teams to builders experimenting in spare moments.</p>
        </div>
        <div class="feature-grid">${useCases}</div>
      </section>

      <section class="solutions-section">
        <div class="section-copy reveal">
          <p class="eyebrow">Try solutions</p>
          <h2>Move from idea to verified change</h2>
        </div>
        <div class="solution-grid">${solutions}</div>
      </section>

      <section id="download" class="download-section reveal">
        <div id="download-particles" class="download-particles"></div>
        <div class="download-content" data-typed>
          <h2>${chars('Download Google Antigravity')}</h2>
          <img class="typed-cursor blinking-cursor" src="/assets/image/antigravity-cursor.png" alt="" />
          <a class="button primary inverse" href="#">Download</a>
        </div>
      </section>

      <section id="blog" class="latest-blogs">
        <div class="section-copy reveal">
          <p class="eyebrow">Latest Blogs</p>
          <h2>Product notes and launches</h2>
        </div>
        <div class="blog-grid">${blogPosts}</div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-mark">Google Antigravity</div>
      <a class="footer-link" href="#product">Product</a>
      <a class="footer-link" href="#use-cases">Use cases</a>
      <a class="footer-link" href="#download">Download</a>
    </footer>
  `;
}

function bootParticles(registry: ScrollAnimationRegistry): void {
  const hero = document.querySelector<HTMLElement>('#hero-particles');
  const download = document.querySelector<HTMLElement>('#download-particles');
  if (hero) {
    registry.addParticleScene(new ParticleScene({
      container: hero,
      density: 210,
      particlesScale: 0.75,
      ringWidth: 0.18,
      ringWidth2: 0.05,
      ringDisplacement: 0.22,
      interactive: true,
      mode: 'hero',
    }));
  }
  if (download) {
    registry.addParticleScene(new ParticleScene({
      container: download,
      theme: 'dark',
      density: 150,
      particlesScale: 0.66,
      ringDisplacement: 0.24,
      interactive: true,
      mode: 'orb',
      color1: '#FFFFFF',
      color2: '#B7BFD9',
      color3: '#3279F9',
    }));
  }

  document.querySelectorAll<HTMLElement>('[data-particle="feature"]').forEach((container) => {
    registry.addParticleScene(new ParticleScene({
      container,
      density: 62,
      particlesScale: 0.54,
      ringDisplacement: 0.18,
      interactive: false,
      mode: 'icon',
      color1: container.dataset.color ?? '#3279F9',
      color2: '#E6EAF0',
      color3: '#FFFFFF',
    }));
  });

  document.querySelectorAll<HTMLElement>('[data-particle="solution"]').forEach((container) => {
    registry.addParticleScene(new ParticleScene({
      container,
      density: 72,
      particlesScale: 0.58,
      ringDisplacement: 0.2,
      interactive: true,
      mode: 'orb',
      color1: '#3279F9',
      color2: '#34A853',
      color3: '#FBBC04',
    }));
  });
}

function installModal(): void {
  const trigger = document.querySelector<HTMLButtonElement>('.video-wrapper');
  const modal = document.querySelector<HTMLElement>('.modal-video');
  const close = document.querySelector<HTMLButtonElement>('.modal-close');
  const player = document.querySelector<HTMLVideoElement>('.modal-player');
  if (!trigger || !modal || !close || !player) return;

  const hide = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    player.pause();
  };

  trigger.addEventListener('click', () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    player.currentTime = 0;
    void player.play();
  });
  close.addEventListener('click', hide);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) hide();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
}

renderApp();
const registry = new ScrollAnimationRegistry(document.body);
bootParticles(registry);
installModal();
registry.register();
registry.startParticleLoop();

window.addEventListener('beforeunload', () => registry.destroy());
