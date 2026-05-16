import type { SiteData } from './types';

export const siteData: SiteData = {
  nav: [
    { label: 'Product', href: '#product' },
    { label: 'Use cases', href: '#use-cases' },
    { label: 'Blog', href: '#blog' },
    { label: 'Download', href: '#download' },
  ],
  hero: {
    eyebrow: 'Google Antigravity',
    headline: ['Build the new way', 'with agent-first development'],
    primaryCta: 'Download',
    secondaryCta: 'View docs',
  },
  agentFirst: {
    title:
      'Google Antigravity is our agentic development platform, allowing anyone to build in the agent-first era.',
    icons: [
      'code',
      'terminal',
      'deployed_code',
      'hub',
      'travel_explore',
      'data_object',
      'auto_awesome',
      'web_asset',
      'rocket_launch',
      'polyline',
      'smart_toy',
      'check_circle',
    ],
  },
  video: {
    title: 'See the new development loop',
    description:
      'Agents plan, code, browse, verify, and report back while the interface keeps every action inspectable.',
    cursorText: 'Play video',
  },
  useCases: [
    {
      id: 'professional',
      title: 'Professional developer',
      description:
        'Run background agents on real backlog tasks while keeping review, verification, and trust in one workspace.',
      icon: '/assets/icons/professional.svg',
      texture: '/assets/textures/professional.png',
      color: '#3279F9',
    },
    {
      id: 'frontend',
      title: 'Frontend developer',
      description:
        'Use browser-in-the-loop iteration to refine UI states, responsiveness, and visual polish faster.',
      icon: '/assets/icons/frontend-icon.svg',
      texture: '/assets/textures/frontend.png',
      color: '#34A853',
    },
    {
      id: 'fullstack',
      title: 'Full stack developer',
      description:
        'Coordinate app code, data flows, testing, and deployment artifacts from one agent-aware surface.',
      icon: '/assets/icons/full-stack-icon.svg',
      texture: '/assets/textures/fullstack.png',
      color: '#FBBC04',
    },
  ],
  solutions: [
    {
      title: 'Plan',
      subtitle: 'agents create inspectable tasks',
      description:
        'Each task begins with context, assumptions, and a trail of decisions that stays visible as work evolves.',
      texture: '/assets/textures/individual.png',
    },
    {
      title: 'Build',
      subtitle: 'parallel work stays coordinated',
      description:
        'Agents edit, test, and reconcile changes while keeping the developer in control of the final path.',
      texture: '/assets/textures/cube.png',
    },
  ],
  blogPosts: [
    { category: 'Product', title: 'Gemini 3.1 Pro in Google Antigravity', date: 'Feb 19, 2026' },
    { category: 'Product', title: 'Gemini 3 Flash in Google Antigravity', date: 'Dec 17, 2025' },
    { category: 'Product', title: 'Introducing Google Antigravity', date: 'Nov 18, 2025' },
  ],
};
