import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = ["/admin", "/client", "/api/admin", "/api/client"];
const blockedPathPatterns = [
  /\.env/i,
  /wp-admin/i,
  /wp-login/i,
  /phpmyadmin/i,
  /xmlrpc\.php/i,
  /\.\./,
];

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (blockedPathPatterns.some((pattern) => pattern.test(pathname))) return new NextResponse("Not found", { status: 404 });
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !sameOrigin(req)) {
    return NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 });
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) { if (!token) return pathname.startsWith("/api/") ? NextResponse.json({ error: "Please sign in to continue." }, { status: 401 }) : NextResponse.redirect(new URL("/login", req.url)); if (token.role !== "ADMIN") return pathname.startsWith("/api/") ? NextResponse.json({ error: "You do not have permission to do that." }, { status: 403 }) : NextResponse.redirect(new URL("/client/dashboard", req.url)); }
  if (pathname.startsWith("/client") || pathname.startsWith("/api/client")) { if (!token) return pathname.startsWith("/api/") ? NextResponse.json({ error: "Please sign in to continue." }, { status: 401 }) : NextResponse.redirect(new URL("/login", req.url)); if (token.role !== "CLIENT") return pathname.startsWith("/api/") ? NextResponse.json({ error: "You do not have permission to do that." }, { status: 403 }) : NextResponse.redirect(new URL("/admin/dashboard", req.url)); }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/client/:path*", "/api/admin/:path*", "/api/client/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"] };
