import { SITE_CONFIG, SERVICES } from "@/lib/site-config";

// EN messages for structured data (search engines expect a single canonical language)
import messages from "../../messages/en.json";

const BASE_URL = `https://${SITE_CONFIG.domain}`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description: messages.meta.description,
  email: SITE_CONFIG.email,
  sameAs: [SITE_CONFIG.github, SITE_CONFIG.telegram],
  knowsAbout: [...new Set(SERVICES.flatMap((s) => [...s.tags]))],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: BASE_URL,
  description: messages.meta.description,
};

const serviceSchemas = SERVICES.map((service) => {
  const svc = messages.services[service.id as keyof typeof messages.services];
  const title = typeof svc === "object" && "title" in svc ? svc.title : service.id;
  const desc = typeof svc === "object" && "description" in svc ? svc.description : "";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: desc,
    provider: { "@type": "Organization", name: SITE_CONFIG.name, url: BASE_URL },
    areaServed: "Worldwide",
    serviceType: service.tags.join(", "),
  };
});

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
