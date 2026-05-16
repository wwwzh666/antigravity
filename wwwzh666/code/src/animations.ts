import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ParticleScene } from './particle-scene';

gsap.registerPlugin(ScrollTrigger);

export class ScrollAnimationRegistry {
  private readonly root: HTMLElement;
  private readonly particleScenes: ParticleScene[] = [];
  private rafId = 0;
  private lastTime = performance.now();

  constructor(root: HTMLElement) {
    this.root = root;
  }

  addParticleScene(scene: ParticleScene): void {
    this.particleScenes.push(scene);
  }

  startParticleLoop(): void {
    const tick = (time: number) => {
      const delta = Math.min(0.04, (time - this.lastTime) / 1000);
      this.lastTime = time;
      this.particleScenes.forEach((scene) => scene.render(delta));
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  register(): void {
    this.registerHero();
    this.registerTypedHeaders();
    this.registerReveals();
    this.registerAgentIcons();
    this.registerVideoCursor();
    this.registerUseCaseHover();
    this.registerFooter();
    ScrollTrigger.refresh();
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.particleScenes.forEach((scene) => scene.kill());
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  private registerHero(): void {
    const hero = this.root.querySelector<HTMLElement>('.welcome-wrapper');
    const logo = this.root.querySelector<HTMLElement>('.logo-container');
    const cta = this.root.querySelector<HTMLElement>('.welcome-cta');
    const heroVideo = this.root.querySelector<HTMLElement>('.hero-video-wrapper');
    const heroParticles = this.particleScenes[0];
    if (!hero || !logo || !cta || !heroVideo || !heroParticles) return;

    const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    intro.from(logo, { opacity: 0, y: 22, duration: 1.2 });
    intro.from('.landing-main-header .char', { opacity: 0, yPercent: 70, stagger: 0.012, duration: 0.65 }, 0.18);
    intro.from(cta.children, { opacity: 0, y: 30, stagger: 0.08, duration: 0.8 }, 0.55);
    intro.from(heroVideo, { opacity: 0, duration: 1.8 }, 0.35);

    const scaleProxy = { value: 0.75, progress: 0.88 };
    gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'center top',
        end: 'bottom top',
        scrub: true,
      },
    })
      .to(heroVideo, { opacity: 0.08, scale: 1.08, ease: 'none' }, 0)
      .to('.welcome-section', { y: -90, opacity: 0.25, ease: 'none' }, 0)
      .to(scaleProxy, {
        value: 0.48,
        progress: 0.35,
        ease: 'none',
        onUpdate: () => {
          heroParticles.setScale(scaleProxy.value);
          heroParticles.setProgress(scaleProxy.progress);
        },
      }, 0);
  }

  private registerTypedHeaders(): void {
    this.root.querySelectorAll<HTMLElement>('[data-typed]').forEach((element) => {
      const chars = Array.from(element.querySelectorAll<HTMLElement>('.char'));
      const cursor = element.querySelector<HTMLElement>('.typed-cursor');
      gsap.set(chars, { opacity: 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 78%',
          once: true,
        },
      })
        .to(chars, { opacity: 1, stagger: 0.009, duration: 0.03, ease: 'none' })
        .fromTo(cursor, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.08);
    });
  }

  private registerReveals(): void {
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 36,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('.feature-card, .blog-card').forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 34,
        duration: 0.62,
        delay: (index % 3) * 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }

  private registerAgentIcons(): void {
    const section = this.root.querySelector<HTMLElement>('.agent-first-section');
    const list = this.root.querySelector<HTMLElement>('.icon-list');
    if (!section || !list) return;

    gsap.to('.bouncer', {
      y: -18,
      duration: 1.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.08, from: 'center' },
    });
    gsap.to(list, {
      x: -220,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  private registerVideoCursor(): void {
    const wrapper = this.root.querySelector<HTMLElement>('.video-wrapper');
    const cursor = this.root.querySelector<HTMLElement>('.video-wrapper .custom-cursor');
    if (!wrapper || !cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3.out' });
    gsap.set(cursor, { scale: 0, opacity: 0 });

    wrapper.addEventListener('pointermove', (event) => {
      const rect = wrapper.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
    });
    wrapper.addEventListener('pointerenter', () => gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.26, ease: 'back.out(1.5)' }));
    wrapper.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.18, ease: 'power2.in' }));
  }

  private registerUseCaseHover(): void {
    this.root.querySelectorAll<HTMLElement>('.feature-card').forEach((card, index) => {
      const scene = this.particleScenes[index + 2];
      if (!scene) return;
      card.addEventListener('pointerenter', () => scene.onHoverStart());
      card.addEventListener('pointerleave', () => scene.onHoverEnd());
    });
  }

  private registerFooter(): void {
    const footer = this.root.querySelector<HTMLElement>('.site-footer');
    if (!footer) return;
    gsap.from('.footer-mark, .footer-link', {
      y: 46,
      opacity: 0,
      duration: 0.55,
      stagger: 0.05,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 75%',
        once: true,
      },
    });
  }
}
