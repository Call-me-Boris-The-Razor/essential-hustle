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
    tags: ["Python", "MAVLink", "Raspberry Pi", "Flask"],
    status: "active",
    stack: ["Python 3.12", "Flask", "MAVLink", "WireGuard", "Raspberry Pi 5", "PX4", "YOLO", "systemd"],
    timeline: "6 months",
  },
  {
    slug: "china-tours",
    title: "China Business Tours",
    tags: ["Next.js", "Supabase", "TypeScript"],
    status: "production",
    stack: ["Next.js 14", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion", "PostgreSQL"],
    timeline: "2 months",
  },
  {
    slug: "mux",
    title: "CRSF Relay",
    tags: ["C", "STM32", "CRSF/ELRS", "Custom PCB"],
    status: "active",
    stack: ["C", "STM32H743", "Betaflight", "CRSF Protocol", "ELRS", "UART", "Saleae Logic"],
    timeline: "4 months",
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
