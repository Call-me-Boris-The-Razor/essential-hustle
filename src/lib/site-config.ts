// Structural site data — non-translatable values only
// All UI strings are in messages/{locale}.json

export const SITE_CONFIG = {
  name: "Essential Hustle",
  domain: "essentialhustle.dev",
  email: "hello@essentialhustle.dev",
  github: "https://github.com/Call-me-Boris-The-Razor",
  telegram: "https://t.me/essentialhustle",
  established: 2024,
} as const;

export type ServiceId = "devops" | "ai" | "embedded" | "web";

export const NAV_LINKS = [
  { key: "services", href: "#services" },
  { key: "projects", href: "#projects" },
  { key: "about", href: "#about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "#contact" },
] as const;

export const SERVICES = [
  { id: "devops" as ServiceId, tags: ["Docker", "CI/CD", "Nginx", "Linux", "Monitoring"] },
  { id: "ai" as ServiceId, tags: ["LLM", "TTS", "STT", "Ollama", "GPU Inference"] },
  { id: "embedded" as ServiceId, tags: ["C/C++", "MAVLink", "STM32", "Custom Protocols"] },
  { id: "web" as ServiceId, tags: ["React", "Next.js", "TypeScript", "PostgreSQL"] },
] as const;

export const PROJECTS = [
  { id: "sortina", title: "Sortina", tags: ["React", "Fastify", "Prisma", "Docker"], status: "production" as const },
  { id: "dcc", title: "Drone Control Center", tags: ["Python", "MAVLink", "WebSocket", "Flask"], status: "active" as const },
  { id: "china-tours", title: "China Business Tours", tags: ["Next.js", "Supabase", "TypeScript"], status: "production" as const },
  { id: "mux", title: "Video Multiplexor", tags: ["C", "STM32", "CRSF", "Custom PCB"], status: "active" as const },
] as const;

export const ABOUT_STATS = [
  { value: "10+", key: "stat1" },
  { value: "4", key: "stat2" },
  { value: "99.9%", key: "stat3" },
  { value: "24/7", key: "stat4" },
] as const;
