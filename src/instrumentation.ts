import type { Instrumentation } from "next";

export function register() {
  console.log(`[server] Essential Hustle started (v${process.env.APP_VERSION ?? "?"})`);
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(
    `[error] ${request.method} ${request.path} — ${msg} (${context.routeType}, ${context.routePath})`,
  );
};
