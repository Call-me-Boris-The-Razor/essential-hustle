import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startedAt;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);

  let version = "unknown";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require("../../../../package.json") as { version: string };
    version = pkg.version;
  } catch {
    // standalone build may not have package.json accessible
  }

  return NextResponse.json(
    {
      status: "ok",
      version,
      uptime: uptimeSeconds,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "unknown",
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
