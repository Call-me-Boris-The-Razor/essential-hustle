import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads and shows site name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("text=Essential Hustle")).toBeVisible();
  });

  test("homepage has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Essential Hustle/i);
  });

  test("navigation links are visible on desktop", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav");
    await expect(nav).toBeVisible();
    await expect(nav.locator("text=Services").first()).toBeVisible();
    await expect(nav.locator("text=Projects").first()).toBeVisible();
    await expect(nav.locator("text=Blog").first()).toBeVisible();
  });

  test("health API returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.version).toBeDefined();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("body")).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("body")).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("body")).toBeVisible();
  });

  test("404 page shows for invalid route", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("i18n routing", () => {
  test("Russian locale loads at /ru", async ({ page }) => {
    await page.goto("/ru");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Chinese locale loads at /zh", async ({ page }) => {
    await page.goto("/zh");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("sitemap.xml is accessible", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("<?xml");
    expect(text).toContain("essentialhustle.dev");
  });

  test("robots.txt is accessible", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
  });

  test("RSS feed is accessible", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("<?xml");
  });

  test("OpenGraph image is generated", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image");
  });
});

test.describe("Security headers", () => {
  test("response has security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["content-security-policy"]).toBeDefined();
    expect(headers["strict-transport-security"]).toBeDefined();
  });
});

test.describe("Contact form", () => {
  test("contact section is visible on homepage", async ({ page }) => {
    await page.goto("/");
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

  test("contact form has all required fields", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();
  });
});
