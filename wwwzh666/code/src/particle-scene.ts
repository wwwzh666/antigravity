import * as THREE from 'three';
import { poissonDiskSample } from './poisson';
import type { ParticleSceneOptions } from './types';

const palette = ['#3279F9', '#EA4335', '#FBBC04', '#34A853', '#B7BFD9'];

function colorToArray(color: string): [number, number, number] {
  const value = new THREE.Color(color);
  return [value.r, value.g, value.b];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class ParticleScene {
  private readonly container: HTMLElement;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly uniforms: Record<string, THREE.IUniform>;
  private readonly particles: THREE.Points;
  private readonly interactive: boolean;
  private readonly pointer = new THREE.Vector2(0, 0);
  private readonly targetPointer = new THREE.Vector2(0, 0);
  private frame = 0;
  private visible = true;
  private running = true;
  private width = 1;
  private height = 1;
  private hoverTarget = 0;
  private hover = 0;
  private resizeObserver?: ResizeObserver;

  constructor(options: ParticleSceneOptions) {
    this.container = options.container;
    this.interactive = options.interactive ?? true;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.renderer.domElement);

    const colors = [
      options.color1 ?? palette[0],
      options.color2 ?? palette[1],
      options.color3 ?? (options.theme === 'dark' ? '#E6EAF0' : palette[2]),
    ].map(colorToArray);

    const geometry = this.createGeometry(options, colors);
    this.uniforms = {
      uTime: { value: 0 },
      uScale: { value: options.particlesScale ?? 0.75 },
      uProgress: { value: options.mode === 'icon' ? 0.72 : 0.88 },
      uHover: { value: 0 },
      uPointer: { value: this.pointer },
      uPointerActive: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uRingDisplacement: { value: options.ringDisplacement ?? 0.15 },
      uDark: { value: options.theme === 'dark' ? 1 : 0 },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.NormalBlending,
      uniforms: this.uniforms,
      vertexShader: `
        attribute vec3 aBase;
        attribute vec3 aTarget;
        attribute vec3 aColor;
        attribute float aSeed;
        attribute float aSize;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uScale;
        uniform float uProgress;
        uniform float uHover;
        uniform float uPointerActive;
        uniform float uPixelRatio;
        uniform float uRingDisplacement;
        uniform vec2 uPointer;

        void main() {
          vec3 pos = mix(aBase, aTarget, uProgress);
          float orbit = sin(uTime * 0.7 + aSeed * 7.1 + length(pos.xy) * 3.8);
          float pulse = cos(uTime * 0.52 + aSeed * 4.2);
          pos.z += (orbit * 0.55 + pulse * 0.3) * uRingDisplacement;

          vec2 delta = pos.xy - uPointer;
          float pointerDistance = max(length(delta), 0.0001);
          float pointerWave = smoothstep(0.95, 0.0, pointerDistance) * uPointerActive;
          pos.xy += normalize(delta) * pointerWave * (0.46 + uHover * 0.12);
          pos.z += pointerWave * 0.26;
          pos.xy *= 1.0 + uHover * 0.035;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uScale * uPixelRatio * (8.0 / -mvPosition.z);
          vColor = aColor;
          vAlpha = 0.46 + pointerWave * 0.22 + uHover * 0.08;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 point = gl_PointCoord - vec2(0.5);
          float distanceToCenter = length(point);
          float alpha = smoothstep(0.5, 0.12, distanceToCenter) * vAlpha;
          if (alpha < 0.02) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    this.camera.position.z = options.cameraZoom ?? 7.2;

    this.addListeners();
    this.resize();
  }

  render(delta = 0.016): void {
    if (!this.running || !this.visible) return;
    this.frame += delta;
    this.pointer.lerp(this.targetPointer, 0.09);
    this.hover += (this.hoverTarget - this.hover) * 0.08;
    this.uniforms.uTime.value = this.frame;
    this.uniforms.uHover.value = this.hover;
    this.uniforms.uPointerActive.value += ((this.hoverTarget > 0 ? 1 : 0) - this.uniforms.uPointerActive.value) * 0.08;
    this.renderer.render(this.scene, this.camera);
  }

  setScale(scale: number): void {
    this.uniforms.uScale.value = scale;
  }

  setProgress(progress: number): void {
    this.uniforms.uProgress.value = clamp(progress, 0, 1);
  }

  onHoverStart(): void {
    this.hoverTarget = 1;
  }

  onHoverEnd(): void {
    this.hoverTarget = 0;
  }

  pause(): void {
    this.visible = false;
  }

  resume(): void {
    this.visible = true;
  }

  stop(): void {
    this.running = false;
  }

  kill(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
    this.particles.geometry.dispose();
    (this.particles.material as THREE.Material).dispose();
    this.renderer.domElement.remove();
  }

  private createGeometry(options: ParticleSceneOptions, colors: number[][]): THREE.BufferGeometry {
    const count = clamp(Math.round((options.density ?? 180) * 7), 360, 1900);
    const radius = 2 / Math.sqrt(count) * 0.92;
    const samples = poissonDiskSample(2, 2, radius, count);
    while (samples.length < count) samples.push({ x: Math.random() * 2, y: Math.random() * 2 });

    const base = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const color = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const ringWidth = options.ringWidth ?? 0.15;
    const ringWidth2 = options.ringWidth2 ?? 0.05;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const mode = options.mode ?? 'hero';

    for (let i = 0; i < count; i += 1) {
      const point = samples[i];
      const sx = (point.x - 1) * 3.2;
      const sy = (point.y - 1) * 1.8;
      const angle = i * golden;
      const band = i % 2 === 0 ? ringWidth : ringWidth2;
      const wave = Math.sin(i * 0.17) * band;
      const radiusMain = mode === 'icon' ? 0.52 + wave : 0.95 + wave;
      const stretchX = mode === 'orb' ? 1.1 : 1.85;
      const stretchY = mode === 'orb' ? 1.1 : 0.82;
      const tx = Math.cos(angle) * radiusMain * stretchX;
      const ty = Math.sin(angle) * radiusMain * stretchY + Math.sin(angle * 2) * 0.16;
      const tz = Math.sin(angle * 3) * 0.22;
      const colorPick = colors[i % colors.length];

      base[i * 3] = sx + Math.sin(i) * 0.05;
      base[i * 3 + 1] = sy + Math.cos(i * 0.5) * 0.05;
      base[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;
      color[i * 3] = colorPick[0];
      color[i * 3 + 1] = colorPick[1];
      color[i * 3 + 2] = colorPick[2];
      seed[i] = Math.random();
      size[i] = mode === 'icon' ? 20 + Math.random() * 15 : 15 + Math.random() * 18;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(target, 3));
    geometry.setAttribute('aBase', new THREE.BufferAttribute(base, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    return geometry;
  }

  private addListeners(): void {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) this.resume();
      else this.pause();
    });
    observer.observe(this.container);

    if (!this.interactive) return;
    this.container.addEventListener('pointermove', (event) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 3.5;
      const y = -((event.clientY - rect.top) / rect.height - 0.5) * 2.1;
      this.targetPointer.set(x, y);
    });
    this.container.addEventListener('pointerenter', () => this.onHoverStart());
    this.container.addEventListener('pointerleave', () => this.onHoverEnd());
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
