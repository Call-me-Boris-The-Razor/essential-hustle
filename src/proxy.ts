import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const INTL_SKIP = /^\/(api|_next|_vercel)\//;

export default function middleware(request: NextRequest) {
  const start = Date.now();
  const { method } = request;
  const path = request.nextUrl.pathname;

  // API and internal routes — log only, skip i18n
  if (INTL_SKIP.test(path)) {
    const ms = Date.now() - start;
    console.log(`${method} ${path} ${ms}ms`);
    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  const ms = Date.now() - start;
  const status = response instanceof NextResponse ? response.status : 200;
  console.log(`${method} ${path} ${status} ${ms}ms`);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.svg).*)"],
};
