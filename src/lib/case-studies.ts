export interface CaseStudy {
  slug: string;
  title: string;
  tags: readonly string[];
  status: "production" | "active";
  stack: readonly string[];
  timeline: string;
  links?: { label: string; url: string }[];
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "sortina",
    title: "Sortina",
    tags: ["React", "Fastify", "Prisma", "Docker"],
    status: "production",
    stack: ["React 19", "TypeScript", "Fastify 5", "Prisma 6", "PostgreSQL", "Docker", "Nginx", "TanStack Query"],
    timeline: "3 months",
  },
  {
    slug: "dcc",
    title: "Drone Control Center",
    tags: ["Python", "MAVLink", "WebSocket", "Flask"],
    status: "active",
    stack: ["Python 3.12", "Flask", "MAVLink", "WebSocket", "CRSF Protocol", "Raspberry Pi", "Docker"],
    timeline: "6 months",
  },
  {
    slug: "china-tours",
    title: "China Business Tours",
    tags: ["Next.js", "Supabase", "TypeScript"],
    status: "production",
    stack: ["Next.js 15", "TypeScript", "Supabase", "Tailwind CSS", "Vercel", "PostgreSQL"],
    timeline: "2 months",
  },
  {
    slug: "mux",
    title: "Video Multiplexor",
    tags: ["C", "STM32", "CRSF", "Custom PCB"],
    status: "active",
    stack: ["C", "STM32 HAL", "KiCad", "CRSF Protocol", "UART", "Analog Multiplexers", "Logic Analyzer"],
    timeline: "4 months",
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
