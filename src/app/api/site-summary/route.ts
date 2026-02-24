import { NextResponse } from "next/server";
import {
  SITE_CONFIG,
  SERVICES,
  PROJECTS,
  ABOUT_TEXT,
  CONTACT_TEXT,
} from "@/lib/site-config";

export const GET = () =>
  NextResponse.json({
    name: SITE_CONFIG.name,
    domain: SITE_CONFIG.domain,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    contact: {
      email: SITE_CONFIG.email,
      telegram: SITE_CONFIG.telegram,
      github: SITE_CONFIG.github,
    },
    services: SERVICES.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      tags: [...s.tags],
    })),
    projects: PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      tags: [...p.tags],
    })),
    about: {
      headline: ABOUT_TEXT.headline,
      paragraphs: [...ABOUT_TEXT.paragraphs],
      stats: ABOUT_TEXT.stats.map((s) => ({ ...s })),
    },
    contact_text: {
      label: CONTACT_TEXT.label,
      headline: CONTACT_TEXT.headline,
      description: CONTACT_TEXT.description,
    },
  });
