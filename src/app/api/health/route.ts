import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startedAt;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);

  return NextResponse.json(
    {
      status: "ok",
      version: process.env.APP_VERSION ?? "unknown",
      gitHash: process.env.GIT_HASH ?? "unknown",
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
