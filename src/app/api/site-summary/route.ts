import { NextResponse } from "next/server";
import { SITE_CONFIG, SERVICES, PROJECTS } from "@/lib/site-config";

// Default locale messages for API response
import messages from "../../../../messages/en.json";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

export const GET = () =>
  NextResponse.json({
    name: SITE_CONFIG.name,
    domain: SITE_CONFIG.domain,
    tagline: messages.meta.tagline,
    description: messages.meta.description,
    contact: {
      email: SITE_CONFIG.email,
      telegram: SITE_CONFIG.telegram,
      github: SITE_CONFIG.github,
    },
    services: SERVICES.map((s) => {
      const svc = messages.services[s.id as keyof typeof messages.services];
      return {
        id: s.id,
        title: typeof svc === "object" && "title" in svc ? svc.title : s.id,
        tags: [...s.tags],
      };
    }),
    projects: PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      tags: [...p.tags],
    })),
  }, { headers: CACHE_HEADERS });
