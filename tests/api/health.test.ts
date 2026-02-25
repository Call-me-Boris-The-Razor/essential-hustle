import { describe, it, expect, vi, beforeEach } from "vitest";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("APP_VERSION", "0.11.0");
    vi.stubEnv("GIT_HASH", "abc1234");
    vi.stubEnv("NODE_ENV", "test");
  });

  it("returns status 200 with ok status", async () => {
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("returns version from APP_VERSION env", async () => {
    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(body.version).toBe("0.11.0");
  });

  it("returns gitHash from GIT_HASH env", async () => {
    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(body.gitHash).toBe("abc1234");
  });

  it("returns uptime as non-negative number", async () => {
    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(typeof body.uptime).toBe("number");
    expect(body.uptime).toBeGreaterThanOrEqual(0);
  });

  it("returns valid ISO 8601 timestamp", async () => {
    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(body.timestamp).toBeDefined();
    const date = new Date(body.timestamp);
    expect(date.getTime()).not.toBeNaN();
  });

  it("returns current NODE_ENV", async () => {
    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(body.env).toBe("test");
  });

  it("sets Cache-Control: no-store header", async () => {
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 'unknown' when APP_VERSION is not set", async () => {
    delete process.env.APP_VERSION;

    const { GET } = await import("@/app/api/health/route");
    const body = await (await GET()).json();

    expect(body.version).toBe("unknown");
  });
});
