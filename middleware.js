import { NextResponse } from "next/server";

/**
 * Routes that are allowed through without being redirected to /moving-domains.
 * - /moving-domains          – the announcement page itself
 * - /pages/dashboard/**      – admin dashboard (keep operational)
 * - /pages/login             – login page (keep operational)
 * - /api/**                  – all API routes (keep operational)
 *
 * Static files and Next.js internals are excluded from the middleware entirely
 * via the matcher regex below, so they never reach this function.
 */
const ALLOWED_PREFIXES = [
  "/moving-domains",
  "/pages/dashboard",
  "/pages/login",
  "/api/",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the path if it starts with any of the allowed prefixes
  const isAllowed = ALLOWED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isAllowed) {
    return NextResponse.next();
  }

  // Redirect everything else to the moving-domains announcement page
  const url = request.nextUrl.clone();
  url.pathname = "/moving-domains";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on all routes except static files that Next.js serves automatically
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
