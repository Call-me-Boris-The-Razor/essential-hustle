// All site content and configuration — single source of truth
// No hardcoded values in components

export const SITE_CONFIG = {
  name: "Essential Hustle",
  domain: "essentialhustle.dev",
  tagline: "Engineering that moves fast",
  description:
    "We build infrastructure, integrate AI, and ship embedded systems. From cloud to silicon — we deliver.",
  email: "hello@essentialhustle.dev",
  github: "https://github.com/Call-me-Boris-The-Razor",
  telegram: "https://t.me/essentialhustle",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    id: "devops",
    title: "DevOps & Cloud",
    description:
      "Docker orchestration, CI/CD pipelines, server hardening, monitoring. Production-grade infrastructure that scales.",
    tags: ["Docker", "CI/CD", "Nginx", "Linux", "Monitoring"],
  },
  {
    id: "ai",
    title: "AI Integration",
    description:
      "On-premise LLM deployment, speech synthesis, whisper transcription, custom AI pipelines on your own hardware.",
    tags: ["LLM", "TTS", "STT", "Ollama", "GPU Inference"],
  },
  {
    id: "embedded",
    title: "Embedded & IoT",
    description:
      "Custom firmware, drone flight controllers, telemetry systems, hardware multiplexors. From PCB to cloud.",
    tags: ["C/C++", "MAVLink", "STM32", "Custom Protocols"],
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Full-stack applications with React, Next.js, Fastify. Real-time dashboards, SaaS platforms, admin panels.",
    tags: ["React", "Next.js", "TypeScript", "PostgreSQL"],
  },
] as const;

export const PROJECTS = [
  {
    id: "sortina",
    title: "Sortina",
    description: "Logistics rate management platform with multi-role access and real-time data.",
    tags: ["React", "Fastify", "Prisma", "Docker"],
    status: "production" as const,
  },
  {
    id: "dcc",
    title: "Drone Control Center",
    description: "Ground station for drone fleet management with live telemetry and mission planning.",
    tags: ["Python", "MAVLink", "WebSocket", "Flask"],
    status: "active" as const,
  },
  {
    id: "china-tours",
    title: "China Business Tours",
    description: "Platform connecting businesses with 258+ tech companies for organized factory visits.",
    tags: ["Next.js", "Supabase", "TypeScript"],
    status: "production" as const,
  },
  {
    id: "mux",
    title: "Video Multiplexor",
    description: "Custom hardware & firmware for multi-channel analog video switching with serial control.",
    tags: ["C", "STM32", "CRSF", "Custom PCB"],
    status: "active" as const,
  },
] as const;

export const ABOUT_TEXT = {
  headline: "Full-stack. From silicon to cloud.",
  paragraphs: [
    "We're a small engineering team based in Asia that ships across the entire technology stack — from embedded C firmware to React dashboards, from Docker infrastructure to custom AI deployments.",
    "Every project we take on runs in production. No prototypes gathering dust. We build things that work, harden them, and keep them running.",
  ],
  stats: [
    { value: "10+", label: "Production Systems" },
    { value: "4", label: "Countries Served" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Monitoring" },
  ],
} as const;

export const HERO_TEXT = {
  badge: "Engineering Studio",
  headline: ["We build what", "others outsource"],
  cta: { primary: "Explore Services", secondary: "View Projects" },
  ctaContact: "Get in Touch",
  scroll: "Scroll",
  established: 2024,
} as const;

export const CONTACT_TEXT = {
  label: "Let's talk",
  headline: "Have a project in mind?",
  description:
    "We're always looking for interesting engineering challenges. Drop us a line and let's build something great.",
} as const;
