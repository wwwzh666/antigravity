export interface ParticleSceneOptions {
  container: HTMLElement;
  theme?: 'light' | 'dark';
  density?: number;
  particlesScale?: number;
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
  interactive?: boolean;
  texture?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  cameraZoom?: number;
  mode?: 'hero' | 'orb' | 'icon';
}

export interface SiteData {
  nav: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    headline: string[];
    primaryCta: string;
    secondaryCta: string;
  };
  agentFirst: {
    title: string;
    icons: string[];
  };
  video: {
    title: string;
    description: string;
    cursorText: string;
  };
  useCases: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    texture: string;
    color: string;
  }>;
  solutions: Array<{
    title: string;
    subtitle: string;
    description: string;
    texture: string;
  }>;
  blogPosts: Array<{
    category: string;
    title: string;
    date: string;
  }>;
}
