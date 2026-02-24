import { SITE_CONFIG, SERVICES } from "@/lib/site-config";

const BASE_URL = `https://${SITE_CONFIG.domain}`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
  sameAs: [SITE_CONFIG.github, SITE_CONFIG.telegram],
  knowsAbout: [
    "DevOps",
    "Docker",
    "CI/CD",
    "AI Integration",
    "LLM Deployment",
    "Embedded Systems",
    "IoT",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: BASE_URL,
  description: SITE_CONFIG.description,
};

const serviceSchemas = SERVICES.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: BASE_URL,
  },
  areaServed: "Worldwide",
  serviceType: service.tags.join(", "),
}));

export const JsonLd = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
    {serviceSchemas.map((schema, i) => (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    ))}
  </>
);
